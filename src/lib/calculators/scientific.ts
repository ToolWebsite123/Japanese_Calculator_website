import { evaluateExpression } from "./standard";

export type AngleMode = "deg" | "rad";

function toRadians(value: number, mode: AngleMode): number {
  return mode === "deg" ? (value * Math.PI) / 180 : value;
}

function fromRadians(value: number, mode: AngleMode): number {
  return mode === "deg" ? (value * 180) / Math.PI : value;
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error("階乗の値が無効です");
  if (n > 170) throw new Error("オーバーフローです");
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export type PrimeFactor = { prime: number; exponent: number };

export function primeFactorize(n: number): PrimeFactor[] {
  if (!Number.isInteger(n) || n <= 1 || Math.abs(n) > 1e12) {
    throw new Error("素因数分解は1より大きく10¹²以下の整数で実行してください");
  }

  let num = Math.abs(n);
  const factors: PrimeFactor[] = [];

  for (let d = 2; d * d <= num; d += d === 2 ? 1 : 2) {
    if (num % d === 0) {
      let count = 0;
      while (num % d === 0) {
        count++;
        num /= d;
      }
      factors.push({ prime: d, exponent: count });
    }
  }

  if (num > 1) {
    factors.push({ prime: num, exponent: 1 });
  }

  return factors;
}

export function formatPrimeFactors(factors: PrimeFactor[]): string {
  if (factors.length === 0) return "";
  const superscripts: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  const toSuperscript = (num: number) =>
    String(num)
      .split("")
      .map((ch) => superscripts[ch] ?? ch)
      .join("");

  return factors
    .map(({ prime, exponent }) =>
      exponent === 1 ? String(prime) : `${prime}${toSuperscript(exponent)}`,
    )
    .join(" × ");
}

export function detectRepeatingDecimal(numerator: number, denominator: number): string | null {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
    return null;
  }

  const sign = numerator < 0 !== denominator < 0 ? "-" : "";
  let n = Math.abs(numerator);
  const d = Math.abs(denominator);

  const integerPart = Math.floor(n / d);
  n = n % d;

  if (n === 0) return null;

  const remainders = new Map<number, number>();
  const digits: number[] = [];

  while (n !== 0) {
    if (remainders.has(n)) {
      const repeatStart = remainders.get(n)!;
      const nonRepeat = digits.slice(0, repeatStart).join("");
      const repeat = digits.slice(repeatStart).join("");
      return `${sign}${integerPart}.${nonRepeat}(${repeat})`;
    }

    remainders.set(n, digits.length);
    n *= 10;
    digits.push(Math.floor(n / d));
    n = n % d;

    if (digits.length > 100) return null;
  }

  return null;
}

export function applyUnary(value: number, fn: string, mode: AngleMode): number {
  switch (fn) {
    case "sin":
      return Math.sin(toRadians(value, mode));
    case "cos":
      return Math.cos(toRadians(value, mode));
    case "tan":
      return Math.tan(toRadians(value, mode));
    case "asin":
      if (value < -1 || value > 1) throw new Error("asinの値が無効です");
      return fromRadians(Math.asin(value), mode);
    case "acos":
      if (value < -1 || value > 1) throw new Error("acosの値が無効です");
      return fromRadians(Math.acos(value), mode);
    case "atan":
      return fromRadians(Math.atan(value), mode);
    case "log":
      if (value <= 0) throw new Error("対数の値が無効です");
      return Math.log10(value);
    case "ln":
      if (value <= 0) throw new Error("自然対数の値が無効です");
      return Math.log(value);
    case "sqrt":
      if (value < 0) throw new Error("平方根の値が無効です");
      return Math.sqrt(value);
    case "square":
      return value * value;
    case "inv":
      if (value === 0) throw new Error("0で割ることはできません");
      return 1 / value;
    case "fact":
      return factorial(value);
    case "exp":
      return Math.exp(value);
    case "pow10":
      return Math.pow(10, value);
    case "sinh":
      return Math.sinh(value);
    case "cosh":
      return Math.cosh(value);
    case "tanh":
      return Math.tanh(value);
    case "asinh":
      return Math.asinh(value);
    case "acosh":
      if (value < 1) throw new Error("acoshの定義域外です");
      return Math.acosh(value);
    case "atanh":
      if (value <= -1 || value >= 1) throw new Error("atanhの定義域外です");
      return Math.atanh(value);
    case "cbrt":
      return Math.cbrt(value);
    case "cube":
      return Math.pow(value, 3);
    case "abs":
      return Math.abs(value);
    case "neg":
      return -value;
    default:
      throw new Error("不明な関数です");
  }
}

const FN_NAMES = [
  "asinh",
  "acosh",
  "atanh",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "sin",
  "cos",
  "tan",
  "sqrt",
  "square",
  "pow10",
  "fact",
  "cube",
  "cbrt",
  "log",
  "ln",
  "abs",
  "inv",
  "exp",
] as const;

