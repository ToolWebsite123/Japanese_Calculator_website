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
