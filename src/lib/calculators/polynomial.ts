// Symbolic simplification of single-variable (x) expressions into a
// polynomial with exact fraction coefficients. Built on the algebra
// tokenizer/RPN: the expression is evaluated symbolically, where every
// value is a polynomial in x instead of a number. Supports + - * and
// division by a non-zero constant, plus integer powers. This powers the
// 式を整理・展開 mode: 同類項をまとめる, 分配法則, 展開.

import { AlgebraError, tokenizeAlgebra, toRpnAlgebra } from "./algebra";
import { simplify as simplifyFraction, type Fraction } from "./fraction";

type Poly = Fraction[]; // coeffs[i] = coefficient of x^i, trimmed

const ZERO: Fraction = { num: 0, den: 1 };
const ONE: Fraction = { num: 1, den: 1 };

function frac(num: number, den = 1): Fraction {
  return simplifyFraction(num, den);
}

function fAdd(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction(a.num * b.den + b.num * a.den, a.den * b.den);
}
function fNeg(a: Fraction): Fraction {
  return { num: -a.num, den: a.den };
}
function fSub(a: Fraction, b: Fraction): Fraction {
  return fAdd(a, fNeg(b));
}
function fMul(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction(a.num * b.num, a.den * b.den);
}
function fIsZero(a: Fraction): boolean {
  return a.num === 0;
}

function trim(p: Poly): Poly {
  const out = [...p];
  while (out.length > 0 && fIsZero(out[out.length - 1])) out.pop();
  return out;
}

function constPoly(f: Fraction): Poly {
  return fIsZero(f) ? [] : [f];
}

function polyAdd(a: Poly, b: Poly, sign: 1 | -1): Poly {
  const n = Math.max(a.length, b.length);
  const out: Poly = [];
  for (let i = 0; i < n; i++) {
    const av = a[i] ?? ZERO;
    const bv = b[i] ?? ZERO;
    out.push(sign === 1 ? fAdd(av, bv) : fSub(av, bv));
  }
  return trim(out);
}

function polyMul(a: Poly, b: Poly): Poly {
  if (a.length === 0 || b.length === 0) return [];
  const out: Poly = Array.from({ length: a.length + b.length - 1 }, () => ZERO);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      out[i + j] = fAdd(out[i + j], fMul(a[i], b[j]));
    }
  }
  return trim(out);
}

function polyDivByConst(a: Poly, divisor: Fraction): Poly {
  if (fIsZero(divisor)) throw new AlgebraError("0で割ることはできません");
  const inv = simplifyFraction(divisor.den, divisor.num);
  return trim(a.map((c) => fMul(c, inv)));
}

function polyPow(base: Poly, exp: number): Poly {
  let result: Poly = [ONE];
  for (let i = 0; i < exp; i++) result = polyMul(result, base);
  return result;
}

function termCount(p: Poly): number {
  return p.filter((c) => !fIsZero(c)).length;
}

/* ---------------- formatting ---------------- */

function coeffText(f: Fraction): string {
  const sign = f.num < 0 ? "-" : "";
  const abs = Math.abs(f.num);
  return f.den === 1 ? `${sign}${abs}` : `${sign}${abs}/${f.den}`;
}

function varPart(degree: number): string {
  if (degree === 0) return "";
  if (degree === 1) return "x";
  return `x^${degree}`;
}

/** One term without its sign: coefficient (omitted when 1 on x terms) + variable part. */
function termBody(f: Fraction, degree: number): string {
  const abs: Fraction = { num: Math.abs(f.num), den: f.den };
  if (degree === 0) return coeffText(abs);
  if (abs.num === 1 && abs.den === 1) return varPart(degree);
  return `${coeffText(abs)}${varPart(degree)}`;
}

function joinTerms(terms: { coeff: Fraction; degree: number }[]): string {
  const shown = terms.filter((t) => !fIsZero(t.coeff));
  if (shown.length === 0) return "0";
  return shown
    .map((t, i) => {
      const body = termBody(t.coeff, t.degree);
      if (i === 0) return (t.coeff.num < 0 ? "-" : "") + body;
      return (t.coeff.num < 0 ? " - " : " + ") + body;
    })
    .join("");
}

export function formatPolynomial(p: Poly): string {
  const terms: { coeff: Fraction; degree: number }[] = [];
  for (let d = p.length - 1; d >= 0; d--) {
    if (p[d] && !fIsZero(p[d])) terms.push({ coeff: p[d], degree: d });
  }
  return joinTerms(terms);
}