function replaceInnermostFn(expr: string, mode: AngleMode): string | null {
  for (let i = 0; i < expr.length; i++) {
    for (const fn of FN_NAMES) {
      const marker = `${fn}(`;
      if (!expr.startsWith(marker, i)) continue;

      const argStart = i + marker.length;
      let depth = 1;
      let j = argStart;
      while (j < expr.length && depth > 0) {
        if (expr[j] === "(") depth++;
        else if (expr[j] === ")") depth--;
        j++;
      }
      if (depth !== 0) continue;

      const inner = expr.slice(argStart, j - 1);
      const hasNestedFn = FN_NAMES.some((name) => inner.includes(`${name}(`));
      if (hasNestedFn) continue;

      const innerVal = evaluateScientific(inner, mode);
      const numVal = typeof innerVal === "number" ? innerVal : innerVal.re;
      const replacement = String(applyUnary(numVal, fn, mode));
      return expr.slice(0, i) + replacement + expr.slice(j);
    }
  }
  return null;
}

export type Complex = { re: number; im: number };

export function formatComplex(z: Complex): string {
  const re = Math.abs(z.re) < 1e-12 ? 0 : z.re;
  const im = Math.abs(z.im) < 1e-12 ? 0 : z.im;

  if (im === 0) return String(re);
  if (re === 0) {
    if (im === 1) return "i";
    if (im === -1) return "-i";
    return `${im}i`;
  }
  const sign = im > 0 ? "+" : "-";
  const absIm = Math.abs(im);
  const imStr = absIm === 1 ? "i" : `${absIm}i`;
  return `${re} ${sign} ${imStr}`;
}

export function evaluateComplexExpression(expression: string, mode: AngleMode): Complex {
  let expr = expression.replace(/(\d+(?:\.\d+)?)\s*i/g, "$1*i").replace(/\bi\b/g, "(0+1i)");

  expr = expr.replace(/real\(([^()]+)\)/g, (_, zStr: string) => {
    const z = evaluateComplexExpression(zStr, mode);
    return String(z.re);
  });

  expr = expr.replace(/imag\(([^()]+)\)/g, (_, zStr: string) => {
    const z = evaluateComplexExpression(zStr, mode);
    return String(z.im);
  });

  expr = expr.replace(/conj\(([^()]+)\)/g, (_, zStr: string) => {
    const z = evaluateComplexExpression(zStr, mode);
    return formatComplex({ re: z.re, im: -z.im });
  });

  expr = expr.replace(/arg\(([^()]+)\)/g, (_, zStr: string) => {
    const z = evaluateComplexExpression(zStr, mode);
    return String(Math.atan2(z.im, z.re));
  });

  if (!expr.includes("i")) {
    const val = evaluateScientific(expr, mode);
    return { re: typeof val === "number" ? val : val.re, im: typeof val === "number" ? 0 : val.im };
  }

  const match = expr.match(
    /^\s*\(\s*(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)i\s*\)\s*([*+/])\s*\(\s*(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)i\s*\)\s*$/,
  );
  if (match) {
    const a1 = parseFloat(match[1]);
    const b1 = (match[2] === "-" ? -1 : 1) * parseFloat(match[3]);
    const op = match[4];
    const a2 = parseFloat(match[5]);
    const b2 = (match[6] === "-" ? -1 : 1) * parseFloat(match[7]);

    if (op === "*") {
      return { re: a1 * a2 - b1 * b2, im: a1 * b2 + b1 * a2 };
    }
    if (op === "+") {
      return { re: a1 + a2, im: b1 + b2 };
    }
    if (op === "-") {
      return { re: a1 - a2, im: b1 - b2 };
    }
    if (op === "/") {
      const denom = a2 * a2 + b2 * b2;
      if (denom === 0) throw new Error("0で割ることはできません");
      return { re: (a1 * a2 + b1 * b2) / denom, im: (b1 * a2 - a1 * b2) / denom };
    }
  }

  const simpleMatch = expr.match(/^\s*(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)i\s*$/);
  if (simpleMatch) {
    const re = parseFloat(simpleMatch[1]);
    const im = (simpleMatch[2] === "-" ? -1 : 1) * parseFloat(simpleMatch[3]);
    return { re, im };
  }

  const pureImMatch = expr.match(/^\s*(-?\d+(?:\.\d+)?)i\s*$/);
  if (pureImMatch) {
    return { re: 0, im: parseFloat(pureImMatch[1]) };
  }

  const realVal = evaluateScientific(expr.replace(/\s*([+-])\s*\d+i/g, ""), mode);
  return { re: typeof realVal === "number" ? realVal : realVal.re, im: 0 };
}

export function evaluateScientific(
  expression: string,
  mode: AngleMode,
  complexMode = false,
): number | Complex {
  if (complexMode || /[i]/.test(expression) || /real|imag|conj|arg/.test(expression)) {
    return evaluateComplexExpression(expression, mode);
  }

  let expr = expression;

  while (true) {
    const next = replaceInnermostFn(expr, mode);
    if (!next) break;
    expr = next;
  }

  expr = expr.replace(/(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)!/g, (_, n: string) =>
    String(factorial(Number(n))),
  );

  return evaluateExpression(expr);
}
