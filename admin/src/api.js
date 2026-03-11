const API = '/api';

function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function buildHeaders(options) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const method = (options.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }
  return headers;
}

// Global session-expired handler — set by App.jsx
let onSessionExpired = null;
export function setSessionExpiredHandler(fn) { onSessionExpired = fn; }

// Mutex to prevent concurrent token refresh calls
let refreshPromise = null;
async function refreshToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetch(API + '/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRF-Token': getCsrfToken() },
  })
    .then(r => { if (!r.ok) throw new Error(); return r; })
    .finally(() => { refreshPromise = null; });
  return refreshPromise;
}

async function request(path, options = {}) {
  const { headers: optHeaders, credentials: optCredentials, ...restOptions } = options;
  const headers = buildHeaders(options);
  const res = await fetch(`${API}${path}`, {
    ...restOptions,
    credentials: 'include',
    headers,
  });

  // Auto-refresh on 401 with TOKEN_EXPIRED
  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (body.code === 'TOKEN_EXPIRED') {
      try {
        await refreshToken();
      } catch {
        if (onSessionExpired && !path.includes('/auth/login')) onSessionExpired();
        throw { status: 401, message: body.error || 'Unauthorized' };
      }
      const retryHeaders = buildHeaders(options);
      const retryRes = await fetch(`${API}${path}`, {
        ...restOptions,
        credentials: 'include',
        headers: retryHeaders,
      });
      if (!retryRes.ok) {
        const retryBody = await retryRes.json().catch(() => ({ error: 'Request failed' }));
        throw { status: retryRes.status, message: retryBody.error, details: retryBody.details };
      }
      return retryRes.json();
    }
    // Session is truly dead — force re-login
    if (onSessionExpired && !path.includes('/auth/login')) onSessionExpired();
    throw { status: 401, message: body.error || 'Unauthorized' };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw { status: res.status, message: body.error, details: body.details };
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),

  me: () =>
    request('/auth/me'),

  // Admin: Products
  getProducts: () =>
    request('/products'),

  createProduct: (data) =>
    request('/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id, data) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  // Admin: Orders
  getOrders: () =>
    request('/admin/orders'),

  updateOrderStatus: (orderId, status) =>
    request(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  sendMessage: (orderId, content, media) =>
    request('/admin/messages', { method: 'POST', body: JSON.stringify({ orderId, content, media }) }),

  getMessages: (orderId) =>
    request(`/admin/messages/${encodeURIComponent(orderId)}`),

  // Admin: Customers
  getCustomers: () =>
    request('/admin/customers'),

  // Admin: Subscribers
  getSubscribers: () =>
    request('/admin/subscribers'),

  // Admin: Promo Codes
  getPromos: () =>
    request('/admin/promos'),

  createPromo: (data) =>
    request('/admin/promos', { method: 'POST', body: JSON.stringify(data) }),

  updatePromo: (code, data) =>
    request(`/admin/promos/${encodeURIComponent(code)}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deletePromo: (code) =>
    request(`/admin/promos/${encodeURIComponent(code)}`, { method: 'DELETE' }),

  // Admin: Return Requests
  getReturns: () =>
    request('/admin/returns'),

  updateReturn: (id, data) =>
    request(`/admin/returns/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Admin: Stock Notifications
  getStockNotifications: () =>
    request('/admin/stock-notifications'),

  // Admin: Affiliates
  getAffiliates: () =>
    request('/affiliates/admin/list'),
  updateAffiliateStatus: (id, status) =>
    request(`/affiliates/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  payoutAffiliate: (id) =>
    request(`/affiliates/admin/${id}/payout`, { method: 'POST' }),

  // Admin: Suppliers
  getSuppliers: () =>
    request('/suppliers/admin/list'),
  updateSupplierStatus: (id, status) =>
    request(`/suppliers/admin/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateSupplierCommission: (id, commissionRate) =>
    request(`/suppliers/admin/${id}/commission`, { method: 'PATCH', body: JSON.stringify({ commissionRate }) }),
  payoutSupplier: (id) =>
    request(`/suppliers/admin/${id}/payout`, { method: 'POST' }),
  approveProduct: (id, productStatus) =>
    request(`/suppliers/admin/products/${id}/approval`, { method: 'PATCH', body: JSON.stringify({ productStatus }) }),
  getSupplierProducts: (id) =>
    request(`/suppliers/admin/${id}/products`),

  // Supplier self-service
  getSupplierProfile: () =>
    request('/suppliers/me'),
  updateSupplierProfile: (data) =>
    request('/suppliers/me', { method: 'PUT', body: JSON.stringify(data) }),
  getMyProducts: () =>
    request('/suppliers/me/products'),
  createMyProduct: (data) =>
    request('/suppliers/me/products', { method: 'POST', body: JSON.stringify(data) }),
  updateMyProduct: (id, data) =>
    request(`/suppliers/me/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMyProduct: (id) =>
    request(`/suppliers/me/products/${id}`, { method: 'DELETE' }),
  getMyOrders: () =>
    request('/suppliers/me/orders'),
  getMyStats: () =>
    request('/suppliers/me/stats'),

  // Supplier agreement
  acceptAgreement: (data) =>
    request('/suppliers/me/agreement', { method: 'POST', body: JSON.stringify(data) }),

  // Invite: set password via token
  setupPassword: (token, password) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

  // Admin: Takedowns
  initiateTakedown: (data) =>
    request('/suppliers/admin/takedown', { method: 'POST', body: JSON.stringify(data) }),
  updateTakedown: (id, data) =>
    request(`/suppliers/admin/takedown/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getTakedowns: () =>
    request('/suppliers/admin/takedowns'),

  // Settings (localStorage placeholder)
  getSettings: () => {
    try {
      const s = localStorage.getItem('alt_admin_settings');
      return Promise.resolve(s ? JSON.parse(s) : null);
    } catch { return Promise.resolve(null); }
  },
  saveSettings: (data) => {
    try {
      localStorage.setItem('alt_admin_settings', JSON.stringify(data));
      return Promise.resolve({ ok: true });
    } catch { return Promise.reject({ message: 'Failed to save' }); }
  },
};
