/**
 * Utility to extract uppercase avatar initials from a full name.
 * e.g.:
 *  "Shivharsh Rai" -> "SR"
 *  "John Doe" -> "JD"
 *  "Elon" -> "EL"
 *  "A" -> "A"
 *  "" / undefined -> fallback (default "EV")
 */
export function getUserInitials(name?: string | null, fallback = 'EV'): string {
  if (!name || typeof name !== 'string') return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) {
    const single = parts[0];
    return single.length >= 2 ? single.slice(0, 2).toUpperCase() : single.toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
