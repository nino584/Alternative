import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { getAllOrders, getOrdersByUser, createOrder, updateOrderStatus, getOrderById } from '../db/store.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const VALID_STATUSES = ['reserved', 'sourcing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const orderSchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1).max(200),
  selectedSize: z.string().min(1).max(20),
  wantVideo: z.boolean().default(false),
  customerName: z.string().min(1).max(200),
  phone: z.string().min(5).max(30),
  email: z.string().email(),
  notes: z.string().max(500).optional().default(''),
  shippingAddress: z.object({
    address: z.string().min(1).max(300),
    city: z.string().min(1).max(100),
    country: z.string().min(1).max(60),
    postal: z.string().max(20).optional().default(''),
  }),
  price: z.number().positive(),
  depositPaid: z.number().positive(),
});

const statusUpdateSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

// ── GET /api/orders — user sees own, admin sees all ───────────────────────
router.get('/', authenticate, (req, res) => {
  if (req.user.role === 'admin') {
    return res.json({ orders: getAllOrders() });
  }
  return res.json({ orders: getOrdersByUser(req.user.id) });
});

// ── GET /api/orders/:orderId ──────────────────────────────────────────────
router.get('/:orderId', authenticate, (req, res) => {
  const order = getOrderById(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  // Users can only see their own orders
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json({ order });
});

// ── POST /api/orders — create order (authenticated user) ─────────────────
router.post('/', authenticate, validate(orderSchema), (req, res) => {
  const orderId = 'ALT-2026-' + String(Math.floor(Math.random() * 9000) + 1000);
  const order = createOrder({
    orderId,
    userId: req.user.id,
    status: 'reserved',
    ...req.validated,
  });
  res.status(201).json({ order });
});

// ── PATCH /api/orders/:orderId/status — admin only ────────────────────────
router.patch('/:orderId/status', authenticate, requireRole('admin'), validate(statusUpdateSchema), (req, res) => {
  const order = updateOrderStatus(req.params.orderId, req.validated.status, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

export default router;
