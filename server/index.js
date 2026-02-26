import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

// ── Security headers ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: isProd ? undefined : false, // relax for dev
  crossOriginEmbedderPolicy: false,
}));

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// ── Global rate limit ─────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
}));

// ── Static product images ─────────────────────────────────────────────────
app.use('/images/products', express.static(
  join(__dirname, '..', 'Alternative', 'public', 'images', 'products')
));

// ── API routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 for unknown API routes ────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global error handler (never leak stack traces) ────────────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
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
