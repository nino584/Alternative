import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');

function readDB() {
  if (!existsSync(DB_PATH)) return { users: [], products: [], orders: [] };
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function findUserByEmail(email) {
  return readDB().users.find(u => u.email === email.toLowerCase()) || null;
}

export function findUserById(id) {
  return readDB().users.find(u => u.id === id) || null;
}

export function createUser({ id, name, email, phone, password, role }) {
  const db = readDB();
  const user = { id, name, email: email.toLowerCase(), phone: phone || "", password, role: role || "user", createdAt: new Date().toISOString() };
  db.users.push(user);
  writeDB(db);
  return user;
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
  db.orders.push({ ...order, createdAt: new Date().toISOString() });
  writeDB(db);
  return order;
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

// ── Refresh tokens ────────────────────────────────────────────────────────────
const refreshTokens = new Set();

export function storeRefreshToken(token) { refreshTokens.add(token); }
export function hasRefreshToken(token) { return refreshTokens.has(token); }
export function removeRefreshToken(token) { refreshTokens.delete(token); }
export function removeAllRefreshTokensForUser(userId) {
  // In production, store tokens in DB with userId association
  // For now, this is a simplified in-memory store
}
