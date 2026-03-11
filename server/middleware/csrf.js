import crypto from 'crypto';

// Double-submit cookie CSRF protection
// Sets a csrf_token cookie (readable by JS) and requires X-CSRF-Token header on mutations
export function csrfProtection(req, res, next) {
  // Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    // Set CSRF cookie if not present
    if (!req.cookies?.csrf_token) {
      const token = crypto.randomUUID();
      res.cookie('csrf_token', token, {
        httpOnly: false, // JS must read this
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
      });
    }
    return next();
  }

  // For state-changing methods, verify CSRF token
  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }
  // Hash both tokens to ensure constant-length comparison (avoids timing leak from length check)
  const cookieHash = crypto.createHash('sha256').update(cookieToken).digest();
  const headerHash = crypto.createHash('sha256').update(headerToken).digest();
  if (!crypto.timingSafeEqual(cookieHash, headerHash)) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }

  // Rotate token after successful validation
  const newToken = crypto.randomUUID();
  res.cookie('csrf_token', newToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  });

  next();
}

// Middleware to set initial CSRF token on first request
export function csrfInit(req, res, next) {
  if (!req.cookies?.csrf_token) {
    const token = crypto.randomUUID();
    res.cookie('csrf_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
  next();
}
