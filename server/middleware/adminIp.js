import { appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Optional IP allowlist for admin routes
// Set ADMIN_ALLOWED_IPS=1.2.3.4,5.6.7.8 in .env to restrict
const allowedIps = (process.env.ADMIN_ALLOWED_IPS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

export function adminIpCheck(req, res, next) {
  // If no IPs configured, allow all (dev-friendly default)
  if (allowedIps.length === 0) return next();

  const clientIp = req.ip || req.connection?.remoteAddress || '';
  // Normalize IPv6-mapped IPv4
  const normalized = clientIp.replace(/^::ffff:/, '');

  if (allowedIps.includes(normalized) || allowedIps.includes(clientIp)) {
    return next();
  }

  // Log blocked attempt
  const logLine = JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'admin_ip_blocked',
    ip: clientIp,
    path: req.path,
    method: req.method,
  }) + '\n';
  try { appendFileSync(join(__dirname, '..', 'logs', 'security.log'), logLine); } catch (_) {}

  return res.status(403).json({ error: 'Access denied' });
}
