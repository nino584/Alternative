import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { appendFileSync, existsSync, mkdirSync, statSync, renameSync } from 'fs';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import affiliateRoutes from './routes/affiliates.js';
import supplierRoutes from './routes/suppliers.js';
import { getAllUsers, getAllSubscribers, addSubscriber, removeSubscriber, getAllProducts, getAllOrders, getStockNotifications, addStockNotification, getWishlist, saveWishlist, getReturnRequests, getReturnRequestsByUser, createReturnRequest, updateReturnStatus, updatePromoCode, deletePromoCode, addPromoCode, getPromoCodes, getMessagesByOrder, getMessagesByUser, getUnreadCountByUser, createMessage, markMessageRead, markAllMessagesRead, getOrderById } from './db/store.js';
import nodemailer from 'nodemailer';
import { authenticate } from './middleware/auth.js';
import { requireRole } from './middleware/rbac.js';
import { csrfProtection, csrfInit } from './middleware/csrf.js';
import { auditLog } from './middleware/audit.js';
import { adminIpCheck } from './middleware/adminIp.js';
import { validate } from './middleware/validate.js';
import {
  subscribeSchema, unsubscribeSchema, contactSchema, createPromoSchema,
  updatePromoSchema, validatePromoSchema, wishlistSchema, createReturnSchema,
  updateReturnStatusSchema, notifyStockSchema, createMessageSchema, errorReportSchema,
} from './schemas.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Error logging ────────────────────────────────────────────────────────
const logsDir = join(__dirname, 'logs');
if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });

const MAX_LOG_SIZE = 50 * 1024 * 1024; // 50 MB per log file

function rotateLogIfNeeded(logPath) {
  try {
    if (!existsSync(logPath)) return;
    const stats = statSync(logPath);
    if (stats.size >= MAX_LOG_SIZE) {
      const rotated = logPath + '.' + new Date().toISOString().replace(/[:.]/g, '-') + '.old';
      renameSync(logPath, rotated);
    }
  } catch (_) {}
}

function appendLog(filename, entry) {
  const logPath = join(logsDir, filename);
  rotateLogIfNeeded(logPath);
  const line = JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n';
  try { appendFileSync(logPath, line); } catch (_) {}
}

function logError(entry) {
  appendLog('errors.log', entry);
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

// ── Trust proxy (needed for correct req.ip behind reverse proxy) ─────────
if (isProd) app.set('trust proxy', 1);

// ── Request ID tracking ──────────────────────────────────────────────────
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// ── Request timeout (30s for all requests) ──────────────────────────────
const REQUEST_TIMEOUT_MS = 30 * 1000;
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT_MS);
  res.setTimeout(REQUEST_TIMEOUT_MS, () => {
    if (!res.headersSent) {
      res.status(408).json({ error: 'Request timeout' });
    }
  });
  next();
});

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
      reportUri: ['/api/csp-report'],
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
  dnsPrefetchControl: { allow: false },
}));

// ── Permissions-Policy header ────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  next();
});

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    if (!origin && isProd) return cb(new Error('Not allowed by CORS'));
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ── CSRF token initialization (set cookie on first request) ──────────────
app.use(csrfInit);

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

// ── CSP violation report endpoint ────────────────────────────────────────
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body?.['csp-report'] || req.body;
  if (report) {
    const entry = {
      source: 'csp_violation',
      documentUri: report['document-uri'],
      violatedDirective: report['violated-directive'],
      blockedUri: report['blocked-uri'],
      timestamp: new Date().toISOString(),
    };
    appendLog('security.log', entry);
  }
  res.status(204).end();
});

// ── Security.txt ──────────────────────────────────────────────────────────
app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send(
    `Contact: mailto:security@alternative.ge\nPreferred-Languages: en, ka\nCanonical: https://alternative.ge/.well-known/security.txt\nExpires: 2027-01-01T00:00:00.000Z\n`
  );
});