/** Pairwise products of a multiplication, highest degree first, uncombined. */
function expansionTerms(a: Poly, b: Poly): { coeff: Fraction; degree: number }[] {
  const products: { coeff: Fraction; degree: number }[] = [];
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (fIsZero(a[i]) || fIsZero(b[j])) continue;
      products.push({ coeff: fMul(a[i], b[j]), degree: i + j });
    }
  }
  // Order by degree descending, keeping generation order within a degree.
  return products
    .map((t, idx) => ({ ...t, idx }))
    .sort((x, y) => y.degree - x.degree || x.idx - y.idx)
    .map(({ coeff, degree }) => ({ coeff, degree }));
}

/* ---------------- main entry ---------------- */

export type SimplifyResult = {
  /** Simplified polynomial, coefficients ascending. */
  polynomial: Poly;
  /** Formatted answer, e.g. "x^2 + 5x + 6". */
  result: string;
  /** Expansion lines recorded at each non-trivial multiplication, in order. */
  expansionSteps: string[];
};

type EvalOutcome = { polynomial: Poly; expansionSteps: string[] };

function evalSymbolic(expr: string, recordSteps: boolean): EvalOutcome {
  const normalized = expr
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");
  if (!normalized) throw new AlgebraError("式を入力してください");

  const rpn = toRpnAlgebra(tokenizeAlgebra(normalized));
  const expansionSteps: string[] = [];
  const stack: Poly[] = [];

  const pop = (): Poly => {
    const v = stack.pop();
    if (v === undefined) throw new AlgebraError("式が不正です");
    return v;
  };

  for (const t of rpn) {
    if (t.type === "num") {
      if (!Number.isFinite(t.value)) throw new AlgebraError("数値の形式が正しくありません");
      // Numeric constants enter as decimal fractions via their string form
      // is overkill; values here are exact for school-level decimals whose
      // binary form terminates the fraction conversion below.
      stack.push(constPoly(decimalToFrac(t.value)));
    } else if (t.type === "x") {
      stack.push([ZERO, ONE]);
    } else if (t.type === "op") {
      if (t.value === "u-") {
        const a = pop();
        stack.push(a.map((c) => fNeg(c)));
        continue;
      }
      const b = pop();
      const a = pop();
      switch (t.value) {
        case "+":
          stack.push(polyAdd(a, b, 1));
          break;
        case "-":
          stack.push(polyAdd(a, b, -1));
          break;
        case "*": {
          const aIsOne = a.length === 1 && a[0].num === 1 && a[0].den === 1;
          const bIsOne = b.length === 1 && b[0].num === 1 && b[0].den === 1;
          if ((termCount(a) >= 2 || termCount(b) >= 2) && !aIsOne && !bIsOne) {
            if (recordSteps) expansionSteps.push(joinTerms(expansionTerms(a, b)));
          }
          stack.push(polyMul(a, b));
          break;
        }
        case "/": {
          if (b.length > 1) {
            throw new AlgebraError("xを含む式では割れません（分母は数のみ対応）");
          }
          const divisor = b[0] ?? ZERO;
          stack.push(polyDivByConst(a, divisor));
          break;
        }
        case "^": {
          if (b.length > 1) throw new AlgebraError("指数は数のみ対応しています");
          const expFrac = b[0] ?? ZERO;
          if (expFrac.den !== 1 || expFrac.num < 0 || expFrac.num > 10) {
            throw new AlgebraError("指数は0から10の整数で入力してください");
          }
          // Record distribution lines for powers of multi-term bases.
          if (expFrac.num >= 2 && termCount(a) >= 2) {
            let acc: Poly = [ONE];
            for (let i = 0; i < expFrac.num; i++) {
              if (termCount(acc) >= 2) {
                const line = joinTerms(expansionTerms(acc, a));
                if (recordSteps && !expansionSteps.includes(line)) expansionSteps.push(line);
              }
              acc = polyMul(acc, a);
            }
            stack.push(acc);
          } else {
            stack.push(polyPow(a, expFrac.num));
          }
          break;
        }
        default:
          throw new AlgebraError("不明な演算子です");
      }
    }
  }

  if (stack.length !== 1) throw new AlgebraError("式が不正です");
  return { polynomial: stack[0], expansionSteps };
}

export function simplifyExpression(expr: string): SimplifyResult {
  const { polynomial, expansionSteps } = evalSymbolic(expr, true);
  return { polynomial, result: formatPolynomial(polynomial), expansionSteps };
}

/** Parse an expression to its polynomial coefficients (ascending) without step recording. */
export function parseToPolynomial(expr: string): Fraction[] {
  return evalSymbolic(expr, false).polynomial;
}

/** Convert a JS number token to an exact fraction when it is a short decimal. */
function decimalToFrac(value: number): Fraction {
  if (Number.isInteger(value)) return frac(value);
  const scaled = Math.round(value * 1_000_000);
  return simplifyFraction(scaled, 1_000_000);
}
