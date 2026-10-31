export type LongDivisionStep =
  | { type: "text"; textId: string; args?: (string | number)[] }
  | { type: "equation"; dividend: number; divisor: number; result: string }
  | { type: "roundedValue"; value: string }
  | { type: "decimalResult"; value: string };

function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

function formatExactDecimal(dividend: number, divisor: number): string {
  const value = dividend / divisor;

  if (Number.isInteger(value)) {
    return value.toString();
  }

  const maxFractionDigits = 8;
  const fixed = value.toFixed(maxFractionDigits);
  const trimmed = fixed.replace(/\.?0+$/, "");

  if (trimmed.includes(".")) {
    const decimalPart = trimmed.split(".")[1] ?? "";
    if (decimalPart.length >= maxFractionDigits) {
      const withoutTrailingZeros = fixed.replace(/0+$/, "");
      return `${withoutTrailingZeros}…`;
    }
  }

  return trimmed;
}

function roundToDecimalPlaces(value: number, decimalPlaces: number): string {
  const factor = Math.pow(10, decimalPlaces);
  const rounded = Math.round(value * factor) / factor;
  return rounded.toFixed(decimalPlaces);
}

export function getLongDivisionSteps(
  dividend: number,
  divisor: number,
  decimalPlaces: number,
): {
  quotient: number;
  remainder: number;
  decimalResult: string;
  steps: LongDivisionStep[];
} {
  if (!isInteger(dividend) || !isInteger(divisor)) {
    throw new Error("無効な入力です");
  }
  if (divisor === 0) {
    throw new Error("無効な入力です");
  }
  if (!isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new Error("無効な入力です");
  }

  // Truncated division (quotient toward zero, remainder takes the sign of
  // the dividend): quotient * divisor + remainder === dividend always holds.
  // Wave 1B fix (M-01): Math.floor gave -7 / 2 -> q -4, r -1, which violates
  // the division identity (-4 * 2 + -1 = -9). Now -7 / 2 -> q -3, r -1.
  const quotient = Math.trunc(dividend / divisor);
  const remainder = dividend % divisor;
  const exactValue = dividend / divisor;
  const exactDecimal = formatExactDecimal(dividend, divisor);
  const decimalResult = roundToDecimalPlaces(exactValue, decimalPlaces);

  const steps: LongDivisionStep[] = [
    { type: "text", textId: "step1" },
    {
      type: "equation",
      dividend,
      divisor,
      result: exactDecimal,
    },
    { type: "text", textId: "step2", args: [decimalPlaces] },
    { type: "roundedValue", value: decimalResult },
    { type: "decimalResult", value: decimalResult },
  ];

  return {
    quotient,
    remainder,
    decimalResult,
    steps,
  };
}

// ---------------------------------------------------------------------------
// Full long-division (筆算) engine — added 2026-10-31 (calculator #6 upgrade).
// Generates the real digit-by-digit working: every subtraction row of the
// classic layout, the integer quotient/remainder, and the decimal expansion
// with repeating-cycle (循環小数) detection. Decimal inputs are scaled to
// integers first — the same method taught in school (12.5 ÷ 2.5 → 125 ÷ 25).
// ---------------------------------------------------------------------------

export type LongDivisionRow = {
  /** Working number at this step, in scaled-integer space (e.g. 53 for 1234÷7). */
  partialDividend: number;
  /** Quotient digit placed at this step (0–9). */
  quotientDigit: number;
  /** quotientDigit × scaledDivisor. */
  product: number;
  /** partialDividend − product. */
  remainderAfter: number;
  /** Grid column (0-based) where this step's numbers end. Integer steps end on
   *  the consumed dividend digit; decimal steps continue past the dividend. */
  endColumn: number;
  /** True when this step belongs to the decimal part of the quotient. */
  isDecimalStep: boolean;
};

export type LongDivisionComputation = {
  /** Absolute integer actually used for the layout (after scaling). */
  scaledDividend: number;
  scaledDivisor: number;
  /** Decimal places the inputs were shifted by (10^scale). */
  scale: number;
  rows: LongDivisionRow[];
  /** Signed integer quotient (truncated division), as a string. */
  quotientInteger: string;
  /** Signed remainder in ORIGINAL units, as a clean decimal string. */
  remainder: string;
  /** Decimal digits actually computed ("" when the quotient is an integer). */
  decimalDigits: string;
  /** True when the decimal expansion ends exactly. */
  terminates: boolean;
  /** Index into decimalDigits where the repeating cycle starts, or null. */
  cycleStart: number | null;
  /** Full decimal value with cycle notation, e.g. "176.(285714)" or "6.25". */
  decimalDisplay: string;
  /** Value rounded to the requested decimal places, trailing zeros trimmed. */
  roundedDecimal: string;
};

