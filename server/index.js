import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { appendFileSync, existsSync, mkdirSync } from 'fs';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { getAllUsers, getAllSubscribers, addSubscriber, removeSubscriber, getAllProducts, getStockNotifications, addStockNotification, getWishlist, saveWishlist, getReturnRequests, getReturnRequestsByUser, createReturnRequest, updateReturnStatus, updatePromoCode, deletePromoCode, addPromoCode, getPromoCodes } from './db/store.js';
import { authenticate } from './middleware/auth.js';
import { requireRole } from './middleware/rbac.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Error logging ────────────────────────────────────────────────────────
const logsDir = join(__dirname, 'logs');
if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });

function logError(entry) {
  const line = JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n';
  try { appendFileSync(join(logsDir, 'errors.log'), line); } catch (_) {}
}

// ── Validate required env vars at startup ─────────────────────────────────
const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ── Gzip/Brotli compression ───────────────────────────────────────────────
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// ── HTTPS redirect (production behind reverse proxy) ─────────────────────
if (isProd) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// ── Security headers ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://plausible.io'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      connectSrc: ["'self'", 'https://plausible.io'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
}));

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    // In production, reject requests with no origin to block scripted attacks
    if (!origin && isProd) return cb(new Error('Not allowed by CORS'));
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ── Global rate limit ─────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
}));

// ── Static product images (with cache headers) ──────────────────────────
app.use('/images/products', express.static(
  join(__dirname, '..', 'Alternative', 'public', 'images', 'products'),
  {
    maxAge: isProd ? '30d' : 0,
    immutable: isProd,
    etag: true,
    lastModified: true,
  }
));

// ── API routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ── Admin: Customers ─────────────────────────────────────────────────────
app.get('/api/admin/customers', authenticate, requireRole('admin'), (req, res) => {
  res.json(getAllUsers());
});

// ── Admin: Subscribers ───────────────────────────────────────────────────
app.get('/api/admin/subscribers', authenticate, requireRole('admin'), (req, res) => {
  res.json(getAllSubscribers());
});

// ── Admin: Promo Codes ──────────────────────────────────────────────────

app.get('/api/admin/promos', authenticate, requireRole('admin'), (req, res) => {
  res.json(getPromoCodes());
});

app.post('/api/admin/promos', authenticate, requireRole('admin'), (req, res) => {
  const { code, type, value, minOrder, maxUses, expiresAt } = req.body || {};
  if (!code || !type || !value) return res.status(400).json({ error: 'code, type, and value are required' });
  if (!['fixed', 'percent'].includes(type)) return res.status(400).json({ error: 'type must be fixed or percent' });
  if (typeof value !== 'number' || value <= 0) return res.status(400).json({ error: 'value must be a positive number' });

  const promo = addPromoCode({ code: code.toUpperCase(), type, value, minOrder: minOrder || 0, maxUses: maxUses || 0, expiresAt: expiresAt || null, active: true });
  res.status(201).json(promo);
});

// ── Public: Newsletter subscribe (with double opt-in) ────────────────────
const subscribeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many subscribe attempts.' } });
const pendingSubscribers = new Map(); // token -> { email, expiresAt }

