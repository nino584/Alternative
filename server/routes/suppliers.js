import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import {
  getSuppliers, getSupplierById, getSupplierByEmail, getSupplierByUserId,
  createSupplier, updateSupplier, updateSupplierStatus, addSupplierEarnings,
  markSupplierPaid, getProductsByVendor, getOrdersByVendor,
  findUserByEmail, createUser, getAllProducts, getProductById, createProduct,
  updateProduct, deleteProduct, getAllOrders,
  logAgreementAcceptance, getTakedownLogs, createTakedownLog, updateTakedownLog,
  storeResetToken,
} from '../db/store.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import { adminIpCheck } from '../middleware/adminIp.js';
import { auditLog } from '../middleware/audit.js';
import { csrfProtection } from '../middleware/csrf.js';
import crypto from 'crypto';

const router = Router();

// ── Schemas ──────────────────────────────────────────────────────────────────

const applySchema = z.object({
  companyName: z.string().min(2).max(100),
  contactName: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().min(5).max(30),
  description: z.string().min(10).max(1000),
  instagram: z.string().max(100).optional().default(''),
  website: z.string().max(200).optional().default(''),
});

const statusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'suspended']),
});

const commissionSchema = z.object({
  commissionRate: z.number().min(0).max(100),
});

const supplierProductSchema = z.object({
  name: z.string().min(1).max(200),
  section: z.enum(['Womenswear', 'Menswear', 'Kidswear']),
  cat: z.string().min(1).max(50),
  sub: z.string().max(50).optional().default(''),
  color: z.string().max(50).optional().default(''),
  price: z.number().min(100, 'Minimum price is 100 GEL'),
  sale: z.number().min(100, 'Minimum sale price is 100 GEL').nullable().optional(),
  lead: z.string().max(100).optional().default(''),
  tag: z.string().max(20).optional().default(''),
  img: z.string().max(500000).optional().default(''),
  images: z.array(z.string().max(500000)).max(20).optional().default([]),
  sizes: z.array(z.string()).min(1),
  fit: z.object({
    fit: z.string(),
    notes: z.string(),
  }).optional(),
  brand: z.string().max(100).optional().default(''),
  desc: z.string().max(5000).optional().default(''),
  inStock: z.boolean().optional().default(true),
  details: z.object({
    itemCode: z.string().max(100).optional().default(''),
    material: z.string().max(500).optional().default(''),
    composition: z.string().max(500).optional().default(''),
    dimensions: z.string().max(200).optional().default(''),
    additionalNotes: z.string().max(2000).optional().default(''),
  }).optional(),
});

const productApprovalSchema = z.object({
  productStatus: z.enum(['approved', 'rejected', 'under_review']),
});

const agreementSchema = z.object({
  confirmConditions: z.literal(true, { errorMap: () => ({ message: 'You must confirm all conditions' }) }),
  confirmTosAndIp: z.literal(true, { errorMap: () => ({ message: 'You must confirm ToS and IP Policy' }) }),
});

const takedownSchema = z.object({
  productId: z.number(),
  reason: z.string().min(5).max(2000),
  noticeDetails: z.string().max(5000).optional().default(''),
});

const takedownUpdateSchema = z.object({
  step: z.enum(['receipt_confirmed', 'under_review', 'seller_notified', 'seller_responded', 'resolved_removed', 'resolved_kept']),
  note: z.string().max(2000).optional().default(''),
});

const supplierProfileSchema = z.object({
  companyName: z.string().min(2).max(100).optional(),
  contactName: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional(),
  description: z.string().max(1000).optional(),
  instagram: z.string().max(100).optional(),
  website: z.string().max(200).optional(),
});

