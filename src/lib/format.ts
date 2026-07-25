/** Format a number as Japanese Yen (¥1,234,567). */
export function formatYen(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Math.round(value * Math.pow(10, fractionDigits)) / Math.pow(10, fractionDigits));
}

/** Format large amounts with 万 / 億 units (e.g. 1億2345万円). */
export function formatJapaneseUnits(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 100_000_000) {
    const oku = Math.floor(abs / 100_000_000);
    const man = Math.floor((abs % 100_000_000) / 10_000);
    if (man === 0) return `${sign}${oku}億円`;
    return `${sign}${oku}億${man.toLocaleString("ja-JP")}万円`;
  }

  if (abs >= 10_000) {
    const man = Math.floor(abs / 10_000);
    const rest = Math.floor(abs % 10_000);
    if (rest === 0) return `${sign}${man.toLocaleString("ja-JP")}万円`;
    return `${sign}${man.toLocaleString("ja-JP")}万${rest.toLocaleString("ja-JP")}円`;
  }

  return `${sign}${Math.floor(abs).toLocaleString("ja-JP")}円`;
}

export const CALCULATOR_ERROR_DISPLAY = "計算エラー";

/** Format a display number for calculator screens. */
export function formatDisplayNumber(value: number, maxDecimals = 10): string {
  if (!Number.isFinite(value)) return CALCULATOR_ERROR_DISPLAY;
  if (Object.is(value, -0)) return "0";

  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-8)) {
    return value.toExponential(6);
  }

  const rounded =
    Math.round(value * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  const str = String(rounded);
  if (str.includes("e") || str.includes("E")) return value.toPrecision(10);

  // Trim trailing zeros after decimal
  if (str.includes(".")) {
    return str.replace(/\.?0+$/, "");
  }
  return str;
}

export function formatPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

/** Parse a history/result string into a finite number for Ans recall. */
export function parseNumericResult(result: string): number | null {
  const cleaned = result.replace(/,/g, "").replace(/¥/g, "").trim();
  if (!cleaned || cleaned === "Error" || cleaned === CALCULATOR_ERROR_DISPLAY || cleaned === "—") return null;

  const direct = Number(cleaned);
  if (Number.isFinite(direct)) return direct;

  const match = cleaned.match(/^-?[\d.]+(?:[eE][+-]?\d+)?/);
  if (!match) return null;

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}
