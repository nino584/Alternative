import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import {
  getAffiliates, getAffiliateById, getAffiliateByCode, getAffiliateByEmail,
  createAffiliate, updateAffiliateStatus, markAffiliatePaid,
  getAffiliateClicks, createAffiliateClick, getPromoCodes,
} from '../db/store.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { adminIpCheck } from '../middleware/adminIp.js';
import { auditLog } from '../middleware/audit.js';

const router = Router();

const dashboardLoginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many login attempts. Try again later.' } });

// Rate limit for dashboard data endpoints (30 requests per 15 min per IP)
const dashboardDataLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Schemas ──────────────────────────────────────────────────────────────────
const applySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  instagram: z.string().max(100).optional().default(''),
  tiktok: z.string().max(100).optional().default(''),
  niche: z.string().max(50).optional().default(''),
  audienceSize: z.string().max(20).optional().default(''),
  code: z.string().min(3).max(20).regex(/^[A-Za-z0-9_]+$/, 'Code must be alphanumeric'),
  description: z.string().max(500).optional().default(''),
}).refine(d => d.instagram || d.tiktok, { message: 'At least one social media account is required' });

const trackClickSchema = z.object({
  code: z.string().min(1).max(30),
});

const dashboardLoginSchema = z.object({
  code: z.string().min(1).max(30),
  email: z.string().email(),
});

const statusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

// ── PUBLIC: Apply ────────────────────────────────────────────────────────────
router.post('/apply', validate(applySchema), (req, res) => {
  const { name, email, instagram, tiktok, niche, audienceSize, code, description } = req.validated;

  // Check code uniqueness vs existing affiliates
  if (getAffiliateByCode(code)) {
    return res.status(400).json({ error: 'This code is already taken' });
  }

  // Check code uniqueness vs promo codes
  const promos = getPromoCodes();
  if (promos.find(p => p.code.toLowerCase() === code.toLowerCase())) {
    return res.status(400).json({ error: 'This code is already in use' });
  }

  // Check email uniqueness
  if (getAffiliateByEmail(email)) {
    return res.status(400).json({ error: 'An application with this email already exists' });
  }

  const affiliate = createAffiliate({ name, email, instagram, tiktok, niche, audienceSize, code, description });
  res.status(201).json({ success: true, message: 'Application submitted successfully', affiliate: { id: affiliate.id, code: affiliate.code, status: affiliate.status } });
});

// ── PUBLIC: Track click ──────────────────────────────────────────────────────
router.post('/track-click', validate(trackClickSchema), (req, res) => {
  const { code } = req.validated;
  const affiliate = getAffiliateByCode(code);
  if (!affiliate || affiliate.status !== 'approved') {
    return res.json({ success: false }); // Silent fail — don't reveal affiliate existence
  }
  createAffiliateClick({ affiliate_code: affiliate.code, type: 'click' });
  res.json({ success: true });
});

// ── PUBLIC: Dashboard login ──────────────────────────────────────────────────
router.post('/dashboard/login', dashboardLoginLimiter, dashboardDataLimiter, validate(dashboardLoginSchema), (req, res) => {
  const { code, email } = req.validated;
  const affiliate = getAffiliateByCode(code);
  if (!affiliate || affiliate.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid code or email' });
  }
  if (affiliate.status === 'pending') {
    return res.status(403).json({ error: 'Your application is still under review' });
  }
  if (affiliate.status === 'rejected') {
    return res.status(403).json({ error: 'Your application was not approved' });
  }

  // Get clicks & compute stats
  const clicks = getAffiliateClicks(affiliate.code);
  const totalClicks = clicks.filter(c => c.type === 'click').length;
  const conversions = clicks.filter(c => c.type === 'conversion');
  const recentConversions = conversions.slice(-50).reverse();

  res.json({
    affiliate: {
      id: affiliate.id,
      name: affiliate.name,
      code: affiliate.code,
      commission_rate: affiliate.commission_rate,
      pending_earnings: affiliate.pending_earnings,
      paid_earnings: affiliate.paid_earnings,
      status: affiliate.status,
      created_at: affiliate.created_at,
    },
    stats: {
      totalClicks,
      totalConversions: conversions.length,
      pendingEarnings: affiliate.pending_earnings,
      totalEarned: (affiliate.paid_earnings || 0) + (affiliate.pending_earnings || 0),
    },
    recentConversions,
  });
});

// ── ADMIN: List all affiliates ───────────────────────────────────────────────
router.get('/admin/list', dashboardDataLimiter, authenticate, requireRole('admin'), (req, res) => {
  const affiliates = getAffiliates();
  // Enrich with click/conversion counts
  const enriched = affiliates.map(a => {
    const clicks = getAffiliateClicks(a.code);
    return {
      ...a,
      clickCount: clicks.filter(c => c.type === 'click').length,
      conversionCount: clicks.filter(c => c.type === 'conversion').length,
    };
  });
  res.json({ affiliates: enriched });
});

// ── ADMIN: Update status ─────────────────────────────────────────────────────
router.patch('/admin/:id/status', authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(statusSchema), (req, res) => {
  const affiliate = updateAffiliateStatus(req.params.id, req.validated.status);
  if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });
  res.json({ affiliate });
});

// ── ADMIN: Payout ────────────────────────────────────────────────────────────
router.post('/admin/:id/payout', authenticate, requireRole('admin'), adminIpCheck, auditLog, (req, res) => {
  const before = getAffiliateById(req.params.id);
  if (!before) return res.status(404).json({ error: 'Affiliate not found' });
  if ((before.pending_earnings || 0) <= 0) {
    return res.status(400).json({ error: 'No pending earnings to pay out' });
  }

  const paidAmount = before.pending_earnings;
  const affiliate = markAffiliatePaid(req.params.id);

  // Record payout as a click entry for audit trail
  createAffiliateClick({
    affiliate_code: affiliate.code,
    type: 'payout',
    order_id: null,
    order_amount: 0,
    commission: paidAmount,
    status: 'paid',
  });

  res.json({ affiliate, paidAmount });
});

export default router;
