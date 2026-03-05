import { readFileSync, writeFileSync, existsSync, renameSync, readdirSync, unlinkSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');
const BACKUP_DIR = join(__dirname, 'backups');
const MAX_BACKUPS = 10;

// Ensure backup directory exists
if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });

function readDB() {
  try {
    if (!existsSync(DB_PATH)) return { users: [], products: [], orders: [] };
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  } catch (err) {
    console.error('[DB] Failed to read database:', err.message);
    return { users: [], products: [], orders: [] };
  }
}

function writeDB(data) {
  try {
    const tmp = DB_PATH + '.tmp';
    writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
    renameSync(tmp, DB_PATH);
    createBackup(data);
  } catch (err) {
    console.error('[DB] Write failed:', err.message);
    throw new Error('Database write failed');
  }
}

// ── Data Backup Mechanism ─────────────────────────────────────────────────────
let lastBackupTime = 0;
const BACKUP_THROTTLE_MS = 30 * 1000; // Max once per 30 seconds

function createBackup(data) {
  const now = Date.now();
  if (now - lastBackupTime < BACKUP_THROTTLE_MS) return;
  lastBackupTime = now;

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = join(BACKUP_DIR, `data-${timestamp}.json`);
    writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');

    // Rotate: keep only last MAX_BACKUPS
    const backups = readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('data-') && f.endsWith('.json'))
      .sort();
    while (backups.length > MAX_BACKUPS) {
      const oldest = backups.shift();
      try { unlinkSync(join(BACKUP_DIR, oldest)); } catch (_) {}
    }
  } catch (err) {
    console.error('[DB] Backup failed:', err.message);
  }
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function findUserByEmail(email) {
  return readDB().users.find(u => u.email === email.toLowerCase()) || null;
}

export function findUserById(id) {
  return readDB().users.find(u => u.id === id) || null;
}

export function createUser({ id, name, email, phone, password, role, provider }) {
  const db = readDB();
  const user = { id, name, email: email.toLowerCase(), phone: phone || "", password, role: role || "user", createdAt: new Date().toISOString() };
  if (provider) user.provider = provider;
  db.users.push(user);
  writeDB(db);
  return user;
}

export function deleteUser(id) {
  const db = readDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  db.users.splice(idx, 1);
  if (db.wishlists) db.wishlists = db.wishlists.filter(w => w.userId !== id);
  if (db.returnRequests) db.returnRequests = db.returnRequests.filter(r => r.userId !== id);
  // Clean up refresh tokens for deleted user
  if (db.refreshTokens) db.refreshTokens = db.refreshTokens.filter(t => t.userId !== id);
  writeDB(db);
  return true;
}

// ── Products ──────────────────────────────────────────────────────────────────
export function getAllProducts() {
  return readDB().products;
}

export function getProductById(id) {
  return readDB().products.find(p => p.id === id) || null;
}

export function createProduct(product) {
  const db = readDB();
  db.products.push(product);
  writeDB(db);
  return product;
}

export function updateProduct(id, updates) {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...updates, id };
  writeDB(db);
  return db.products[idx];
}

export function deleteProduct(id) {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  db.products.splice(idx, 1);
  writeDB(db);
  return true;
}

// ── Orders ────────────────────────────────────────────────────────────────────
export function getAllOrders() {
  return readDB().orders;
}

export function getOrdersByUser(userId) {
  return readDB().orders.filter(o => o.userId === userId);
}

export function getOrderById(orderId) {
  return readDB().orders.find(o => o.orderId === orderId) || null;
}

export function createOrder(order) {
  const db = readDB();
  const full = { ...order, createdAt: new Date().toISOString(), statusHistory: [{ status: order.status || 'reserved', at: new Date().toISOString(), by: 'system' }] };
  db.orders.push(full);
  writeDB(db);
  return full;
}

export function updateOrderStatus(orderId, status, updatedBy) {
  const db = readDB();
  const idx = db.orders.findIndex(o => o.orderId === orderId);
  if (idx === -1) return null;
  db.orders[idx].status = status;
  db.orders[idx].updatedAt = new Date().toISOString();
  db.orders[idx].updatedBy = updatedBy;
  writeDB(db);
  return db.orders[idx];
}