// ── Pagination helper ────────────────────────────────────────────────────
function paginate(items, query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, page, limit, total, totalPages };
}

// ── API routes (with CSRF on auth/products/orders) ───────────────────────
app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/products', csrfProtection, productRoutes);
app.use('/api/orders', csrfProtection, orderRoutes);
app.use('/api/affiliates', csrfProtection, affiliateRoutes);
app.use('/api/suppliers', csrfProtection, supplierRoutes);

// ── Admin: Customers (paginated, support can read) ──────────────────────
app.get('/api/admin/customers', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json(paginate(getAllUsers(), req.query));
});

// ── Admin: Orders (all orders for admin) ─────────────────────────────────
app.get('/api/admin/orders', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json({ orders: getAllOrders() });
});

// ── Admin: Subscribers (paginated, support can read) ────────────────────
app.get('/api/admin/subscribers', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json(paginate(getAllSubscribers(), req.query));
});

// ── Admin: Promo Codes (support can read) ───────────────────────────────
app.get('/api/admin/promos', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json(getPromoCodes());
});

app.post('/api/admin/promos', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(createPromoSchema), (req, res) => {
  const { code, type, value, minOrder, maxUses, expiresAt } = req.validated;
  const promo = addPromoCode({ code: code.toUpperCase(), type, value, minOrder, maxUses, expiresAt, active: true });
  res.status(201).json(promo);
});

// ── Public: Newsletter subscribe (with double opt-in) ────────────────────
const subscribeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many subscribe attempts.' } });
const pendingSubscribers = new Map();

app.post('/api/subscribe', subscribeLimiter, csrfProtection, validate(subscribeSchema), (req, res) => {
  const { email } = req.validated;

  const existing = getAllSubscribers().find(s => s.email === email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Already subscribed' });

  // Secure random confirmation token
  const token = crypto.randomUUID();
  pendingSubscribers.set(token, { email: email.toLowerCase(), expiresAt: Date.now() + 24 * 60 * 60 * 1000 });

  console.log(`[NEWSLETTER] Confirmation token for ${email}: ${token}`);
  console.log(`[NEWSLETTER] Confirm link: /api/subscribe/confirm?token=${token}`);

  // Auto-confirm for now (remove when email sending is implemented)
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
const unsubscribeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many unsubscribe attempts.' } });
app.post('/api/unsubscribe', unsubscribeLimiter, csrfProtection, validate(unsubscribeSchema), (req, res) => {
  const { email } = req.validated;
  const ok = removeSubscriber(email);
  if (!ok) return res.status(404).json({ error: 'Email not found in subscriber list' });
  res.json({ ok: true });
});

// ── Promo code validation ────────────────────────────────────────────────
app.post('/api/promo/validate', csrfProtection, validate(validatePromoSchema), (req, res) => {
  const { code, subtotal } = req.validated;

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

app.put('/api/wishlist', csrfProtection, authenticate, validate(wishlistSchema), (req, res) => {
  const { items } = req.validated;
  saveWishlist(req.user.id, items);
  res.json({ ok: true });
});

// ── Return Requests (authenticated) ─────────────────────────────────────
app.post('/api/returns', csrfProtection, authenticate, validate(createReturnSchema), (req, res) => {
  const { orderId, reason, items } = req.validated;
  // Verify the order belongs to the requesting user
  const order = getOrderById(orderId);
  if (!order || order.userId !== req.user.id) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const id = 'ret_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  const entry = createReturnRequest({ id, userId: req.user.id, orderId, reason, items });
  res.status(201).json(entry);
});

app.get('/api/returns', authenticate, (req, res) => {
  res.json({ returns: getReturnRequestsByUser(req.user.id) });
});

// ── Admin: Return Requests (paginated, support can read) ────────────────
app.get('/api/admin/returns', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json(paginate(getReturnRequests(), req.query));
});

app.patch('/api/admin/returns/:id', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(updateReturnStatusSchema), (req, res) => {
  const { status, adminNote } = req.validated;
  const updated = updateReturnStatus(req.params.id, status, adminNote);
  if (!updated) return res.status(404).json({ error: 'Return request not found' });
  res.json(updated);
});

// ── Admin: Promo Code Management ────────────────────────────────────────
app.patch('/api/admin/promos/:code', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(updatePromoSchema), (req, res) => {
  const updated = updatePromoCode(req.params.code, req.validated);
  if (!updated) return res.status(404).json({ error: 'Promo not found' });
  res.json(updated);
});

app.delete('/api/admin/promos/:code', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, (req, res) => {
  const ok = deletePromoCode(req.params.code);
  if (!ok) return res.status(404).json({ error: 'Promo not found' });
  res.json({ ok: true });
});

// ── Stock Notifications (public) ─────────────────────────────────────────
const notifyStockLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { error: 'Too many notification requests.' } });
app.post('/api/notify-stock', notifyStockLimiter, csrfProtection, validate(notifyStockSchema), (req, res) => {
  const { productId, email } = req.validated;
  const result = addStockNotification(productId, email);
  if (!result) return res.status(409).json({ error: 'Already subscribed for this product' });
  res.status(201).json({ ok: true });
});

// ── Admin: Stock Notifications (paginated, support can read) ────────────
app.get('/api/admin/stock-notifications', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json(paginate(getStockNotifications(), req.query));
});

// ── Messages / Media (order notifications) ──────────────────────────────

const msgSmtpPort = Number((process.env.SMTP_PORT || '').trim()) || 587;
const msgMailTransport = (process.env.SMTP_HOST && process.env.SMTP_USER) ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: msgSmtpPort,
  secure: msgSmtpPort === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}) : null;
