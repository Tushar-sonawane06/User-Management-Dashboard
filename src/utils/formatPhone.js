/**
 * Formats a raw phone string from the API into a readable display value.
 * Converts the JSONPlaceholder extension format:
 *   "1-770-736-8031 x56442"  →  "1-770-736-8031 (ext. 56442)"
 *
 * Any phone string without an extension is returned unchanged.
 *
 * @param {string} phone - Raw phone string
 * @returns {string} Formatted phone string
 */
export function formatPhone(phone) {
  if (!phone) return phone;
  // Match trailing ` x<digits>` or ` ext<digits>` (case-insensitive)
  return phone.replace(/\s+x(\d+)$/i, ' (ext. $1)').trim();
}
