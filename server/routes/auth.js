import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import rateLimit from 'express-rate-limit';
import { findUserByEmail, createUser, findUserById, updateUser, deleteUser, storeRefreshToken, hasRefreshToken, removeRefreshToken, storeResetToken, consumeResetToken } from '../db/store.js';
import { authenticate, generateTokens, getAccessCookieOptions, getRefreshCookieOptions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Pre-computed dummy hash for timing-safe login (prevents user enumeration)
const DUMMY_HASH = bcryptjs.hashSync('__timing_safe_dummy__', 12);

// Email verification tokens (in-memory, production would use DB)
const verificationTokens = new Map(); // token -> { userId, email, expiresAt }

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
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character'),
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated;

  const user = findUserByEmail(email);
  // Always compare against a hash to prevent timing-based user enumeration
  const hashToCompare = user ? user.password : DUMMY_HASH;
  const valid = await bcryptjs.compare(password, hashToCompare);

  if (!user || !valid) {
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

// ── POST /api/auth/send-verification — send verification email ────────────
router.post('/send-verification', authenticate, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.emailVerified) return res.status(400).json({ error: 'Email already verified' });

  const token = uuid().replace(/-/g, '');
  verificationTokens.set(token, { userId: user.id, email: user.email, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });

  // In production, send email. For now, log it.
  console.log(`[EMAIL VERIFY] Token for ${user.email}: ${token}`);
  console.log(`[EMAIL VERIFY] Verify link: /auth/verify?token=${token}`);

  res.json({ ok: true });
});

// ── POST /api/auth/verify-email — verify email with token ─────────────────
router.post('/verify-email', (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Token is required' });

  const entry = verificationTokens.get(token);
  if (!entry) return res.status(400).json({ error: 'Invalid or expired verification token' });
  verificationTokens.delete(token);
  if (Date.now() > entry.expiresAt) return res.status(400).json({ error: 'Token expired' });

  const updated = updateUser(entry.userId, { emailVerified: true });
  if (!updated) return res.status(404).json({ error: 'User not found' });

  res.json({ ok: true });
});

// Rate limit: 30 refresh attempts per 15 min per IP
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many refresh attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── POST /api/auth/refresh ─────────────────────────────────────────────────
router.post('/refresh', refreshLimiter, (req, res) => {
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
  res.clearCookie('refresh_token', { path: '/' });
  res.json({ ok: true });
});

// ── POST /api/auth/social ─────────────────────────────────────────────────
// Handles Google / Facebook token-based login
router.post('/social', loginLimiter, async (req, res) => {
  const { provider, token } = req.body || {};
  if (!provider || !token) return res.status(400).json({ error: 'Provider and token are required' });

  let email, name;

  try {
    if (provider === 'google') {
      // Verify Google ID token via Google's tokeninfo endpoint
      const gRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (!gRes.ok) return res.status(401).json({ error: 'Invalid Google token' });
      const gData = await gRes.json();
      if (!gData.email) return res.status(401).json({ error: 'Google token missing email' });
      // Validate audience claim to prevent confused deputy attacks
      const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      if (GOOGLE_CLIENT_ID && gData.aud !== GOOGLE_CLIENT_ID) {
        return res.status(401).json({ error: 'Google token audience mismatch' });
      }
      email = gData.email;
      name = gData.name || gData.email.split('@')[0];
    } else if (provider === 'facebook') {
      // Verify Facebook access token via Graph API
      const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(token)}`);
      if (!fbRes.ok) return res.status(401).json({ error: 'Invalid Facebook token' });
      const fbData = await fbRes.json();
      if (!fbData.email) return res.status(401).json({ error: 'Facebook account has no email. Please use email login.' });
      email = fbData.email;
      name = fbData.name || 'User';
    } else {
      return res.status(400).json({ error: 'Unsupported provider' });
    }
  } catch {
    return res.status(500).json({ error: 'Failed to verify social token' });
  }

  // Find or create user
  let user = findUserByEmail(email);
  if (!user) {
    const dummyHash = await bcryptjs.hash(uuid(), 12);
    user = createUser({
      id: 'usr_' + uuid().replace(/-/g, '').slice(0, 12),
      name,
      email,
      phone: '',
      password: dummyHash,
      role: 'user',
      provider,
    });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  storeRefreshToken(refreshToken);

  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
const forgotLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many reset attempts. Try again later.' } });
router.post('/forgot-password', forgotLimiter, (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const user = findUserByEmail(email);
  // Always return success to prevent email enumeration
  if (!user) return res.json({ ok: true });

  const token = uuid().replace(/-/g, '');
  storeResetToken(token, user.id);

  // In production, send email with reset link. For now, log it.
  console.log(`[PASSWORD RESET] Token for ${email}: ${token}`);
  console.log(`[PASSWORD RESET] Reset link: /auth/reset?token=${token}`);

  res.json({ ok: true });
});

// ── POST /api/auth/reset-password ────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const userId = consumeResetToken(token);
  if (!userId) return res.status(400).json({ error: 'Invalid or expired reset token' });

  const hash = await bcryptjs.hash(password, 12);
  const updated = updateUser(userId, { password: hash });
  if (!updated) return res.status(404).json({ error: 'User not found' });

  res.json({ ok: true });
});

// ── POST /api/auth/change-password ───────────────────────────────────────────
router.post('/change-password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password are required' });
  if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });

  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcryptjs.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

  const hash = await bcryptjs.hash(newPassword, 12);
  updateUser(user.id, { password: hash });

  res.json({ ok: true });
});

// ── PUT /api/auth/profile ────────────────────────────────────────────────────
router.put('/profile', authenticate, (req, res) => {
  const { name, phone } = req.body || {};
  const updates = {};
  if (name && typeof name === 'string' && name.trim().length >= 2 && name.length <= 100) {
    updates.name = name.trim();
  }
  if (phone !== undefined && typeof phone === 'string' && phone.length <= 20) {
    updates.phone = phone.trim();
  }
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid fields to update' });

  const updated = updateUser(req.user.id, updates);
  if (!updated) return res.status(404).json({ error: 'User not found' });

  res.json({ user: { id: updated.id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role } });
});

// ── DELETE /api/auth/account — delete own account ─────────────────────────────
router.delete('/account', authenticate, async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password is required to delete your account' });

  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Incorrect password' });

  deleteUser(user.id);

  // Clear auth cookies
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });

  res.json({ ok: true });
});

export default router;
