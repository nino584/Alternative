import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import rateLimit from 'express-rate-limit';
import {
  findUserByEmail, createUser, findUserById, updateUser, deleteUser,
  storeRefreshToken, hasRefreshToken, removeRefreshToken, removeAllRefreshTokensForUser,
  storeResetToken, consumeResetToken,
  getLoginAttempts, recordLoginAttempt,
} from '../db/store.js';
import { authenticate, generateTokens, getAccessCookieOptions, getRefreshCookieOptions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { passwordSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema } from '../schemas.js';
import { generateSecret, generateOtpauthUri, verifyTotp } from '../lib/totp.js';
import { logSecurityEvent, SEC_EVENTS } from '../lib/securityLog.js';

const router = Router();

// Pre-computed dummy hash for timing-safe login (prevents user enumeration)
const DUMMY_HASH = bcryptjs.hashSync('__timing_safe_dummy__', 12);

// Email verification tokens (in-memory, production would use DB)
const verificationTokens = new Map();

// ── Account Lockout (persisted via store.js) ─────────────────────────────────
function checkAccountLockout(email) {
  const attempts = getLoginAttempts(email);
  if (!attempts) return false;
  if (attempts.lockedUntil && new Date(attempts.lockedUntil) > new Date()) return true;
  return false;
}

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
  password: passwordSchema,
});

const twoFaVerifySchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be 6 digits'),
});

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.validated;
  const ua = req.headers['user-agent'] || '';
  const ip = req.ip;

  // Check account lockout BEFORE password comparison
  if (checkAccountLockout(email)) {
    logSecurityEvent(SEC_EVENTS.LOGIN_LOCKED, { email, ip, ua });
    return res.status(429).json({ error: 'Account temporarily locked due to too many failed attempts. Try again in 30 minutes.' });
  }

  const user = findUserByEmail(email);
  // Always compare against a hash to prevent timing-based user enumeration
  const hashToCompare = user ? user.password : DUMMY_HASH;
  const valid = await bcryptjs.compare(password, hashToCompare);

  if (!user || !valid) {
    recordLoginAttempt(email, true);
    logSecurityEvent(SEC_EVENTS.LOGIN_FAILED, { email, ip, ua });
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check if 2FA is enabled — require TOTP code
  if (user.twoFactorEnabled && user.twoFactorSecret) {
    const totpCode = req.body.totpCode;
    if (!totpCode) {
      // Password is correct but 2FA code needed — return special response
      return res.status(200).json({ requires2FA: true, message: 'Two-factor authentication code required' });
    }
    if (!verifyTotp(user.twoFactorSecret, totpCode)) {
      logSecurityEvent(SEC_EVENTS.TWO_FA_FAILED, { email, ip, ua, userId: user.id });
      return res.status(401).json({ error: 'Invalid two-factor authentication code' });
    }
  }

  // Successful login — clear failed attempts (persisted)
  recordLoginAttempt(email, false);

  const { accessToken, refreshToken } = generateTokens(user);
  storeRefreshToken(refreshToken, user.id, ua);

  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  const eventType = user.role === 'admin' ? SEC_EVENTS.ADMIN_LOGIN : SEC_EVENTS.LOGIN_SUCCESS;
  logSecurityEvent(eventType, { email, ip, ua, userId: user.id, role: user.role });

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', registerLimiter, validate(registerSchema), async (req, res) => {
  const { name, email, phone, password } = req.validated;
  const ua = req.headers['user-agent'] || '';
  const ip = req.ip;

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
  storeRefreshToken(refreshToken, user.id, ua);

  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  logSecurityEvent(SEC_EVENTS.REGISTER, { email, ip, ua, userId: user.id });

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
  const ua = req.headers['user-agent'] || '';

  if (!token || !hasRefreshToken(token, ua)) {
    if (token) {
      // Token exists but UA mismatch — possible theft
      logSecurityEvent(SEC_EVENTS.SUSPICIOUS_UA_CHANGE, { ip: req.ip, ua });
    }
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
    storeRefreshToken(refreshToken, user.id, ua);

    res.cookie('access_token', accessToken, getAccessCookieOptions());
    res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

    logSecurityEvent(SEC_EVENTS.TOKEN_REFRESH, { userId: user.id, ip: req.ip });

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

  logSecurityEvent(SEC_EVENTS.LOGOUT, { ip: req.ip, ua: req.headers['user-agent'] });

  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  res.json({ ok: true });
});

// ── POST /api/auth/social ─────────────────────────────────────────────────
// Handles Google / Facebook token-based login
router.post('/social', loginLimiter, async (req, res) => {
  const { provider, token } = req.body || {};
  const ua = req.headers['user-agent'] || '';
  const ip = req.ip;

  if (!provider || !token) return res.status(400).json({ error: 'Provider and token are required' });

  let email, name;

  try {
    if (provider === 'google') {
      const gRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (!gRes.ok) return res.status(401).json({ error: 'Invalid Google token' });
      const gData = await gRes.json();
      if (!gData.email) return res.status(401).json({ error: 'Google token missing email' });
      const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      if (GOOGLE_CLIENT_ID && gData.aud !== GOOGLE_CLIENT_ID) {
        return res.status(401).json({ error: 'Google token audience mismatch' });
      }
      email = gData.email;
      name = gData.name || gData.email.split('@')[0];
    } else if (provider === 'facebook') {
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
  storeRefreshToken(refreshToken, user.id, ua);

  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  logSecurityEvent(SEC_EVENTS.SOCIAL_LOGIN, { email, provider, ip, ua, userId: user.id });

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const user = findUserById(req.user.id);
  const has2FA = !!(user?.twoFactorEnabled);
  res.json({ user: { ...req.user, twoFactorEnabled: has2FA } });
});

// ── 2FA Setup: POST /api/auth/2fa/setup ──────────────────────────────────
// Admin-only: Generate TOTP secret and return otpauth URI for QR scanning
router.post('/2fa/setup', authenticate, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role !== 'admin') return res.status(403).json({ error: '2FA is only available for admin accounts' });
  if (user.twoFactorEnabled) return res.status(400).json({ error: '2FA is already enabled' });

  const secret = generateSecret();
  // Store secret temporarily (not enabled until verified)
  updateUser(user.id, { twoFactorSecret: secret, twoFactorEnabled: false });

  const uri = generateOtpauthUri(secret, user.email);
  res.json({ secret, otpauthUri: uri });
});

