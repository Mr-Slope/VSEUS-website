/** VSEUS was founded in 2014. Treated as 1 January for anniversary maths. */
export const FOUNDED_YEAR = 2014;

/**
 * Full years the society has been running.
 *
 * Founding is treated as 1 January, so subtracting years is exact — any date
 * in a given year is on or after that year's 1 January.
 *
 * Called from a client component so it evaluates in the visitor's browser and
 * rolls over on New Year's Day on its own. Computing it at build time would
 * bake in whatever year the last deploy happened in and quietly go stale.
 */
export function yearsRunning(now: Date = new Date()): number {
  return now.getFullYear() - FOUNDED_YEAR;
}

/**
 * Where the society is. The Iona Building — same address as the Economics
 * Learning Centre in IONA 038.
 */
export const ADDRESS = {
  street: '6000 Iona Dr',
  locality: 'Vancouver, BC V6T 1L4',
  full: '6000 Iona Dr, Vancouver, BC V6T 1L4',
} as const;

/** Opens the address in whichever maps app the visitor uses. No API key needed. */
export const ADDRESS_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS.full,
)}`;
