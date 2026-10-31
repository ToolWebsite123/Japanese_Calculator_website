/**
 * Desk-calculator extras for the standard pad (Step A of the homepage
 * calculator programme): tax in/out conversion, square root.
 *
 * Tax conversion follows the price-display convention used by Japanese
 * desk calculators (e.g. DentakuWeb): the converted amount is rounded
 * half-up to a whole yen. Plain-number math with a 12-significant-digit
 * snap, the same pattern as the consumption-tax lib (1080 / 1.08 must
 * come back as exactly 1000, not 999.9999999999999).
 */

function snap(value: number): number {
  return Number(value.toPrecision(12));
}

function roundHalfUpToInteger(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value));
}

/** Convert a tax-excluded amount to tax-included, rounded to whole yen. */
export function taxIncluded(value: number, ratePercent: number): number {
  if (!Number.isFinite(value)) return value;
  return roundHalfUpToInteger(snap(value * (1 + ratePercent / 100)));
}

/** Convert a tax-included amount back to tax-excluded, rounded to whole yen. */
export function taxExcluded(value: number, ratePercent: number): number {
  if (!Number.isFinite(value)) return value;
  return roundHalfUpToInteger(snap(value / (1 + ratePercent / 100)));
}

/** Square root for the √ key. Returns null for negative input (error). */
export function sqrtValue(value: number): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  return snap(Math.sqrt(value));
}
