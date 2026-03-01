import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');

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
  } catch (err) {
    console.error('[DB] Write failed:', err.message);
    throw new Error('Database write failed');
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
  // Clean up related data
  if (db.wishlists) db.wishlists = db.wishlists.filter(w => w.userId !== id);
  if (db.returnRequests) db.returnRequests = db.returnRequests.filter(r => r.userId !== id);
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
  const allowed = ['name', 'email', 'phone', 'password', 'emailVerified'];
  for (const key of allowed) {
    if (updates[key] !== undefined) db.users[idx][key] = updates[key];
  }
  db.users[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  return db.users[idx];
}

// ── Password Reset Tokens ────────────────────────────────────────────────────
const resetTokens = new Map(); // token -> { userId, expiresAt }

export function storeResetToken(token, userId) {
  resetTokens.set(token, { userId, expiresAt: Date.now() + 60 * 60 * 1000 }); // 1 hour
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
  // Don't duplicate same email+product
  const exists = db.stockNotifications.find(
    n => n.email === email.toLowerCase() && String(n.productId) === String(productId)
  );
  if (exists) return null;
  const entry = { productId, email: email.toLowerCase(), createdAt: new Date().toISOString(), notified: false };
  db.stockNotifications.push(entry);
  writeDB(db);
  return entry;
}

// ── Refresh tokens ────────────────────────────────────────────────────────────
const refreshTokens = new Set();

export function storeRefreshToken(token) { refreshTokens.add(token); }
export function hasRefreshToken(token) { return refreshTokens.has(token); }
export function removeRefreshToken(token) { refreshTokens.delete(token); }
export function removeAllRefreshTokensForUser(userId) {
  // In production, store tokens in DB with userId association
  // For now, this is a simplified in-memory store
}
