import jwt from 'jsonwebtoken';
import { findUserById } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Verify access token from HTTP-only cookie
export function authenticate(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // Attach sanitized user (no password) to request
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Optional auth — attaches user if token exists, but doesn't block
export function optionalAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserById(decoded.sub);
    if (user) {
      req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    }
  } catch (_) {
    // Silently continue without auth
  }
  next();
}

// Generate tokens
export function generateTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

// Cookie settings
export function getAccessCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 min
    path: '/',
  };
}

export function getRefreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  };
}
