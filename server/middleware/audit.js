import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, '..', 'logs');
if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });

const AUDIT_LOG = join(logsDir, 'audit.log');

export function auditLog(req, res, next) {
  // Only log state-changing requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  // Capture response to log after completion
  const startTime = Date.now();
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    const entry = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || null,
      adminId: req.user?.id || null,
      adminEmail: req.user?.email || null,
      method: req.method,
      path: req.path,
      params: req.params,
      ip: req.ip,
      statusCode: res.statusCode,
      durationMs: Date.now() - startTime,
    };

    try {
      appendFileSync(AUDIT_LOG, JSON.stringify(entry) + '\n');
    } catch (_) {}

    return originalJson(body);
  };

  next();
}
