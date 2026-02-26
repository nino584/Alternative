const API = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include', // send cookies
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  // Auto-refresh on 401 with TOKEN_EXPIRED
  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (body.code === 'TOKEN_EXPIRED') {
      const refreshRes = await fetch(`${API}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (refreshRes.ok) {
        // Retry original request with new token
        const retryRes = await fetch(`${API}${path}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...options.headers },
          ...options,
        });
        if (!retryRes.ok) {
          const retryBody = await retryRes.json().catch(() => ({ error: 'Request failed' }));
          throw { status: retryRes.status, message: retryBody.error, details: retryBody.details };
        }
        return retryRes.json();
      }
    }
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

  // Products (public)
  getProducts: () =>
    request('/products'),

  getProduct: (id) =>
    request(`/products/${id}`),

  // Products (admin)
  createProduct: (data) =>
    request('/products', { method: 'POST', body: JSON.stringify(data) }),

  updateProduct: (id, data) =>
    request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteProduct: (id) =>
    request(`/products/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: () =>
    request('/orders'),

  createOrder: (data) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),

  updateOrderStatus: (orderId, status) =>
    request(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
