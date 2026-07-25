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

export function applyUnary(
  value: number,
  fn: string,
  mode: AngleMode
): number {
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
      const replacement = String(applyUnary(innerVal, fn, mode));
      return expr.slice(0, i) + replacement + expr.slice(j);
    }
  }
  return null;
}

export function evaluateScientific(
  expression: string,
  mode: AngleMode
): number {
  let expr = expression;

  while (true) {
    const next = replaceInnermostFn(expr, mode);
    if (!next) break;
    expr = next;
  }

  expr = expr.replace(/(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)!/g, (_, n: string) =>
    String(factorial(Number(n)))
  );

  return evaluateExpression(expr);
}
