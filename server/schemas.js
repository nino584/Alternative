import { z } from 'zod';

// Reusable password schema (same rules as registration)
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character');

// ── Newsletter ────────────────────────────────────────────────────────────────
export const subscribeSchema = z.object({
  email: z.string().email('Valid email is required').max(254),
});

// ── Contact Form ──────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Valid email is required').max(254),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
  website: z.string().max(200).optional(), // honeypot field
});

// ── Promo Codes ───────────────────────────────────────────────────────────────
export const createPromoSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  type: z.enum(['fixed', 'percent'], { errorMap: () => ({ message: 'Type must be fixed or percent' }) }),
  value: z.number().positive('Value must be a positive number'),
  minOrder: z.number().min(0).optional().default(0),
  maxUses: z.number().int().min(0).optional().default(0),
  expiresAt: z.string().nullable().optional().default(null),
});

export const updatePromoSchema = z.object({
  active: z.boolean().optional(),
  value: z.number().positive().optional(),
  minOrder: z.number().min(0).optional(),
  maxUses: z.number().int().min(0).optional(),
  expiresAt: z.string().nullable().optional(),
}).refine(data => Object.keys(data).length > 0, { message: 'At least one field required' });

export const validatePromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required').max(50),
  subtotal: z.number().min(0).optional().default(0),
});

// ── Wishlist ──────────────────────────────────────────────────────────────────
export const wishlistSchema = z.object({
  items: z.array(z.string().or(z.number())).max(200, 'Wishlist too large'),
});

// ── Returns ───────────────────────────────────────────────────────────────────
export const createReturnSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  reason: z.string().min(1, 'Reason is required').max(1000),
  items: z.array(z.any()).optional().default([]),
});

export const updateReturnStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'completed'], {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
  adminNote: z.string().max(1000).optional(),
});

// ── Stock Notifications ───────────────────────────────────────────────────────
export const notifyStockSchema = z.object({
  productId: z.string().or(z.number()),
  email: z.string().email('Valid email is required').max(254),
});

// ── Messages ──────────────────────────────────────────────────────────────────
const mediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  data: z.string().max(500000).optional(), // base64 for images (max ~375KB)
  url: z.string().url().optional(), // URL for videos
}).refine(
  m => (m.type === 'image' && m.data) || (m.type === 'video' && m.url),
  { message: 'Image must have data, video must have url' }
);

export const createMessageSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  content: z.string().max(2000).optional().default(''),
  media: z.array(mediaItemSchema).min(1, 'At least one media item is required'),
});

// ── Auth: Reset/Change Password ───────────────────────────────────────────────
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// ── Auth: Profile ─────────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
}).refine(data => data.name || data.phone !== undefined, { message: 'No valid fields to update' });

// ── Unsubscribe ───────────────────────────────────────────────────────────────
export const unsubscribeSchema = z.object({
  email: z.string().email('Valid email is required').max(254),
});

// ── Error Report ──────────────────────────────────────────────────────────────
export const errorReportSchema = z.object({
  message: z.string().min(1).max(500),
  stack: z.string().max(2000).optional().default(''),
  url: z.string().max(500).optional().default(''),
  userAgent: z.string().max(300).optional().default(''),
});
