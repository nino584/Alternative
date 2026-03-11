import { Router } from 'express';
import { z } from 'zod';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../db/store.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1).max(200),
  section: z.enum(['Womenswear', 'Menswear', 'Kidswear']),
  cat: z.string().min(1).max(50),
  sub: z.string().max(50).optional().default(''),
  color: z.string().max(50).optional().default(''),
  price: z.number().positive(),
  sale: z.number().positive().nullable().optional(),
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

// ── GET /api/products — public ────────────────────────────────────────────
router.get('/', (req, res) => {
  const products = getAllProducts().filter(p => !p.productStatus || p.productStatus === 'approved');
  res.json({ products });
});

// ── GET /api/products/:id — public ────────────────────────────────────────
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });
  const product = getProductById(id);
  if (!product || (product.productStatus && product.productStatus !== 'approved')) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

// ── POST /api/products — admin only ───────────────────────────────────────
router.post('/', authenticate, requireRole('admin'), validate(productSchema), async (req, res) => {
  const product = await createProduct({ ...req.validated });
  res.status(201).json({ product });
});

// ── PUT /api/products/:id — admin only ────────────────────────────────────
router.put('/:id', authenticate, requireRole('admin'), validate(productSchema), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = await updateProduct(id, req.validated);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

// ── DELETE /api/products/:id — admin only ─────────────────────────────────
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ok = await deleteProduct(id);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  res.json({ ok: true });
});

export default router;
