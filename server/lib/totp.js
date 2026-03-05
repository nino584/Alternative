// TOTP (Time-based One-Time Password) implementation — RFC 6238
// Uses Node.js crypto only — no external dependencies
import crypto from 'crypto';

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Generate a random 20-byte secret, base32-encoded
export function generateSecret() {
  const bytes = crypto.randomBytes(20);
  return base32Encode(bytes);
}

// Generate otpauth:// URI for QR code scanning
export function generateOtpauthUri(secret, email, issuer = 'Alternative') {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// Replay protection: track recently used codes per secret (key: secret+code, value: expiry timestamp)
const usedCodes = new Map();
// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, expiry] of usedCodes) {
    if (now > expiry) usedCodes.delete(key);
  }
}, 5 * 60 * 1000).unref();

// Verify a TOTP code (checks current window ±1 for clock skew)
export function verifyTotp(secret, code) {
  if (!code || typeof code !== 'string' || code.length !== 6 || !/^\d{6}$/.test(code)) {
    return false;
  }

  // Replay protection: reject if this exact code was already used for this secret
  const replayKey = `${secret}:${code}`;
  if (usedCodes.has(replayKey)) return false;

  const secretBytes = base32Decode(secret);
  const now = Math.floor(Date.now() / 1000);
  // Check current time step and ±1 for clock skew tolerance
  for (let offset = -1; offset <= 1; offset++) {
    const timeStep = Math.floor((now / 30) + offset);
    const generated = generateCode(secretBytes, timeStep);
    if (generated === code) {
      // Mark code as used for 90 seconds (covers the full ±1 window)
      usedCodes.set(replayKey, Date.now() + 90_000);
      return true;
    }
  }
  return false;
}

function generateCode(secretBytes, timeStep) {
  // Convert time step to 8-byte big-endian buffer
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(0, 0);
  timeBuffer.writeUInt32BE(timeStep, 4);

  // HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secretBytes);
  hmac.update(timeBuffer);
  const hash = hmac.digest();

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  // 6-digit code
  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

function base32Encode(buffer) {
  let result = '';
  let bits = 0;
  let value = 0;
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += BASE32_CHARS[(value >> bits) & 0x1f];
    }
  }
  if (bits > 0) {
    result += BASE32_CHARS[(value << (5 - bits)) & 0x1f];
  }
  return result;
}

function base32Decode(str) {
  const cleaned = str.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const bytes = [];
  let bits = 0;
  let value = 0;
  for (const char of cleaned) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }
  return Buffer.from(bytes);
}