export function addStatusHistory(orderId, status, by) {
  const db = readDB();
  const idx = db.orders.findIndex(o => o.orderId === orderId);
  if (idx === -1) return;
  if (!db.orders[idx].statusHistory) db.orders[idx].statusHistory = [];
  db.orders[idx].statusHistory.push({ status, at: new Date().toISOString(), by: by || 'system' });
  writeDB(db);
}

// ── Subscribers ──────────────────────────────────────────────────────────────
export function getAllSubscribers() {
  const db = readDB();
  return db.subscribers || [];
}

export function addSubscriber(email) {
  const db = readDB();
  if (!db.subscribers) db.subscribers = [];
  if (db.subscribers.find(s => s.email === email.toLowerCase())) return null;
  const sub = { email: email.toLowerCase(), subscribedAt: new Date().toISOString() };
  db.subscribers.push(sub);
  writeDB(db);
  return sub;
}

export function removeSubscriber(email) {
  const db = readDB();
  if (!db.subscribers) return false;
  const idx = db.subscribers.findIndex(s => s.email === email.toLowerCase());
  if (idx === -1) return false;
  db.subscribers.splice(idx, 1);
  writeDB(db);
  return true;
}

// ── Promo Codes ──────────────────────────────────────────────────────────────
export function getPromoCodes() {
  const db = readDB();
  return db.promoCodes || [];
}

export function addPromoCode(promo) {
  const db = readDB();
  if (!db.promoCodes) db.promoCodes = [];
  const enriched = { ...promo, createdAt: new Date().toISOString(), usedCount: 0 };
  db.promoCodes.push(enriched);
  writeDB(db);
  return enriched;
}

