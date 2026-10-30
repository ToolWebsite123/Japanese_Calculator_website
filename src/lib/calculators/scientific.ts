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

const COMPLEX_FN_NAMES = ["real", "imag", "conj", "arg"] as const;

/**
 * True when the expression uses the imaginary unit `i` as a value
 * (e.g. "3i+2", "(1+2i)*(3-i)"), NOT merely as a letter inside a
 * function name such as "sin" / "asin" / "sinh".
 *
 * Wave 1B root-cause fix (H-04): evaluateScientific previously routed
 * ANY expression containing the letter "i" to the complex path, so
 * "sin(90)" was sent here, fell through every pattern, and recursed
 * into itself forever (stack overflow -> 計算エラー on the live site).
 */
export function containsImaginaryUnit(expression: string): boolean {
  let rest = expression;
  const identifiers = [...FN_NAMES, ...COMPLEX_FN_NAMES, "mod", "nCr", "nPr", "gcd", "lcm"].sort(
    (a, b) => b.length - a.length,
  );
  for (const name of identifiers) {
    rest = rest.split(name).join(" ");
  }
  return /i/.test(rest);
}

function cAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}
function cSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}
function cMul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}
function cDiv(a: Complex, b: Complex): Complex {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) throw new Error("0で割ることはできません");
  return { re: (a.re * b.re + a.im * b.im) / denom, im: (a.im * b.re - a.re * b.im) / denom };
}
function cPow(base: Complex, exp: Complex): Complex {
  if (exp.im !== 0) {
    throw new Error("複素数の指数には対応していません");
  }
  const w = exp.re;
  if (base.im === 0) {
    return { re: Math.pow(base.re, w), im: 0 };
  }
  if (Number.isInteger(w)) {
    let result: Complex = { re: 1, im: 0 };
    let b = w < 0 ? cDiv({ re: 1, im: 0 }, base) : base;
    let n = Math.abs(w);
    while (n > 0) {
      if (n % 2 === 1) result = cMul(result, b);
      b = cMul(b, b);
      n = Math.floor(n / 2);
    }
    return result;
  }
  // Real exponent on a complex base: principal value via polar form.
  const r = Math.hypot(base.re, base.im);
  const theta = Math.atan2(base.im, base.re);
  const mag = Math.pow(r, w);
  const ang = theta * w;
  return { re: mag * Math.cos(ang), im: mag * Math.sin(ang) };
}

type ComplexToken =
  | { type: "num"; value: number }
  | { type: "i" }
  | { type: "op"; value: string }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "fn"; value: string };

function tokenizeComplex(input: string): ComplexToken[] {
  const tokens: ComplexToken[] = [];
  const s = input.replace(/\s+/g, "").replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      let num = "";
      while (i < s.length && ((s[i] >= "0" && s[i] <= "9") || s[i] === ".")) num += s[i++];
      if (i < s.length && (s[i] === "e" || s[i] === "E")) {
        // scientific notation only when digits follow (avoid eating a fn name)
        const m = s.slice(i).match(/^[eE][+-]?\d+/);
        if (m) {
          num += m[0];
          i += m[0].length;
        }
      }
      const value = parseFloat(num);
      if (!Number.isFinite(value)) throw new Error("複素数の式が正しくありません");
      tokens.push({ type: "num", value });
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    if ("+-*/^".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let name = "";
      while (i < s.length && /[a-zA-Z]/.test(s[i])) name += s[i++];
      if (name === "i") {
        tokens.push({ type: "i" });
      } else {
        tokens.push({ type: "fn", value: name });
      }
      continue;
    }
    throw new Error("複素数の式が正しくありません");
  }
  return tokens;
}

/**
 * Recursive-descent evaluator for complex expressions.
 * Supports + - * / ^, parentheses, implicit multiplication (3i, 2(1+i)),
 * real/imag/conj/arg, and the real functions of scientific.ts applied to
 * real arguments. Anything it cannot evaluate exactly throws a clear
 * Japanese error — it NEVER silently drops the imaginary part
 * (Wave 1B fix, H-05: previously "3i+2" returned 2).
 */