function decimalsOf(value: number): number {
  const s = String(Math.abs(value));
  if (s.includes("e") || s.includes("E")) {
    throw new Error("無効な入力です");
  }
  return (s.split(".")[1] ?? "").length;
}

/** Format an integer that lives in scaled space (value × 10^scale) as a clean decimal string. */
function formatScaledInt(scaled: number, scale: number): string {
  if (scale === 0) return String(scaled);
  const s = String(scaled).padStart(scale + 1, "0");
  const intPart = s.slice(0, -scale);
  const fracPart = s.slice(-scale).replace(/0+$/, "");
  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

export function computeLongDivision(
  dividend: number,
  divisor: number,
  decimalPlaces: number,
): LongDivisionComputation {
  if (!Number.isFinite(dividend) || !Number.isFinite(divisor) || divisor === 0) {
    throw new Error("無効な入力です");
  }
  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0 || decimalPlaces > 15) {
    throw new Error("無効な入力です");
  }

  const quotientSign: 1 | -1 = (dividend < 0) !== (divisor < 0) ? -1 : 1;
  const dividendSign: 1 | -1 = dividend < 0 ? -1 : 1;

  const scale = Math.max(decimalsOf(dividend), decimalsOf(divisor));
  const factor = Math.pow(10, scale);
  const A = Math.round(Math.abs(dividend) * factor);
  const B = Math.round(Math.abs(divisor) * factor);
  if (!Number.isSafeInteger(A) || !Number.isSafeInteger(B) || B === 0) {
    throw new Error("無効な入力です");
  }

  const digitsA = String(A).split("").map(Number);
  const n = digitsA.length;
  const rows: LongDivisionRow[] = [];
  const intQuotientDigits: number[] = [];

  let working = 0;
  let started = false;
  for (let i = 0; i < n; i++) {
    working = working * 10 + digitsA[i];
    if (working >= B || started) {
      const qd = Math.floor(working / B);
      const product = qd * B;
      const rem = working - product;
      rows.push({
        partialDividend: working,
        quotientDigit: qd,
        product,
        remainderAfter: rem,
        endColumn: i,
        isDecimalStep: false,
      });
      intQuotientDigits.push(qd);
      working = rem;
      started = true;
    }
  }

  const integerRemainder = working;

  // Decimal expansion with cycle detection: a repeated remainder means the
  // digits from that remainder's first appearance repeat forever.
  const decDigits: number[] = [];
  let terminates = integerRemainder === 0;
  let cycleStart: number | null = null;
  if (!terminates && decimalPlaces > 0) {
    const seen = new Map<number, number>();
    for (let j = 0; j < decimalPlaces; j++) {
      if (working === 0) {
        terminates = true;
        break;
      }
      const prev = seen.get(working);
      if (prev !== undefined) {
        cycleStart = prev;
        break;
      }
      seen.set(working, j);
      const partial = working * 10;
      const qd = Math.floor(partial / B);
      const product = qd * B;
      const rem = partial - product;
      rows.push({
        partialDividend: partial,
        quotientDigit: qd,
        product,
        remainderAfter: rem,
        endColumn: n + j,
        isDecimalStep: true,
      });
      decDigits.push(qd);
      working = rem;
    }
    if (!terminates && cycleStart === null && working !== 0) {
      const prev = seen.get(working);
      if (prev !== undefined) cycleStart = prev;
    }
    if (working === 0) terminates = true;
  }

  const decimalDigits = decDigits.join("");
  const intPart = intQuotientDigits.length ? intQuotientDigits.join("") : "0";
  const signPrefix = quotientSign < 0 && (intPart !== "0" || decimalDigits !== "") ? "-" : "";

  let decimalDisplay = signPrefix + intPart;
  if (decimalDigits) {
    const frac =
      cycleStart !== null
        ? `${decimalDigits.slice(0, cycleStart)}(${decimalDigits.slice(cycleStart)})`
        : decimalDigits;
    decimalDisplay += `.${frac}`;
  }

  const exactValue = dividend / divisor;
  const roundedRaw = roundToDecimalPlaces(exactValue, decimalPlaces);
  const roundedDecimal = roundedRaw.includes(".")
    ? roundedRaw.replace(/\.?0+$/, "")
    : roundedRaw;

  return {
    scaledDividend: A,
    scaledDivisor: B,
    scale,
    rows,
    quotientInteger:
      intPart === "0" ? "0" : (quotientSign < 0 ? "-" : "") + intPart.replace(/^0+(?=\d)/, ""),
    remainder:
      integerRemainder === 0
        ? "0"
        : (dividendSign < 0 ? "-" : "") + formatScaledInt(integerRemainder, scale),
    decimalDigits,
    terminates,
    cycleStart,
    decimalDisplay,
    roundedDecimal,
  };
}
