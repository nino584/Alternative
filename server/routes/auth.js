import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import rateLimit from 'express-rate-limit';
import { findUserByEmail, createUser, findUserById, storeRefreshToken, hasRefreshToken, removeRefreshToken } from '../db/store.js';
import { authenticate, generateTokens, getAccessCookieOptions, getRefreshCookieOptions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Rate limit: 10 login attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit: 5 registrations per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many registrations. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Schemas ──────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required').max(20),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated;

  const user = findUserByEmail(email);
  if (!user) {
    // Constant-time response to prevent user enumeration
    await bcryptjs.compare(password, '$2a$12$placeholder.hash.for.timing');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  storeRefreshToken(refreshToken);

  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', registerLimiter, validate(registerSchema), async (req, res) => {
  const { name, email, phone, password } = req.validated;

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hash = await bcryptjs.hash(password, 12);
  const user = createUser({
    id: 'usr_' + uuid().replace(/-/g, '').slice(0, 12),
    name,
    email,
    phone,
    password: hash,
    role: 'user', // Always user — admin created via seed only
  });

  const { accessToken, refreshToken } = generateTokens(user);
  storeRefreshToken(refreshToken);

  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// ── POST /api/auth/refresh ─────────────────────────────────────────────────
router.post('/refresh', (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token || !hasRefreshToken(token)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = findUserById(decoded.sub);
    if (!user) {
      removeRefreshToken(token);
      return res.status(401).json({ error: 'User not found' });
    }

    // Rotate: revoke old, issue new
    removeRefreshToken(token);
    const { accessToken, refreshToken } = generateTokens(user);
    storeRefreshToken(refreshToken);

    res.cookie('access_token', accessToken, getAccessCookieOptions());
    res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch {
    removeRefreshToken(token);
    return res.status(401).json({ error: 'Expired refresh token' });
  }
});

// ── POST /api/auth/logout ──────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  const token = req.cookies?.refresh_token;
  if (token) removeRefreshToken(token);

  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth' });
  res.json({ ok: true });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