app.post('/api/subscribe', subscribeLimiter, (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  // Check if already subscribed
  const existing = getAllSubscribers().find(s => s.email === email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Already subscribed' });

  // Generate confirmation token
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  pendingSubscribers.set(token, { email: email.toLowerCase(), expiresAt: Date.now() + 24 * 60 * 60 * 1000 });

  // In production, send confirmation email. For now, log and auto-confirm.
  console.log(`[NEWSLETTER] Confirmation token for ${email}: ${token}`);
  console.log(`[NEWSLETTER] Confirm link: /api/subscribe/confirm?token=${token}`);

  // Auto-confirm for now (remove this line when email sending is implemented)
  addSubscriber(email);

  res.status(201).json({ ok: true });
});

// ── Newsletter confirm subscription ─────────────────────────────────────
app.get('/api/subscribe/confirm', (req, res) => {
  const { token } = req.query || {};
  if (!token) return res.status(400).json({ error: 'Token is required' });

  const entry = pendingSubscribers.get(token);
  if (!entry) return res.status(400).json({ error: 'Invalid or expired token' });
  pendingSubscribers.delete(token);
  if (Date.now() > entry.expiresAt) return res.status(400).json({ error: 'Token expired' });

  const sub = addSubscriber(entry.email);
  if (!sub) return res.status(409).json({ error: 'Already subscribed' });

  res.json({ ok: true, message: 'Subscription confirmed!' });
});

// ── Public: Newsletter unsubscribe ───────────────────────────────────────
app.post('/api/unsubscribe', (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  const ok = removeSubscriber(email);
  if (!ok) return res.status(404).json({ error: 'Email not found in subscriber list' });
  res.json({ ok: true });
});

// ── Promo code validation ────────────────────────────────────────────────

app.post('/api/promo/validate', (req, res) => {
  const { code, subtotal } = req.body || {};
  if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Promo code is required' });

  const promos = getPromoCodes();
  const promo = promos.find(p => p.code.toLowerCase() === code.trim().toLowerCase() && p.active);
  if (!promo) return res.status(404).json({ error: 'Invalid or expired promo code' });

  if (promo.minOrder && subtotal < promo.minOrder) {
    return res.status(400).json({ error: `Minimum order GEL ${promo.minOrder} required` });
  }
  if (promo.maxUses && promo.usedCount >= promo.maxUses) {
    return res.status(400).json({ error: 'Promo code has been fully redeemed' });
  }
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return res.status(400).json({ error: 'Promo code has expired' });
  }

  const discount = promo.type === 'percent'
    ? Math.round((subtotal * promo.value) / 100)
    : promo.value;

  res.json({ code: promo.code, discount: Math.min(discount, subtotal), type: promo.type });
});

// ── Wishlist (authenticated) ─────────────────────────────────────────────
app.get('/api/wishlist', authenticate, (req, res) => {
  res.json({ items: getWishlist(req.user.id) });
});

app.put('/api/wishlist', authenticate, (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items array required' });
  saveWishlist(req.user.id, items);
  res.json({ ok: true });
});

// ── Return Requests (authenticated) ─────────────────────────────────────
app.post('/api/returns', authenticate, (req, res) => {
  const { orderId, reason, items } = req.body || {};
  if (!orderId || !reason) return res.status(400).json({ error: 'orderId and reason are required' });
  const id = 'ret_' + Date.now().toString(36);
  const entry = createReturnRequest({ id, userId: req.user.id, orderId, reason, items: items || [] });
  res.status(201).json(entry);
});

app.get('/api/returns', authenticate, (req, res) => {
  res.json({ returns: getReturnRequestsByUser(req.user.id) });
});

// ── Admin: Return Requests ──────────────────────────────────────────────
app.get('/api/admin/returns', authenticate, requireRole('admin'), (req, res) => {
  res.json(getReturnRequests());
});

app.patch('/api/admin/returns/:id', authenticate, requireRole('admin'), (req, res) => {
  const { status, adminNote } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status is required' });
  const updated = updateReturnStatus(req.params.id, status, adminNote);
  if (!updated) return res.status(404).json({ error: 'Return request not found' });
  res.json(updated);
});

// ── Admin: Promo Code Management ────────────────────────────────────────
app.patch('/api/admin/promos/:code', authenticate, requireRole('admin'), (req, res) => {
  const updated = updatePromoCode(req.params.code, req.body || {});
  if (!updated) return res.status(404).json({ error: 'Promo not found' });
  res.json(updated);
});

app.delete('/api/admin/promos/:code', authenticate, requireRole('admin'), (req, res) => {
  const ok = deletePromoCode(req.params.code);
  if (!ok) return res.status(404).json({ error: 'Promo not found' });
  res.json({ ok: true });
});