export function evaluateComplexExpression(expression: string, mode: AngleMode): Complex {
  const hasComplexFn = COMPLEX_FN_NAMES.some((name) => expression.includes(`${name}(`));
  if (!containsImaginaryUnit(expression) && !hasComplexFn) {
    const val = evaluateScientific(expression, mode);
    return typeof val === "number" ? { re: val, im: 0 } : val;
  }

  const tokens = tokenizeComplex(expression);
  let pos = 0;

  const peek = (): ComplexToken | undefined => tokens[pos];

  function parseExpression(): Complex {
    let left = parseTerm();
    while (true) {
      const tk = peek();
      if (tk?.type === "op" && (tk.value === "+" || tk.value === "-")) {
        pos++;
        const right = parseTerm();
        left = tk.value === "+" ? cAdd(left, right) : cSub(left, right);
      } else {
        return left;
      }
    }
  }

  function startsAtom(tk: ComplexToken | undefined): boolean {
    return tk?.type === "num" || tk?.type === "i" || tk?.type === "lparen" || tk?.type === "fn";
  }

  function parseTerm(): Complex {
    let left = parseFactor();
    while (true) {
      const tk = peek();
      if (tk?.type === "op" && (tk.value === "*" || tk.value === "/")) {
        pos++;
        const right = parseFactor();
        left = tk.value === "*" ? cMul(left, right) : cDiv(left, right);
      } else if (startsAtom(tk)) {
        // implicit multiplication: 3i, 2(1+i), (1+i)(2-i)
        const right = parseFactor();
        left = cMul(left, right);
      } else {
        return left;
      }
    }
  }

  function parseFactor(): Complex {
    const tk = peek();
    if (tk?.type === "op" && (tk.value === "-" || tk.value === "+")) {
      pos++;
      const v = parseFactor();
      return tk.value === "-" ? { re: -v.re, im: -v.im } : v;
    }
    return parsePower();
  }

  function parsePower(): Complex {
    const base = parseAtom();
    const tk = peek();
    if (tk?.type === "op" && tk.value === "^") {
      pos++;
      const exp = parseFactor();
      return cPow(base, exp);
    }
    return base;
  }

  function applyComplexFn(fn: string, arg: Complex): Complex {
    switch (fn) {
      case "real":
        return { re: arg.re, im: 0 };
      case "imag":
        return { re: arg.im, im: 0 };
      case "conj":
        return { re: arg.re, im: -arg.im };
      case "arg":
        return { re: Math.atan2(arg.im, arg.re), im: 0 };
      case "abs":
        return { re: Math.hypot(arg.re, arg.im), im: 0 };
      case "sqrt": {
        if (arg.im === 0) return { re: applyUnary(arg.re, fn, mode), im: 0 };
        const r = Math.hypot(arg.re, arg.im);
        const theta = Math.atan2(arg.im, arg.re) / 2;
        const mag = Math.sqrt(r);
        return { re: mag * Math.cos(theta), im: mag * Math.sin(theta) };
      }
      default: {
        if (arg.im !== 0) {
          throw new Error(`複素数に対する${fn}には対応していません`);
        }
        return { re: applyUnary(arg.re, fn, mode), im: 0 };
      }
    }
  }

  function parseAtom(): Complex {
    const tk = tokens[pos++];
    if (!tk) throw new Error("複素数の式が正しくありません");
    if (tk.type === "num") return { re: tk.value, im: 0 };
    if (tk.type === "i") return { re: 0, im: 1 };
    if (tk.type === "lparen") {
      const v = parseExpression();
      if (tokens[pos++]?.type !== "rparen") throw new Error("複素数の式が正しくありません");
      return v;
    }
    if (tk.type === "fn") {
      if (tokens[pos++]?.type !== "lparen") throw new Error("複素数の式が正しくありません");
      const arg = parseExpression();
      if (tokens[pos++]?.type !== "rparen") throw new Error("複素数の式が正しくありません");
      return applyComplexFn(tk.value, arg);
    }
    throw new Error("複素数の式が正しくありません");
  }

  const result = parseExpression();
  if (pos !== tokens.length) throw new Error("複素数の式が正しくありません");
  if (!Number.isFinite(result.re) || !Number.isFinite(result.im)) {
    throw new Error("計算結果が範囲外です");
  }
  return result;
}

export function evaluateScientific(
  expression: string,
  mode: AngleMode,
  complexMode = false,
): number | Complex {
  if (
    complexMode ||
    containsImaginaryUnit(expression) ||
    COMPLEX_FN_NAMES.some((name) => expression.includes(`${name}(`))
  ) {
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