// ── User Updates ─────────────────────────────────────────────────────────────
export function updateUser(id, updates) {
  const db = readDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const allowed = ['name', 'email', 'phone', 'password', 'emailVerified', 'twoFactorSecret', 'twoFactorEnabled'];
  for (const key of allowed) {
    if (updates[key] !== undefined) db.users[idx][key] = updates[key];
  }
  db.users[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.users[idx];
}

// ── Login Attempts (persisted in data.json) ──────────────────────────────────
export function getLoginAttempts(email) {
  const db = readDB();
  if (!db.loginAttempts) return null;
  return db.loginAttempts[email.toLowerCase()] || null;
}

export function recordLoginAttempt(email, failed) {
  const db = readDB();
  if (!db.loginAttempts) db.loginAttempts = {};
  const key = email.toLowerCase();
  if (failed) {
    const current = db.loginAttempts[key] || { count: 0, lockedUntil: null };
    current.count++;
    current.lastAttempt = new Date().toISOString();
    if (current.count >= 5) {
      current.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    }
    db.loginAttempts[key] = current;
  } else {
    delete db.loginAttempts[key];
  }
  writeDB(db);
}

export function cleanExpiredLockouts() {
  const db = readDB();
  if (!db.loginAttempts) return;
  const now = new Date();
  let changed = false;
  for (const key of Object.keys(db.loginAttempts)) {
    const entry = db.loginAttempts[key];
    if (entry.lockedUntil && new Date(entry.lockedUntil) < now) {
      delete db.loginAttempts[key];
      changed = true;
    }
  }
  if (changed) writeDB(db);
}

// ── Password Reset Tokens ────────────────────────────────────────────────────
const resetTokens = new Map();

export function storeResetToken(token, userId) {
  resetTokens.set(token, { userId, expiresAt: Date.now() + 60 * 60 * 1000 });
}

export function consumeResetToken(token) {
  const entry = resetTokens.get(token);
  if (!entry) return null;
  resetTokens.delete(token);
  if (Date.now() > entry.expiresAt) return null;
  return entry.userId;
}

// ── Wishlists ────────────────────────────────────────────────────────────────
export function getWishlist(userId) {
  const db = readDB();
  if (!db.wishlists) return [];
  const entry = db.wishlists.find(w => w.userId === userId);
  return entry ? entry.items : [];
}

export function saveWishlist(userId, items) {
  const db = readDB();
  if (!db.wishlists) db.wishlists = [];
  const idx = db.wishlists.findIndex(w => w.userId === userId);
  if (idx === -1) db.wishlists.push({ userId, items, updatedAt: new Date().toISOString() });
  else { db.wishlists[idx].items = items; db.wishlists[idx].updatedAt = new Date().toISOString(); }
  writeDB(db);
}

// ── Return Requests ──────────────────────────────────────────────────────────
export function getReturnRequests() {
  const db = readDB();
  return db.returnRequests || [];
}

export function getReturnRequestsByUser(userId) {
  const db = readDB();
  return (db.returnRequests || []).filter(r => r.userId === userId);
}

export function createReturnRequest(request) {
  const db = readDB();
  if (!db.returnRequests) db.returnRequests = [];
  const entry = { ...request, createdAt: new Date().toISOString(), status: 'pending' };
  db.returnRequests.push(entry);
  writeDB(db);
  return entry;
}

export function updateReturnStatus(requestId, status, adminNote) {
  const db = readDB();
  if (!db.returnRequests) return null;
  const idx = db.returnRequests.findIndex(r => r.id === requestId);
  if (idx === -1) return null;
  db.returnRequests[idx].status = status;
  if (adminNote) db.returnRequests[idx].adminNote = adminNote;
  db.returnRequests[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.returnRequests[idx];
}

// ── Promo Code Updates ───────────────────────────────────────────────────────
export function updatePromoCode(code, updates) {
  const db = readDB();
  if (!db.promoCodes) return null;
  const idx = db.promoCodes.findIndex(p => p.code === code);
  if (idx === -1) return null;
  Object.assign(db.promoCodes[idx], updates);
  writeDB(db);
  return db.promoCodes[idx];
}

export function deletePromoCode(code) {
  const db = readDB();
  if (!db.promoCodes) return false;
  const idx = db.promoCodes.findIndex(p => p.code === code);
  if (idx === -1) return false;
  db.promoCodes.splice(idx, 1);
  writeDB(db);
  return true;
}

// ── Users (admin) ────────────────────────────────────────────────────────────
export function getAllUsers() {
  return readDB().users.map(u => ({
    id: u.id, name: u.name, email: u.email, phone: u.phone,
    role: u.role, createdAt: u.createdAt,
  }));
}

// ── Stock Notifications ──────────────────────────────────────────────────────
export function getStockNotifications() {
  const db = readDB();
  return db.stockNotifications || [];
}

export function getStockNotificationsByProduct(productId) {
  const db = readDB();
  return (db.stockNotifications || []).filter(n => String(n.productId) === String(productId));
}

export function addStockNotification(productId, email) {
  const db = readDB();
  if (!db.stockNotifications) db.stockNotifications = [];
  const exists = db.stockNotifications.find(
    n => n.email === email.toLowerCase() && String(n.productId) === String(productId)
  );
  if (exists) return null;
  const entry = { productId, email: email.toLowerCase(), createdAt: new Date().toISOString(), notified: false };
  db.stockNotifications.push(entry);
  writeDB(db);
  return entry;
}

// ── Messages (order media / notifications) ──────────────────────────────────
export function getMessagesByOrder(orderId) {
  const db = readDB();
  return (db.messages || []).filter(m => m.orderId === orderId);
}

export function getMessagesByUser(userId) {
  const db = readDB();
  return (db.messages || []).filter(m => m.userId === userId);
}

export function getUnreadCountByUser(userId) {
  const db = readDB();
  return (db.messages || []).filter(m => m.userId === userId && !m.read).length;
}

export function createMessage({ orderId, userId, email, content, media }) {
  const db = readDB();
  if (!db.messages) db.messages = [];
  const msg = {
    id: 'msg_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    orderId,
    userId: userId || null,
    email: email || null,
    content: content || '',
    media: media || [],
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(msg);
  writeDB(db);
  return msg;
}

export function markMessageRead(messageId, userId) {
  const db = readDB();
  if (!db.messages) return null;
  const idx = db.messages.findIndex(m => m.id === messageId && m.userId === userId);
  if (idx === -1) return null;
  db.messages[idx].read = true;
  writeDB(db);
  return db.messages[idx];
}

export function markAllMessagesRead(userId) {
  const db = readDB();
  if (!db.messages) return 0;
  let count = 0;
  db.messages.forEach(m => {
    if (m.userId === userId && !m.read) { m.read = true; count++; }
  });
  if (count > 0) writeDB(db);
  return count;
}

// ── Refresh Tokens (persistent in data.json) ─────────────────────────────────
const MAX_TOKENS_PER_USER = 5;

export function storeRefreshToken(token, userId, userAgent) {
  const db = readDB();
  if (!db.refreshTokens) db.refreshTokens = [];

  // Limit tokens per user — revoke oldest if exceeded
  if (userId) {
    const userTokens = db.refreshTokens.filter(t => t.userId === userId);
    if (userTokens.length >= MAX_TOKENS_PER_USER) {
      userTokens.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const toRemove = userTokens.slice(0, userTokens.length - MAX_TOKENS_PER_USER + 1);
      db.refreshTokens = db.refreshTokens.filter(t => !toRemove.some(r => r.token === t.token));
    }
  }

  // Hash user-agent for fingerprinting (not stored raw for privacy)
  const uaHash = userAgent ? crypto.createHash('sha256').update(userAgent).digest('hex').slice(0, 16) : null;

  db.refreshTokens.push({
    token,
    userId: userId || null,
    uaHash,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });
  writeDB(db);
}

export function hasRefreshToken(token, userAgent) {
  const db = readDB();
  if (!db.refreshTokens) return false;
  const entry = db.refreshTokens.find(t => t.token === token);
  if (!entry) return false;
  if (new Date(entry.expiresAt) < new Date()) {
    removeRefreshToken(token);
    return false;
  }
  // Verify user-agent fingerprint matches
  if (entry.uaHash && userAgent) {
    const currentHash = crypto.createHash('sha256').update(userAgent).digest('hex').slice(0, 16);
    if (entry.uaHash !== currentHash) return false; // UA mismatch — possible token theft
  }
  return true;
}

export function removeRefreshToken(token) {
  const db = readDB();
  if (!db.refreshTokens) return;
  db.refreshTokens = db.refreshTokens.filter(t => t.token !== token);
  writeDB(db);
}

export function removeAllRefreshTokensForUser(userId) {
  const db = readDB();
  if (!db.refreshTokens) return;
  db.refreshTokens = db.refreshTokens.filter(t => t.userId !== userId);
  writeDB(db);
}

// Clean up expired refresh tokens on startup and every hour
function cleanExpiredRefreshTokens() {
  const db = readDB();
  if (!db.refreshTokens || db.refreshTokens.length === 0) return;
  const now = new Date();
  const before = db.refreshTokens.length;
  db.refreshTokens = db.refreshTokens.filter(t => new Date(t.expiresAt) > now);
  if (db.refreshTokens.length < before) {
    writeDB(db);
    console.log(`[DB] Cleaned ${before - db.refreshTokens.length} expired refresh tokens`);
  }
}

cleanExpiredRefreshTokens();
setInterval(cleanExpiredRefreshTokens, 60 * 60 * 1000);

// Clean expired lockouts on startup and every 10 min
cleanExpiredLockouts();
setInterval(cleanExpiredLockouts, 10 * 60 * 1000);

// ── Affiliates ──────────────────────────────────────────────────────────────
export function getAffiliates() {
  return readDB().affiliates || [];
}

export function getAffiliateById(id) {
  return (readDB().affiliates || []).find(a => a.id === id) || null;
}

export function getAffiliateByCode(code) {
  const lower = code.toLowerCase();
  return (readDB().affiliates || []).find(a => a.code.toLowerCase() === lower) || null;
}

export function getAffiliateByEmail(email) {
  return (readDB().affiliates || []).find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createAffiliate({ name, email, instagram, tiktok, niche, audienceSize, code, description }) {
  const db = readDB();
  if (!db.affiliates) db.affiliates = [];
  const affiliate = {
    id: 'aff_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    name,
    email: email.toLowerCase(),
    instagram: instagram || '',
    tiktok: tiktok || '',
    niche: niche || '',
    audienceSize: audienceSize || '',
    code: code.toUpperCase(),
    description: description || '',
    status: 'pending',
    commission_rate: 10,
    pending_earnings: 0,
    paid_earnings: 0,
    created_at: new Date().toISOString(),
  };
  db.affiliates.push(affiliate);
  writeDB(db);
  return affiliate;
}

export function updateAffiliateStatus(id, status) {
  const db = readDB();
  if (!db.affiliates) return null;
  const idx = db.affiliates.findIndex(a => a.id === id);
  if (idx === -1) return null;
  db.affiliates[idx].status = status;
  db.affiliates[idx].updated_at = new Date().toISOString();
  writeDB(db);
  return db.affiliates[idx];
}

export function addAffiliatePendingEarnings(code, amount) {
  const db = readDB();
  if (!db.affiliates) return null;
  const lower = code.toLowerCase();
  const idx = db.affiliates.findIndex(a => a.code.toLowerCase() === lower);
  if (idx === -1) return null;
  db.affiliates[idx].pending_earnings = (db.affiliates[idx].pending_earnings || 0) + amount;
  writeDB(db);
  return db.affiliates[idx];
}

export function markAffiliatePaid(id) {
  const db = readDB();
  if (!db.affiliates) return null;
  const idx = db.affiliates.findIndex(a => a.id === id);
  if (idx === -1) return null;
  const pending = db.affiliates[idx].pending_earnings || 0;
  db.affiliates[idx].paid_earnings = (db.affiliates[idx].paid_earnings || 0) + pending;
  db.affiliates[idx].pending_earnings = 0;
  db.affiliates[idx].updated_at = new Date().toISOString();
  writeDB(db);
  return db.affiliates[idx];
}

// ── Affiliate Clicks ────────────────────────────────────────────────────────
export function getAffiliateClicks(code) {
  const lower = code.toLowerCase();
  return (readDB().affiliate_clicks || []).filter(c => c.affiliate_code.toLowerCase() === lower);
}

export function createAffiliateClick({ affiliate_code, type, order_id, order_amount, commission, status }) {
  const db = readDB();
  if (!db.affiliate_clicks) db.affiliate_clicks = [];
  const click = {
    id: 'clk_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    affiliate_code,
    type: type || 'click',
    order_id: order_id || null,
    order_amount: order_amount || 0,
    commission: commission || 0,
    status: status || 'pending',
    created_at: new Date().toISOString(),
  };
  db.affiliate_clicks.push(click);
  writeDB(db);
  return click;
}

// ── Suppliers ────────────────────────────────────────────────────────────────
export function getSuppliers() {
  return readDB().suppliers || [];
}

export function getSupplierById(id) {
  return (readDB().suppliers || []).find(s => s.id === id) || null;
}

export function getSupplierByUserId(userId) {
  return (readDB().suppliers || []).find(s => s.userId === userId) || null;
}

export function getSupplierByEmail(email) {
  return (readDB().suppliers || []).find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createSupplier(data) {
  const db = readDB();
  if (!db.suppliers) db.suppliers = [];
  const supplier = {
    id: 'sup_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    userId: null,
    companyName: data.companyName,
    contactName: data.contactName,
    email: data.email.toLowerCase(),
    phone: data.phone || '',
    description: data.description || '',
    instagram: data.instagram || '',
    website: data.website || '',
    passwordHash: data.passwordHash || '',
    commissionRate: 15,
    status: 'pending',
    pendingEarnings: 0,
    paidEarnings: 0,
    totalSales: 0,
    productCount: 0,
    agreementAccepted: false,
    agreementTimestamp: null,
    agreementVersion: null,
    createdAt: new Date().toISOString(),
    approvedAt: null,
  };
  db.suppliers.push(supplier);
  writeDB(db);
  return supplier;
}

export function updateSupplier(id, updates) {
  const db = readDB();
  if (!db.suppliers) return null;
  const idx = db.suppliers.findIndex(s => s.id === id);
  if (idx === -1) return null;
  const allowed = ['companyName', 'contactName', 'phone', 'description', 'instagram', 'website', 'commissionRate', 'status', 'userId', 'pendingEarnings', 'paidEarnings', 'totalSales', 'productCount', 'approvedAt', 'agreementAccepted', 'agreementTimestamp', 'agreementVersion'];
  for (const key of allowed) {
    if (updates[key] !== undefined) db.suppliers[idx][key] = updates[key];
  }
  db.suppliers[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.suppliers[idx];
}

export function updateSupplierStatus(id, status) {
  const db = readDB();
  if (!db.suppliers) return null;
  const idx = db.suppliers.findIndex(s => s.id === id);
  if (idx === -1) return null;
  db.suppliers[idx].status = status;
  if (status === 'approved') db.suppliers[idx].approvedAt = new Date().toISOString();
  db.suppliers[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.suppliers[idx];
}

export function addSupplierEarnings(supplierId, amount) {
  const db = readDB();
  if (!db.suppliers) return null;
  const idx = db.suppliers.findIndex(s => s.id === supplierId);
  if (idx === -1) return null;
  db.suppliers[idx].pendingEarnings = (db.suppliers[idx].pendingEarnings || 0) + amount;
  db.suppliers[idx].totalSales = (db.suppliers[idx].totalSales || 0) + 1;
  writeDB(db);
  return db.suppliers[idx];
}

export function markSupplierPaid(id) {
  const db = readDB();
  if (!db.suppliers) return null;
  const idx = db.suppliers.findIndex(s => s.id === id);
  if (idx === -1) return null;
  const pending = db.suppliers[idx].pendingEarnings || 0;
  db.suppliers[idx].paidEarnings = (db.suppliers[idx].paidEarnings || 0) + pending;
  db.suppliers[idx].pendingEarnings = 0;
  db.suppliers[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.suppliers[idx];
}

export function getProductsByVendor(vendorId) {
  return readDB().products.filter(p => p.vendorId === vendorId);
}

export function getOrdersByVendor(vendorId) {
  return (readDB().orders || []).filter(o => o.vendorId === vendorId);
}

// ── Agreement Logs ───────────────────────────────────────────────────────────

export function logAgreementAcceptance({ supplierId, timestamp, ip, agreementVersion, userAgent }) {
  const db = readDB();
  if (!db.agreementLogs) db.agreementLogs = [];
  const entry = {
    id: 'agr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    supplierId,
    timestamp,
    ip,
    agreementVersion,
    userAgent: userAgent || '',
    createdAt: new Date().toISOString(),
  };
  db.agreementLogs.push(entry);
  writeDB(db);
  return entry;
}

export function getAgreementLogsBySupplier(supplierId) {
  return (readDB().agreementLogs || []).filter(a => a.supplierId === supplierId);
}

// ── Takedown Logs ────────────────────────────────────────────────────────────

export function getTakedownLogs() {
  return readDB().takedownLogs || [];
}

export function createTakedownLog({ productId, vendorId, reason, initiatedBy, noticeDetails }) {
  const db = readDB();
  if (!db.takedownLogs) db.takedownLogs = [];
  const entry = {
    id: 'td_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    productId,
    vendorId,
    reason,
    initiatedBy,
    noticeDetails: noticeDetails || '',
    status: 'notice_received',
    timeline: [
      { step: 'notice_received', at: new Date().toISOString(), by: initiatedBy },
    ],
    createdAt: new Date().toISOString(),
  };
  db.takedownLogs.push(entry);
  writeDB(db);
  return entry;
}

export function updateTakedownLog(id, step, by, note) {
  const db = readDB();
  if (!db.takedownLogs) return null;
  const idx = db.takedownLogs.findIndex(t => t.id === id);
  if (idx === -1) return null;
  db.takedownLogs[idx].status = step;
  db.takedownLogs[idx].timeline.push({ step, at: new Date().toISOString(), by, note: note || '' });
  db.takedownLogs[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.takedownLogs[idx];
}

// ── DB File Permissions (enforce on startup) ─────────────────────────────────
import { chmodSync } from 'fs';
try {
  if (existsSync(DB_PATH)) chmodSync(DB_PATH, 0o600); // owner read/write only
} catch (_) { /* Windows or permission denied — non-fatal */ }