// ── Stock Notifications (public) ─────────────────────────────────────────
const notifyStockLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { error: 'Too many notification requests.' } });
app.post('/api/notify-stock', notifyStockLimiter, (req, res) => {
  const { productId, email } = req.body || {};
  if (!productId) return res.status(400).json({ error: 'Product ID is required' });
  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const result = addStockNotification(productId, email);
  if (!result) return res.status(409).json({ error: 'Already subscribed for this product' });
  res.status(201).json({ ok: true });
});

// ── Admin: Stock Notifications ──────────────────────────────────────────
app.get('/api/admin/stock-notifications', authenticate, requireRole('admin'), (req, res) => {
  res.json(getStockNotifications());
});

// ── Contact form endpoint (rate limited + honeypot) ─────────────────────
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many messages. Try again later.' } });
app.post('/api/contact', contactLimiter, (req, res) => {
  const { name, email, message, website } = req.body || {};

  // Honeypot: if "website" field is filled, it's a bot
  if (website) return res.json({ ok: true }); // Silently accept

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Name is required (2-100 characters).' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5 || message.length > 2000) {
    return res.status(400).json({ error: 'Message is required (5-2000 characters).' });
  }

  // Log contact submission (no sensitive data)
  const entry = {
    source: 'contact_form',
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 254),
    messageLength: message.trim().length,
    ip: req.ip,
  };
  try { appendFileSync(join(logsDir, 'contacts.log'), JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n'); } catch (_) {}

  console.log(`[CONTACT] From: ${entry.name} <${entry.email}> (${entry.messageLength} chars)`);
  res.json({ ok: true });
});

// ── Dynamic sitemap ──────────────────────────────────────────────────────
app.get('/api/sitemap.xml', async (req, res) => {
  try {
    const products = getAllProducts();
    const baseUrl = process.env.SITE_URL || (isProd ? 'https://alternative.ge' : 'http://localhost:5173');
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/catalog', priority: '0.9', changefreq: 'daily' },
      { loc: '/how', priority: '0.7', changefreq: 'monthly' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/brands', priority: '0.8', changefreq: 'weekly' },
      { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
      { loc: '/video-verification', priority: '0.6', changefreq: 'monthly' },
      { loc: '/membership', priority: '0.6', changefreq: 'monthly' },
      { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
      { loc: '/returns', priority: '0.5', changefreq: 'monthly' },
      { loc: '/shipping', priority: '0.5', changefreq: 'monthly' },
    ];

    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productPages = products.map(p => ({
      loc: `/product/${slugify(p.brand || '')}-${slugify(p.name || '')}-${p.id}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

    const urls = [...staticPages, ...productPages];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap error:', err.message);
    res.status(500).send('<!-- sitemap generation error -->');
  }
});

// ── Frontend error reporting endpoint ─────────────────────────────────
const errorReportLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { error: 'Too many error reports' } });
app.post('/api/report-error', errorReportLimiter, (req, res) => {
  const { message, stack, url, userAgent } = req.body || {};
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Invalid report' });
  logError({
    source: 'frontend',
    message: String(message).slice(0, 500),
    stack: String(stack || '').slice(0, 2000),
    url: String(url || '').slice(0, 500),
    userAgent: String(userAgent || '').slice(0, 300),
    ip: req.ip,
  });
  res.json({ ok: true });
});

// ── Health check ──────────────────────────────────────────────────────────
const startTime = Date.now();
app.get('/api/health', (req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
      heap: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
    },
    env: isProd ? 'production' : 'development',
  });
});

// ── 404 for unknown API routes ────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler (never leak stack traces) ────────────────────────
app.use((err, req, res, next) => {
  logError({
    source: 'server',
    message: err.message,
    stack: isProd ? undefined : err.stack,
    method: req.method,
    path: req.path,
    status: err.status || 500,
  });
  if (!isProd) console.error(err.stack);
  res.status(err.status || 500).json({
    error: isProd ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Alternative API server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