// Rate limit for applications
const applyLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { error: 'Too many applications. Please try again later.' } });

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// ── POST /api/suppliers/apply — public application ───────────────────────────
router.post('/apply', applyLimiter, validate(applySchema), async (req, res) => {
  const { companyName, contactName, email, phone, description, instagram, website } = req.validated;

  // Check email uniqueness across suppliers and users
  const existingSupplier = getSupplierByEmail(email);
  if (existingSupplier) {
    return res.status(409).json({ error: 'An application with this email already exists' });
  }
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists. Please use a different email.' });
  }

  const supplier = createSupplier({
    companyName, contactName, email, phone, description, instagram, website,
  });

  res.status(201).json({ ok: true, message: 'Application submitted successfully. We will review it and contact you.' });
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// ── GET /api/suppliers/admin/list — all suppliers ────────────────────────────
router.get('/admin/list', authenticate, requireRole('admin'), adminIpCheck, (req, res) => {
  const suppliers = getSuppliers();
  const allProducts = getAllProducts();
  const allOrders = getAllOrders();

  const enriched = suppliers.map(s => {
    const products = allProducts.filter(p => p.vendorId === s.id);
    const orders = allOrders.filter(o => o.vendorId === s.id);
    const pendingProducts = products.filter(p => p.productStatus === 'pending').length;
    return {
      ...s,
      passwordHash: undefined, // never expose
      productCount: products.length,
      approvedProducts: products.filter(p => !p.productStatus || p.productStatus === 'approved').length,
      pendingProducts,
      orderCount: orders.length,
    };
  });

  res.json({ suppliers: enriched });
});

// ── PATCH /api/suppliers/admin/:id/status — approve/reject/suspend ───────────
router.patch('/admin/:id/status', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(statusSchema), async (req, res) => {
  const supplier = getSupplierById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const { status } = req.validated;
  const updated = updateSupplierStatus(supplier.id, status);

  // On approval: create user account with role='supplier' + generate invite token
  if (status === 'approved' && !supplier.userId) {
    const tempPass = crypto.randomUUID().slice(0, 16);
    const hashedPass = await bcryptjs.hash(tempPass, 12);
    const userId = 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const user = await createUser({
      id: userId,
      name: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      password: hashedPass,
      role: 'supplier',
    });
    if (!user) return res.status(409).json({ error: 'Email already registered as a user' });
    updateSupplier(supplier.id, { userId: user.id });

    // Generate invite token (reuses password reset mechanism)
    const inviteToken = crypto.randomUUID().replace(/-/g, '');
    storeResetToken(inviteToken, user.id);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SUPPLIER INVITE] Token for ${supplier.email}: ${inviteToken}`);
    }

    return res.json({ ok: true, supplier: { ...updated, passwordHash: undefined }, inviteToken });
  }

  // On suspend/reject: set supplier products to rejected
  if (status === 'suspended' || status === 'rejected') {
    const products = getProductsByVendor(supplier.id);
    for (const p of products) {
      await updateProduct(p.id, { productStatus: 'rejected' });
    }
  }

  res.json({ ok: true, supplier: { ...updated, passwordHash: undefined } });
});

// ── PATCH /api/suppliers/admin/:id/commission — update commission ─────────────
router.patch('/admin/:id/commission', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(commissionSchema), (req, res) => {
  const supplier = getSupplierById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const updated = updateSupplier(supplier.id, { commissionRate: req.validated.commissionRate });
  res.json({ ok: true, supplier: { ...updated, passwordHash: undefined } });
});

// ── POST /api/suppliers/admin/:id/payout — mark as paid ──────────────────────
router.post('/admin/:id/payout', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, (req, res) => {
  const supplier = getSupplierById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  if ((supplier.pendingEarnings || 0) <= 0) return res.status(400).json({ error: 'No pending earnings to pay out' });

  const updated = markSupplierPaid(supplier.id);
  res.json({ ok: true, supplier: { ...updated, passwordHash: undefined } });
});

// ── PATCH /api/suppliers/admin/products/:id/approval — approve/reject product ─
router.patch('/admin/products/:id/approval', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(productApprovalSchema), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = getProductById(id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!product.vendorId) return res.status(400).json({ error: 'This is not a supplier product' });

  const updated = await updateProduct(id, { productStatus: req.validated.productStatus });
  res.json({ ok: true, product: updated });
});

// ── GET /api/suppliers/admin/:id/products — supplier's products ──────────────
router.get('/admin/:id/products', authenticate, requireRole('admin'), adminIpCheck, (req, res) => {
  const supplier = getSupplierById(req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const products = getProductsByVendor(supplier.id);
  res.json({ products });
});

// ══════════════════════════════════════════════════════════════════════════════
// SUPPLIER SELF-SERVICE ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// ── GET /api/suppliers/me — supplier profile ─────────────────────────────────
router.get('/me', authenticate, requireRole('supplier'), (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });
  res.json({ supplier: { ...supplier, passwordHash: undefined } });
});

// ── PUT /api/suppliers/me — update supplier profile ──────────────────────────
router.put('/me', authenticate, requireRole('supplier'), validate(supplierProfileSchema), (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });

  const updated = updateSupplier(supplier.id, req.validated);
  res.json({ ok: true, supplier: { ...updated, passwordHash: undefined } });
});

// ── GET /api/suppliers/me/products — own products ────────────────────────────
router.get('/me/products', authenticate, requireRole('supplier'), (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });

  const products = getProductsByVendor(supplier.id);
  res.json({ products });
});

// ── POST /api/suppliers/me/products — create product ─────────────────────────
router.post('/me/products', authenticate, requireRole('supplier'), validate(supplierProductSchema), async (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });
  if (supplier.status !== 'approved') return res.status(403).json({ error: 'Your supplier account is not active' });
  if (!supplier.agreementAccepted) return res.status(403).json({ error: 'You must accept the Seller Agreement before creating products', code: 'AGREEMENT_REQUIRED' });

  const product = await createProduct({
    ...req.validated,
    vendorId: supplier.id,
    vendorName: supplier.companyName,
    productStatus: 'pending',
  });

  res.status(201).json({ product });
});

// ── PUT /api/suppliers/me/products/:id — update own product ──────────────────
router.put('/me/products/:id', authenticate, requireRole('supplier'), validate(supplierProductSchema), async (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });
  if (!supplier.agreementAccepted) return res.status(403).json({ error: 'You must accept the Seller Agreement before updating products', code: 'AGREEMENT_REQUIRED' });

  const id = parseInt(req.params.id, 10);
  const existing = getProductById(id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  if (existing.vendorId !== supplier.id) return res.status(403).json({ error: 'Not your product' });

  // Reset to pending on edit so admin re-approves
  const product = await updateProduct(id, {
    ...req.validated,
    vendorId: supplier.id,
    vendorName: supplier.companyName,
    productStatus: 'pending',
  });

  res.json({ product });
});

// ── DELETE /api/suppliers/me/products/:id — delete own product ───────────────
router.delete('/me/products/:id', authenticate, requireRole('supplier'), async (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });

  const id = parseInt(req.params.id, 10);
  const existing = getProductById(id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  if (existing.vendorId !== supplier.id) return res.status(403).json({ error: 'Not your product' });

  await deleteProduct(id);
  res.json({ ok: true });
});

// ── GET /api/suppliers/me/orders — orders for own products ───────────────────
router.get('/me/orders', authenticate, requireRole('supplier'), (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });

  const orders = getOrdersByVendor(supplier.id);
  res.json({ orders: orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

// ── GET /api/suppliers/me/stats — supplier stats ─────────────────────────────
router.get('/me/stats', authenticate, requireRole('supplier'), (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });

  const products = getProductsByVendor(supplier.id);
  const orders = getOrdersByVendor(supplier.id);

  res.json({
    totalProducts: products.length,
    approvedProducts: products.filter(p => p.productStatus === 'approved').length,
    pendingProducts: products.filter(p => p.productStatus === 'pending').length,
    totalOrders: orders.length,
    activeOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
    pendingEarnings: supplier.pendingEarnings || 0,
    paidEarnings: supplier.paidEarnings || 0,
    totalSales: supplier.totalSales || 0,
    commissionRate: supplier.commissionRate,
  });
});

// ── POST /api/suppliers/me/agreement — accept seller agreement ───────────────
router.post('/me/agreement', authenticate, requireRole('supplier'), validate(agreementSchema), (req, res) => {
  const supplier = getSupplierByUserId(req.user.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier profile not found' });
  if (supplier.agreementAccepted) return res.status(400).json({ error: 'Agreement already accepted' });

  const timestamp = new Date().toISOString();
  const agreementVersion = '1.0';

  updateSupplier(supplier.id, {
    agreementAccepted: true,
    agreementTimestamp: timestamp,
    agreementVersion,
  });

  logAgreementAcceptance({
    supplierId: supplier.id,
    timestamp,
    ip: req.ip,
    agreementVersion,
    userAgent: req.headers['user-agent'] || '',
  });

  res.json({ ok: true, message: 'Agreement accepted', timestamp, version: agreementVersion });
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN: IP TAKEDOWN ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

// ── POST /api/suppliers/admin/takedown — initiate IP takedown ────────────────
router.post('/admin/takedown', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(takedownSchema), async (req, res) => {
  const { productId, reason, noticeDetails } = req.validated;
  const product = getProductById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!product.vendorId) return res.status(400).json({ error: 'Not a supplier product' });

  await updateProduct(productId, { productStatus: 'under_review' });

  const log = createTakedownLog({
    productId,
    vendorId: product.vendorId,
    reason,
    initiatedBy: req.user.id,
    noticeDetails,
  });

  res.status(201).json({ ok: true, takedown: log });
});

// ── PATCH /api/suppliers/admin/takedown/:id — update takedown step ───────────
router.patch('/admin/takedown/:id', csrfProtection, authenticate, requireRole('admin'), adminIpCheck, auditLog, validate(takedownUpdateSchema), async (req, res) => {
  const { step, note } = req.validated;
  const updated = updateTakedownLog(req.params.id, step, req.user.id, note);
  if (!updated) return res.status(404).json({ error: 'Takedown log not found' });

  if (step === 'resolved_removed') {
    await updateProduct(updated.productId, { productStatus: 'rejected' });
  }
  if (step === 'resolved_kept') {
    await updateProduct(updated.productId, { productStatus: 'approved' });
  }

  res.json({ ok: true, takedown: updated });
});

// ── GET /api/suppliers/admin/takedowns — list all takedown logs ──────────────
router.get('/admin/takedowns', authenticate, requireRole('admin'), adminIpCheck, (req, res) => {
  const logs = getTakedownLogs();
  res.json({ takedowns: logs });
});

export default router;
