/**
 * Formats a raw phone string into a clean, consistent display value.
 * Converts any extension pattern:
 *   "1-770-736-8031 x56442"        →  "1-770-736-8031 (ext. 56442)"
 *   "1-770-736-8031 {ext. 56442}"  →  "1-770-736-8031 (ext. 56442)"
 *
 * Any phone string without an extension is returned unchanged.
 *
 * @param {string} phone - Raw phone string
 * @returns {string} Formatted phone string
 */
export function formatPhone(phone) {
  if (!phone) return phone;
  // Replace trailing extension (e.g. x56442, ext 56442, {ext. 56442}, (ext. 56442)) with (ext. 56442)
  return phone.replace(/\s*[\{\(]?(?:x|ext\.?)\s*(\d+)[\}\)]?/gi, ' (ext. $1)').trim();
}
