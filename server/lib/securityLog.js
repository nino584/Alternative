// Security event logger for critical auth & admin actions
import { appendFileSync, existsSync, mkdirSync, statSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, '..', 'logs');
if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });

const MAX_LOG_SIZE = 50 * 1024 * 1024; // 50 MB per log file

function rotateIfNeeded(logPath) {
  try {
    if (!existsSync(logPath)) return;
    const stats = statSync(logPath);
    if (stats.size >= MAX_LOG_SIZE) {
      const rotated = logPath + '.' + new Date().toISOString().replace(/[:.]/g, '-') + '.old';
      renameSync(logPath, rotated);
    }
  } catch (_) {}
}

function writeLog(filename, entry) {
  const logPath = join(logsDir, filename);
  rotateIfNeeded(logPath);
  const line = JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n';
  try { appendFileSync(logPath, line); } catch (_) {}
}

// Security events (login, registration, password change, account deletion, lockout, 2FA)
export function logSecurityEvent(event, details = {}) {
  writeLog('security-events.log', { event, ...details });
}

// Rotate existing log files too
export function rotateLog(filename) {
  const logPath = join(logsDir, filename);
  rotateIfNeeded(logPath);
}

// Events
export const SEC_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGIN_LOCKED: 'login_locked',
  REGISTER: 'register',
  LOGOUT: 'logout',
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  PASSWORD_RESET_COMPLETED: 'password_reset_completed',
  ACCOUNT_DELETED: 'account_deleted',
  ADMIN_LOGIN: 'admin_login',
  TWO_FA_ENABLED: '2fa_enabled',
  TWO_FA_DISABLED: '2fa_disabled',
  TWO_FA_FAILED: '2fa_failed',
  SOCIAL_LOGIN: 'social_login',
  TOKEN_REFRESH: 'token_refresh',
  SUSPICIOUS_UA_CHANGE: 'suspicious_ua_change',
};