// ── 2FA Verify: POST /api/auth/2fa/verify ────────────────────────────────
// Confirm 2FA setup by providing a valid code from authenticator app
router.post('/2fa/verify', authenticate, validate(twoFaVerifySchema), (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.twoFactorSecret) return res.status(400).json({ error: 'Run 2FA setup first' });
  if (user.twoFactorEnabled) return res.status(400).json({ error: '2FA is already enabled' });

  const { code } = req.validated;
  if (!verifyTotp(user.twoFactorSecret, code)) {
    logSecurityEvent(SEC_EVENTS.TWO_FA_FAILED, { userId: user.id, ip: req.ip, action: 'setup_verify' });
    return res.status(400).json({ error: 'Invalid code. Make sure your authenticator app is synced.' });
  }

  updateUser(user.id, { twoFactorEnabled: true });
  logSecurityEvent(SEC_EVENTS.TWO_FA_ENABLED, { userId: user.id, email: user.email, ip: req.ip });

  res.json({ ok: true, message: '2FA enabled successfully' });
});

// ── 2FA Disable: POST /api/auth/2fa/disable ──────────────────────────────
router.post('/2fa/disable', authenticate, async (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.twoFactorEnabled) return res.status(400).json({ error: '2FA is not enabled' });

  // Require password confirmation to disable
  const { password, code } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password is required to disable 2FA' });

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Incorrect password' });

  // Also require a valid TOTP code
  if (!code || !verifyTotp(user.twoFactorSecret, code)) {
    return res.status(400).json({ error: 'Valid 2FA code is required' });
  }

  updateUser(user.id, { twoFactorSecret: null, twoFactorEnabled: false });
  logSecurityEvent(SEC_EVENTS.TWO_FA_DISABLED, { userId: user.id, email: user.email, ip: req.ip });

  res.json({ ok: true, message: '2FA disabled' });
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
const forgotLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many reset attempts. Try again later.' } });
router.post('/forgot-password', forgotLimiter, (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const user = findUserByEmail(email);
  // Always return success to prevent email enumeration
  if (!user) return res.json({ ok: true });

  const token = uuid().replace(/-/g, '');
  storeResetToken(token, user.id);

  logSecurityEvent(SEC_EVENTS.PASSWORD_RESET_REQUESTED, { email, ip: req.ip });

  console.log(`[PASSWORD RESET] Token for ${email}: ${token}`);
  console.log(`[PASSWORD RESET] Reset link: /auth/reset?token=${token}`);

  res.json({ ok: true });
});

// ── POST /api/auth/reset-password (with full password strength validation) ──
router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  const { token, password } = req.validated;

  const userId = consumeResetToken(token);
  if (!userId) return res.status(400).json({ error: 'Invalid or expired reset token' });

  const hash = await bcryptjs.hash(password, 12);
  const updated = updateUser(userId, { password: hash });
  if (!updated) return res.status(404).json({ error: 'User not found' });

  // Revoke all refresh tokens for this user (force re-login everywhere)
  removeAllRefreshTokensForUser(userId);

  logSecurityEvent(SEC_EVENTS.PASSWORD_RESET_COMPLETED, { userId, ip: req.ip });

  res.json({ ok: true });
});

// ── POST /api/auth/change-password (with full password strength validation) ──
router.post('/change-password', authenticate, validate(changePasswordSchema), async (req, res) => {
  const { currentPassword, newPassword } = req.validated;

  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcryptjs.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

  const hash = await bcryptjs.hash(newPassword, 12);
  updateUser(user.id, { password: hash });

  // Revoke all other refresh tokens (keep current session alive by issuing new tokens)
  removeAllRefreshTokensForUser(user.id);
  const ua = req.headers['user-agent'] || '';
  const { accessToken, refreshToken } = generateTokens(user);
  storeRefreshToken(refreshToken, user.id, ua);
  res.cookie('access_token', accessToken, getAccessCookieOptions());
  res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());

  logSecurityEvent(SEC_EVENTS.PASSWORD_CHANGED, { userId: user.id, email: user.email, ip: req.ip });

  res.json({ ok: true });
});

// ── PUT /api/auth/profile (with Zod validation) ──────────────────────────────
router.put('/profile', authenticate, validate(updateProfileSchema), (req, res) => {
  const { name, phone } = req.validated;
  const updates = {};
  if (name) updates.name = name.trim();
  if (phone !== undefined) updates.phone = phone.trim();
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

  logSecurityEvent(SEC_EVENTS.ACCOUNT_DELETED, { userId: user.id, email: user.email, ip: req.ip });

  deleteUser(user.id);

  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });

  res.json({ ok: true });
});

export default router;
