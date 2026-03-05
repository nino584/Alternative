import { Router } from 'express';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { getAllOrders, getOrdersByUser, createOrder, updateOrderStatus, getOrderById, getProductById, addStatusHistory, getAffiliateByCode, createAffiliateClick, addAffiliatePendingEarnings, getPromoCodes, updatePromoCode, getSupplierById, addSupplierEarnings } from '../db/store.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

// ── HTML escape helper (prevents XSS in emails) ──
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── Email transporter (configure via env vars) ──
const smtpPort = Number((process.env.SMTP_PORT || '').trim()) || 587;
const mailTransport = (process.env.SMTP_HOST && process.env.SMTP_USER) ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}) : null;

const STORE_EMAIL = process.env.STORE_EMAIL || 'info@alternative.ge';
const STORE_NAME = 'Alternative';
const VIDEO_VERIFICATION_PRICE = 28;

function sendOrderConfirmation(order) {
  if (!mailTransport || !order.email) return;
  const sizeSuffix = order.selectedSize && order.selectedSize !== 'One Size' ? ` — Size ${esc(order.selectedSize)}` : '';
  const total = order.price + (order.wantVideo ? VIDEO_VERIFICATION_PRICE : 0);
  const orderDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const addr = order.shippingAddress || {};

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Order Confirmation — ${STORE_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ede8;-webkit-font-smoothing:antialiased">

<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ede8">
<tr><td align="center" style="padding:40px 16px">

<!-- Main container -->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff">

  <!-- ═══ HEADER BAR ═══ -->
  <tr><td style="background-color:#191919;padding:28px 48px;text-align:center">
    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:300;color:#ffffff;letter-spacing:0.2em;text-transform:uppercase">ALTERNATIVE</h1>
  </td></tr>

  <!-- ═══ GOLD ACCENT LINE ═══ -->
  <tr><td style="height:3px;background:linear-gradient(90deg,#c4a265,#b19a7a,#d4b896,#b19a7a,#c4a265);font-size:0;line-height:0">&nbsp;</td></tr>

  <!-- ═══ HERO: THANK YOU ═══ -->
  <tr><td style="padding:56px 48px 40px;text-align:center;background-color:#ffffff">
    <!-- Elegant circle check -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px">
    <tr><td style="width:72px;height:72px;border-radius:50%;border:2px solid #b19a7a;text-align:center;vertical-align:middle;background-color:#faf8f5">
      <span style="color:#b19a7a;font-size:32px;line-height:72px">&#10003;</span>
    </td></tr>
    </table>

    <p style="margin:0 0 8px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.25em;color:#b19a7a;text-transform:uppercase">Thank You for Your Order</p>
    <h2 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:36px;font-weight:300;color:#191919;line-height:1.2">Order Confirmed</h2>
    <p style="margin:0 0 6px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#888888">Order Number</p>
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#191919;letter-spacing:0.08em;font-weight:400">${order.orderId}</p>
  </td></tr>

  <!-- ═══ DIVIDER ═══ -->
  <tr><td style="padding:0 48px"><div style="height:1px;background-color:#e8e5df"></div></td></tr>

  <!-- ═══ ORDER DETAILS ═══ -->
  <tr><td style="padding:36px 48px">
    <p style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.2em;color:#b19a7a;text-transform:uppercase">Order Details</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Item row -->
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #f0ede8;vertical-align:top">
          <p style="margin:0 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#191919;font-weight:500">${esc(order.productName)}</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#999999">${sizeSuffix ? 'Size: ' + order.selectedSize : 'One Size'}</p>
        </td>
        <td style="padding:16px 0;border-bottom:1px solid #f0ede8;text-align:right;vertical-align:top;white-space:nowrap">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#191919">GEL ${order.price}</p>
        </td>
      </tr>

      ${order.wantVideo ? `
      <!-- Video verification -->
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;vertical-align:middle">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:20px;height:20px;background-color:#191919;border-radius:50%;text-align:center;vertical-align:middle;font-size:10px;color:#ffffff;font-family:Arial;line-height:20px">&#9654;</td>
            <td style="padding-left:10px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#191919">Video Verification</td>
          </tr></table>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#191919;vertical-align:middle">GEL ${VIDEO_VERIFICATION_PRICE}</td>
      </tr>
      ` : ''}

      <!-- Shipping -->
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#888888">Shipping</td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#b19a7a;font-weight:500">Included</td>
      </tr>

      <!-- Total -->
      <tr>
        <td style="padding:20px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#191919;font-weight:600;text-transform:uppercase;letter-spacing:0.08em">Total</td>
        <td style="padding:20px 0 0;text-align:right;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#191919;font-weight:400">GEL ${total}</td>
      </tr>
    </table>
  </td></tr>

  <!-- ═══ SHIPPING ADDRESS ═══ -->
  <tr><td style="padding:0 48px 36px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf8f5;border-left:3px solid #b19a7a">
      <tr><td style="padding:24px 28px">
        <p style="margin:0 0 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.2em;color:#b19a7a;text-transform:uppercase">Delivering To</p>
        <p style="margin:0 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#191919;font-weight:500">${esc(order.customerName)}</p>
        <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#888888;line-height:1.7">${esc(addr.address || '')}<br>${esc(addr.city || '')}${addr.postal ? ', ' + esc(addr.postal) : ''} &middot; ${esc(addr.country || '')}</p>
        <p style="margin:8px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#888888">${esc(order.phone || '')}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ═══ DIVIDER ═══ -->
  <tr><td style="padding:0 48px"><div style="height:1px;background-color:#e8e5df"></div></td></tr>

  <!-- ═══ WHAT HAPPENS NEXT ═══ -->
  <tr><td style="padding:36px 48px 40px">
    <p style="margin:0 0 24px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.2em;color:#b19a7a;text-transform:uppercase">Your Journey</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Step 1 -->
      <tr>
        <td style="width:44px;vertical-align:top;padding:0 0 24px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:32px;height:32px;border-radius:50%;background-color:#191919;text-align:center;vertical-align:middle">
              <span style="color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;line-height:32px">1</span>
            </td>
          </tr></table>
        </td>
        <td style="vertical-align:top;padding:0 0 24px 0">
          <p style="margin:0 0 3px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#191919;font-weight:600">Order Verified</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#888888;line-height:1.6">Our team confirms availability with our network of verified European suppliers</p>
        </td>
      </tr>

      <!-- Connector line -->
      <tr><td style="width:44px;padding:0"><div style="width:1px;height:0;margin:0 auto"></div></td><td></td></tr>

      <!-- Step 2 -->
      <tr>
        <td style="width:44px;vertical-align:top;padding:0 0 24px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:32px;height:32px;border-radius:50%;background-color:#191919;text-align:center;vertical-align:middle">
              <span style="color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;line-height:32px">2</span>
            </td>
          </tr></table>
        </td>
        <td style="vertical-align:top;padding:0 0 24px 0">
          <p style="margin:0 0 3px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#191919;font-weight:600">Personal Confirmation</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#888888;line-height:1.6">We'll reach out to you on WhatsApp within 2 hours to personally confirm your order details</p>
        </td>
      </tr>

      <!-- Step 3 -->
      <tr>
        <td style="width:44px;vertical-align:top;padding:0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:32px;height:32px;border-radius:50%;background-color:#191919;text-align:center;vertical-align:middle">
              <span style="color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:600;line-height:32px">3</span>
            </td>
          </tr></table>
        </td>
        <td style="vertical-align:top;padding:0">
          <p style="margin:0 0 3px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#191919;font-weight:600">${order.wantVideo ? 'Video Verification & Delivery' : 'Sourcing & Delivery'}</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;color:#888888;line-height:1.6">${order.wantVideo ? 'You\'ll receive a personalized video walkthrough on WhatsApp before we ship your item to Tbilisi' : 'Your item is carefully sourced, inspected, and delivered to Tbilisi within 10-18 days'}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  ${order.wantVideo ? `
  <!-- ═══ VIDEO VERIFICATION BADGE ═══ -->
  <tr><td style="padding:0 48px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#191919;border-radius:0">
      <tr><td style="padding:24px 28px;text-align:center">
        <p style="margin:0 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.2em;color:#b19a7a;text-transform:uppercase">Included with Your Order</p>
        <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#ffffff;font-weight:300">Video Verification</p>
        <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#999999;line-height:1.6">A personalized video of your item will be sent to your WhatsApp before shipping &mdash; so you can see every detail.</p>
      </td></tr>
    </table>
  </td></tr>
  ` : ''}

  <!-- ═══ GUARANTEE BADGES ═══ -->
  <tr><td style="padding:0 48px 36px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="width:33%;padding:16px 8px;text-align:center;vertical-align:top;border-top:1px solid #f0ede8">
          <p style="margin:0 0 6px;font-size:18px;color:#b19a7a">&#9733;</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#191919;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">Authentic</p>
          <p style="margin:4px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#999999;line-height:1.4">Verified suppliers</p>
        </td>
        <td style="width:33%;padding:16px 8px;text-align:center;vertical-align:top;border-top:1px solid #f0ede8;border-left:1px solid #f0ede8;border-right:1px solid #f0ede8">
          <p style="margin:0 0 6px;font-size:18px;color:#b19a7a">&#8634;</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#191919;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">Free Cancel</p>
          <p style="margin:4px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#999999;line-height:1.4">Before sourcing</p>
        </td>
        <td style="width:33%;padding:16px 8px;text-align:center;vertical-align:top;border-top:1px solid #f0ede8">
          <p style="margin:0 0 6px;font-size:18px;color:#b19a7a">&#9906;</p>
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#191919;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">Secure</p>
          <p style="margin:4px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#999999;line-height:1.4">Encrypted checkout</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ═══ CTA BUTTON ═══ -->
  <tr><td style="padding:0 48px 40px;text-align:center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
      <tr><td style="background-color:#191919;padding:16px 48px;text-align:center">
        <a href="https://alternative.ge/orders" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#ffffff;text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;font-weight:500">Track Your Order</a>
      </td></tr>
    </table>
  </td></tr>

  <!-- ═══ FOOTER ═══ -->
  <tr><td style="background-color:#191919;padding:36px 48px;text-align:center">
    <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#ffffff;letter-spacing:0.15em;font-weight:300;text-transform:uppercase">${STORE_NAME}</p>
    <p style="margin:0 0 16px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#888888;letter-spacing:0.05em">Curated Designer Fashion</p>

    <div style="margin:0 0 20px;height:1px;background-color:#333333"></div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
      <tr>
        <td style="padding:0 12px"><a href="https://www.instagram.com/alternative.ge" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#999999;text-decoration:none;letter-spacing:0.05em">Instagram</a></td>
        <td style="color:#444;font-size:11px">&middot;</td>
        <td style="padding:0 12px"><a href="https://www.facebook.com/alternative.ge" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#999999;text-decoration:none;letter-spacing:0.05em">Facebook</a></td>
        <td style="color:#444;font-size:11px">&middot;</td>
        <td style="padding:0 12px"><a href="https://www.tiktok.com/@alternative.ge" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#999999;text-decoration:none;letter-spacing:0.05em">TikTok</a></td>
      </tr>
    </table>

    <p style="margin:20px 0 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#666666;line-height:1.6">Questions about your order? Reply to this email<br>or message us on WhatsApp</p>

    <div style="margin:20px 0 0;height:1px;background-color:#333333"></div>

    <p style="margin:16px 0 4px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#555555">${orderDate}</p>
    <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#555555">&copy; ${new Date().getFullYear()} ${STORE_NAME} &middot; Tbilisi, Georgia</p>
  </td></tr>

</table>
<!-- End main container -->

</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->

</body></html>`;

  mailTransport.sendMail({
    from: `"${STORE_NAME}" <${STORE_EMAIL}>`,
    to: order.email,
    subject: `Your Order is Confirmed — ${order.orderId} | ${STORE_NAME}`,
    html,
  }).catch(err => console.error('Email send failed:', err.message));
}

const router = Router();

const VALID_STATUSES = ['reserved', 'sourcing', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const orderSchema = z.object({
  productId: z.union([z.number(), z.string()]),
  productName: z.string().min(1).max(200),
  img: z.string().optional().default(''),
  brand: z.string().max(100).optional().default(''),
  color: z.string().max(100).optional().default(''),
  selectedSize: z.string().min(1).max(50).default('One Size'),
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
  payMethod: z.string().max(20).optional().default('BOG'),
  affiliateCode: z.string().max(30).optional().default(''),
  promoCode: z.string().max(30).optional().default(''),
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
  // Return 404 for both missing and unauthorized orders to prevent ID enumeration
  if (!order || (req.user.role !== 'admin' && order.userId !== req.user.id)) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

// ── POST /api/orders — create order (authenticated or guest) ─────────────
router.post('/', optionalAuth, validate(orderSchema), (req, res) => {
  // Server-side validation: look up actual product price & image
  const product = getProductById(Number(req.validated.productId)) || getProductById(String(req.validated.productId));
  if (!product) {
    return res.status(400).json({ error: 'Product not found. Please try again.' });
  }
  let serverPrice = product.sale ?? product.price;

  // Apply promo code discount server-side
  let promoDiscount = 0;
  if (req.validated.promoCode) {
    const promos = getPromoCodes();
    const promo = promos.find(p => p.code.toLowerCase() === req.validated.promoCode.trim().toLowerCase() && p.active);
    if (promo) {
      const valid = (!promo.minOrder || serverPrice >= promo.minOrder)
        && (!promo.maxUses || promo.usedCount < promo.maxUses)
        && (!promo.expiresAt || new Date(promo.expiresAt) >= new Date());
      if (valid) {
        promoDiscount = promo.type === 'percent'
          ? Math.round((serverPrice * promo.value) / 100)
          : promo.value;
        promoDiscount = Math.min(promoDiscount, serverPrice);
        serverPrice = serverPrice - promoDiscount;
        updatePromoCode(promo.code, { usedCount: (promo.usedCount || 0) + 1 });
        req.validated.promoCode = promo.code; // normalize case
        req.validated.promoDiscount = promoDiscount;
      } else {
        req.validated.promoCode = '';
      }
    } else {
      req.validated.promoCode = '';
    }
  }

  req.validated.price = serverPrice;
  req.validated.depositPaid = serverPrice;
  // Use product image if client didn't send one or sent base64 (avoid storing large blobs in orders)
  if (!req.validated.img || req.validated.img.startsWith('data:')) {
    req.validated.img = product.img?.startsWith('data:') ? '' : (product.img || '');
  }

  // Attach vendor info from product
  if (product.vendorId) {
    req.validated.vendorId = product.vendorId;
    req.validated.vendorName = product.vendorName || '';
  }

  const orderId = 'ALT-' + randomBytes(6).toString('hex').toUpperCase();
  const order = createOrder({
    orderId,
    userId: req.user?.id || null,
    status: 'reserved',
    ...req.validated,
  });

  // Supplier earnings tracking
  if (product.vendorId) {
    const supplier = getSupplierById(product.vendorId);
    if (supplier && supplier.status === 'approved') {
      const supplierShare = Math.round(serverPrice * (100 - supplier.commissionRate) / 100);
      addSupplierEarnings(supplier.id, supplierShare);
    }
  }

  // Affiliate commission tracking
  if (req.validated.affiliateCode) {
    const affiliate = getAffiliateByCode(req.validated.affiliateCode);
    if (affiliate && affiliate.status === 'approved') {
      const commission = Math.round(order.price * affiliate.commission_rate / 100);
      createAffiliateClick({
        affiliate_code: affiliate.code,
        type: 'conversion',
        order_id: orderId,
        order_amount: order.price,
        commission,
        status: 'pending',
      });
      addAffiliatePendingEarnings(affiliate.code, commission);
    }
  }

  sendOrderConfirmation(order);
  res.status(201).json({ order });
});

// ── PATCH /api/orders/:orderId/status — admin only ────────────────────────
router.patch('/:orderId/status', authenticate, requireRole('admin'), validate(statusUpdateSchema), (req, res) => {
  const order = updateOrderStatus(req.params.orderId, req.validated.status, req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  addStatusHistory(req.params.orderId, req.validated.status, req.user.id);
  res.json({ order });
});

// ── POST /api/orders/:orderId/cancel — user cancels own order ─────────────
router.post('/:orderId/cancel', authenticate, (req, res) => {
  const order = getOrderById(req.params.orderId);
  if (!order || (req.user.role !== 'admin' && order.userId !== req.user.id)) {
    return res.status(404).json({ error: 'Order not found' });
  }
  // Only allow cancellation before shipped
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
  }
  const updated = updateOrderStatus(req.params.orderId, 'cancelled', req.user.id);
  addStatusHistory(req.params.orderId, 'cancelled', req.user.id);
  res.json({ order: updated });
});

// ── GET /api/orders/:orderId/invoice — generate receipt HTML ──────────────
router.get('/:orderId/invoice', authenticate, (req, res) => {
  const order = getOrderById(req.params.orderId);
  if (!order || (req.user.role !== 'admin' && order.userId !== req.user.id)) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const total = (order.price || 0) + (order.wantVideo ? VIDEO_VERIFICATION_PRICE : 0);
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${order.orderId}</title>
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#191919;font-size:14px;line-height:1.6}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #191919;padding-bottom:20px;margin-bottom:30px}
  .logo{font-family:Georgia,serif;font-size:28px;letter-spacing:0.2em;font-weight:300}
  .invoice-title{font-size:11px;letter-spacing:0.15em;color:#b19a7a;text-transform:uppercase;margin-bottom:4px}
  .meta{text-align:right;font-size:12px;color:#888}
  .section{margin:24px 0}
  .section-title{font-size:10px;letter-spacing:0.15em;color:#b19a7a;text-transform:uppercase;margin-bottom:12px}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;font-size:10px;letter-spacing:0.1em;color:#888;text-transform:uppercase;padding:10px 0;border-bottom:1px solid #ddd}
  td{padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px}
  .total-row td{border-bottom:2px solid #191919;font-weight:600;font-size:16px;padding-top:16px}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#888;text-align:center}
  @media print{body{margin:0;padding:20px}}
</style></head><body>
<div class="header">
  <div>
    <div class="logo">ALTERNATIVE</div>
    <p class="invoice-title">Invoice / Receipt</p>
  </div>
  <div class="meta">
    <p><strong>${esc(order.orderId)}</strong></p>
    <p>${orderDate}</p>
    <p>Status: ${esc(order.status || 'reserved')}</p>
  </div>
</div>
<div class="section">
  <p class="section-title">Bill To</p>
  <p><strong>${esc(order.customerName || '')}</strong></p>
  <p>${esc(order.email || '')}</p>
  <p>${esc(order.phone || '')}</p>
  ${order.shippingAddress ? `<p>${esc(order.shippingAddress.address || '')}, ${esc(order.shippingAddress.city || '')}${order.shippingAddress.postal ? ', ' + esc(order.shippingAddress.postal) : ''}</p><p>${esc(order.shippingAddress.country || '')}</p>` : ''}
</div>
<div class="section">
  <p class="section-title">Order Details</p>
  <table>
    <thead><tr><th>Item</th><th>Size</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>
      <tr><td>${esc(order.productName || '')}</td><td>${esc(order.selectedSize || 'One Size')}</td><td style="text-align:right">GEL ${order.price || 0}</td></tr>
      ${order.wantVideo ? `<tr><td>Video Verification</td><td>—</td><td style="text-align:right">GEL ${VIDEO_VERIFICATION_PRICE}</td></tr>` : ''}
      <tr><td>Shipping</td><td>—</td><td style="text-align:right">Included</td></tr>
      <tr class="total-row"><td colspan="2">Total</td><td style="text-align:right">GEL ${total}</td></tr>
    </tbody>
  </table>
</div>
<div class="footer">
  <p>Alternative Concept Store · Tbilisi, Georgia · info@alternative.ge</p>
  <p>Thank you for your order!</p>
</div>
</body></html>`;

  res.set('Content-Type', 'text/html');
  res.send(html);
});

export default router;
