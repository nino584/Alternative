/**
 * Sanitize a value for safe CSV export.
 *
 * Prevents CSV formula injection by prefixing dangerous leading characters
 * (=, +, -, @, tab, carriage return) with a single quote.  The value is
 * always double-quoted and internal double-quotes are escaped per RFC 4180.
 */
export function csvSafe(val) {
  let s = String(val ?? '').replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s + '"';
}