const MSG_STORE_EMAIL = process.env.STORE_EMAIL || 'info@alternative.ge';

function escHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sendMediaNotificationEmail(order, message) {
  if (!msgMailTransport || !order.email) return;
  const mediaCount = (message.media || []).length;
  const hasImages = message.media?.some(m => m.type === 'image');
  const hasVideos = message.media?.some(m => m.type === 'video');
  const mediaType = hasImages && hasVideos ? 'photos & video' : hasVideos ? 'video' : 'photos';

  const mediaHtml = (message.media || []).map(m => {
    if (m.type === 'image' && m.data) {
      return `<tr><td style="padding:8px 0"><img src="${escHtml(m.data)}" alt="Product media" style="max-width:100%;height:auto;border-radius:4px" /></td></tr>`;
    }
    if (m.type === 'video' && m.url) {
      return `<tr><td style="padding:8px 0"><a href="${escHtml(m.url)}" style="display:inline-block;padding:12px 24px;background:#191919;color:#ffffff;text-decoration:none;font-family:'Helvetica Neue',sans-serif;font-size:13px;letter-spacing:0.1em">▶ WATCH VIDEO</a></td></tr>`;
    }
    return '';
  }).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f0ede8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ede8">
<tr><td align="center" style="padding:40px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff">
  <tr><td style="background-color:#191919;padding:24px 40px;text-align:center">
    <h1 style="margin:0;font-family:Georgia,serif;font-size:20px;font-weight:300;color:#ffffff;letter-spacing:0.2em">ALTERNATIVE</h1>
  </td></tr>
  <tr><td style="height:3px;background:linear-gradient(90deg,#c4a265,#b19a7a,#d4b896,#b19a7a,#c4a265)">&nbsp;</td></tr>
  <tr><td style="padding:40px 40px 24px;text-align:center">
    <p style="margin:0 0 8px;font-family:'Helvetica Neue',sans-serif;font-size:11px;letter-spacing:0.2em;color:#b19a7a;text-transform:uppercase">New Update for Your Order</p>
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:28px;font-weight:300;color:#191919">${escHtml(mediaType)} Ready</h2>
    <p style="margin:0 0 4px;font-family:'Helvetica Neue',sans-serif;font-size:13px;color:#888">Order ${escHtml(order.orderId)}</p>
    <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:14px;color:#191919;font-weight:500">${escHtml(order.productName || order.name || '')}</p>
  </td></tr>
  ${message.content ? `<tr><td style="padding:0 40px 24px"><p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:14px;color:#555;line-height:1.6;text-align:center">${escHtml(message.content)}</p></td></tr>` : ''}
  <tr><td style="padding:0 40px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${mediaHtml}</table>
  </td></tr>
  <tr><td style="padding:0 40px 40px;text-align:center">
    <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:12px;color:#aaa">You can also view this in your account under Messages.</p>
  </td></tr>
  <tr><td style="background-color:#f5f3f0;padding:24px 40px;text-align:center">
    <p style="margin:0;font-family:'Helvetica Neue',sans-serif;font-size:11px;color:#999;letter-spacing:0.05em">© Alternative — Luxury Fashion</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  msgMailTransport.sendMail({
    from: `"Alternative" <${MSG_STORE_EMAIL}>`,
    to: order.email,
    subject: `Your ${mediaType} for order ${order.orderId} — Alternative`,
    html,
  }).catch(err => console.error('[EMAIL] Media notification failed:', err.message));
}

