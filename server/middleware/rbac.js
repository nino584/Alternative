// Role-Based Access Control middleware
// Roles: admin (full access), supplier (own products/orders), support (read-only admin), user
// Usage: router.get('/admin/users', authenticate, requireRole('admin'), handler)
//        router.get('/admin/users', authenticate, requireRole('admin', 'support'), handler)

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