// Admin: Send media message to an order
app.post('/api/admin/messages', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(createMessageSchema), (req, res) => {
  const { orderId, content, media } = req.validated;

  const order = getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const msg = createMessage({
    orderId,
    userId: order.userId || null,
    email: order.email || null,
    content,
    media,
  });

  sendMediaNotificationEmail(order, msg);

  res.status(201).json(msg);
});

// Admin: Get messages for an order (support can read)
app.get('/api/admin/messages/:orderId', authenticate, requireRole('admin', 'support'), adminIpCheck, (req, res) => {
  res.json({ messages: getMessagesByOrder(req.params.orderId) });
});

// User: Get own messages
app.get('/api/messages', authenticate, (req, res) => {
  const messages = getMessagesByUser(req.user.id);
  res.json({ messages });
});

// User: Get unread count
app.get('/api/messages/unread-count', authenticate, (req, res) => {
  res.json({ count: getUnreadCountByUser(req.user.id) });
});

// User: Mark single message as read
app.patch('/api/messages/:id/read', csrfProtection, authenticate, (req, res) => {
  const msg = markMessageRead(req.params.id, req.user.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  res.json(msg);
});

// User: Mark all messages as read
app.post('/api/messages/mark-all-read', csrfProtection, authenticate, (req, res) => {
  const count = markAllMessagesRead(req.user.id);
  res.json({ ok: true, marked: count });
});

// ── Contact form endpoint (rate limited + honeypot + validated) ──────────
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many messages. Try again later.' } });
app.post('/api/contact', contactLimiter, csrfProtection, validate(contactSchema), (req, res) => {
  const { name, email, message, website } = req.validated;

  // Honeypot: if "website" field is filled, it's a bot
  if (website) return res.json({ ok: true });

  // Log contact submission (no sensitive data)
  const entry = {
    source: 'contact_form',
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 254),
    messageLength: message.trim().length,
    ip: req.ip,
  };
  appendLog('contacts.log', entry);

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
app.post('/api/report-error', errorReportLimiter, validate(errorReportSchema), (req, res) => {
  const { message, stack, url, userAgent } = req.validated;
  logError({
    source: 'frontend',
    requestId: req.requestId,
    message,
    stack,
    url,
    userAgent,
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
    requestId: req.requestId,
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
  console.log(`  CSRF protection: enabled`);
  console.log(`  Admin IP allowlist: ${process.env.ADMIN_ALLOWED_IPS || 'disabled (all IPs allowed)'}`);
});
