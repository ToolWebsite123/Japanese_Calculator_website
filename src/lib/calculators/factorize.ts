// Factorization of single-variable expressions (junior-high scope):
// common-factor extraction for any degree, and full factorization of
// quadratics over the rationals via the AC method (たすき掛け), with
// schoolbook step lines. Also provides the repeated-division steps for
// prime factorization of integers.

import { AlgebraError } from "./algebra";
import { parseToPolynomial, formatPolynomial } from "./polynomial";
import { simplify as simplifyFraction, type Fraction } from "./fraction";

const MAX_COEFF = 1_000_000;

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const r = a % b;
    a = b;
    b = r;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

function isPerfectSquare(n: number): number | null {
  if (n < 0) return null;
  const r = Math.round(Math.sqrt(n));
  return r * r === n ? r : null;
}

/** Format an integer with the Japanese minus sign used across the site. */
function intText(n: number): string {
  return n < 0 ? `-${Math.abs(n)}` : `${n}`;
}

function fracText(f: Fraction): string {
  if (f.den === 1) return intText(f.num);
  return `${intText(f.num)}/${f.den}`;
}

/** A linear factor (q x + c) with integer q > 0, formatted like "(x + 2)" or "(2x - 1)". */
function linearFactorText(q: number, c: number): string {
  const xPart = q === 1 ? "x" : `${q}x`;
  if (c === 0) return `(${xPart})`;
  return c > 0 ? `(${xPart} + ${c})` : `(${xPart} - ${Math.abs(c)})`;
}

export type FactorizeResult = {
  /** Formatted factorization, e.g. "2x(x + 2)(x + 3)". */
  result: string;
  /** Step lines explaining the factorization. */
  steps: string[];
  /** True when the expression could not be factored further (over the rationals). */
  irreducible: boolean;
};

export function factorizeExpression(expr: string): FactorizeResult {
  const coeffs = parseToPolynomial(expr);
  if (coeffs.length === 0) throw new AlgebraError("式を入力してください");
  if (coeffs.length === 1) {
    throw new AlgebraError("定数の因数分解は「素因数分解」モードで計算できます");
  }

  const steps: string[] = [];
  let rest = [...coeffs];

  // 1) Extract x^k.
  let xPower = 0;
  while (xPower < rest.length && rest[xPower].num === 0) xPower++;
  if (xPower > 0) {
    rest = rest.slice(xPower);
    steps.push(
      xPower === 1
        ? "共通因数 x をくくり出します"
        : `共通因数 x^${xPower} をくくり出します`,
    );
  }
  if (rest.length === 1) {
    // Only a constant times x^k remained, e.g. 3x -> 3x (nothing more to do).
    return { result: formatPolynomial(coeffs), steps, irreducible: steps.length === 0 };
  }

  // 2) Scale to integers and extract the content (GCF of coefficients).
  let scale = 1;
  for (const c of rest) scale = lcm(scale, c.den);
  const ints = rest.map((c) => c.num * (scale / c.den));
  for (const v of ints) {
    if (Math.abs(v) > MAX_COEFF) throw new AlgebraError("係数が大きすぎます");
  }
  let content = 0;
  for (const v of ints) content = gcd(content, v);
  const leadSign = ints[ints.length - 1] < 0 ? -1 : 1;
  const signedContent = content * leadSign;
  const primitive = ints.map((v) => v / signedContent);
  const contentFrac = simplifyFraction(signedContent, scale);
  const hasContent = !(contentFrac.num === 1 && contentFrac.den === 1);
  if (content !== 1 || leadSign < 0) {
    steps.push(`共通因数 ${fracText(contentFrac)} をくくり出します`);
  }

  // 3) Factor the primitive integer polynomial.
  const degree = primitive.length - 1;
  let factorText = "";
  let irreducible = false;
  // True only when factorText is a single parenthesised whole polynomial
  // (the unfactorable fallbacks), where the outer parens may be stripped.
  let wrappedParens = false;

  if (degree === 1) {
    const [c0, c1] = primitive;
    factorText = linearFactorText(c1, c0);
    if (!hasContent && xPower === 0) irreducible = true;
  } else if (degree === 2) {
    const [C, B, A] = primitive;
    const factored = factorQuadratic(A, B, C, steps);
    if (factored === null) {
      irreducible = true;
      wrappedParens = true;
      factorText = `(${formatPolynomial(primitive.map((n) => ({ num: n, den: 1 })) )})`;
      // If nothing was extracted either, present the expression itself.
      if (!hasContent && xPower === 0) factorText = formatPolynomial(coeffs);
    } else {
      factorText = factored;
    }
  } else {
    // Degree >= 3 beyond the extracted common factor: out of junior-high scope.
    irreducible = true;
    wrappedParens = true;
    factorText = `(${formatPolynomial(primitive.map((n) => ({ num: n, den: 1 })) )})`;
    steps.push("3次以上の式の因数分解には対応していません（共通因数まで）");
  }

  // 4) Assemble: content · x^k · factors.
  const parts: string[] = [];
  if (hasContent) parts.push(fracText(contentFrac));
  if (xPower === 1) parts.push("x");
  else if (xPower > 1) parts.push(`x^${xPower}`);
  parts.push(factorText);
  // When the only part is a parenthesised polynomial, strip redundant parens.
  let result = parts.join("");
  if (parts.length === 1 && wrappedParens) {
    result = factorText.slice(1, -1);
  }
  if (irreducible && !hasContent && xPower === 0 && degree >= 2) {
    result = formatPolynomial(coeffs);
  }
  return { result, steps, irreducible };
}

/**
 * Factor primitive integer quadratic A x^2 + B x + C (A > 0, gcd(|A|,|B|,|C|) = 1).
 * Returns the factor text, pushing step lines, or null when not factorable
 * over the rationals.
 */
function factorQuadratic(A: number, B: number, C: number, steps: string[]): string | null {
  // Difference of squares: B = 0 and A, -C perfect squares.
  if (B === 0 && C < 0) {
    const ra = isPerfectSquare(A);
    const rc = isPerfectSquare(-C);
    if (ra !== null && rc !== null) {
      steps.push(
        ra === 1
          ? `和と差の積の公式 x^2 - a^2 = (x + a)(x - a) を使います（a = ${rc}）`
          : `和と差の積の公式 (ax)^2 - b^2 = (ax + b)(ax - b) を使います`,
      );
      return `${linearFactorText(ra, rc)}${linearFactorText(ra, -rc)}`;
    }
  }

  const D = B * B - 4 * A * C;
  const sqrtD = isPerfectSquare(D);
  if (sqrtD === null) {
    steps.push(
      `判別式 D = ${B}^2 - 4×${A}×${C} = ${D} が平方数でないため、有理数の範囲では因数分解できません`,
    );
    return null;
  }
  if (sqrtD === 0) {
    // Perfect square: root r = -B / 2A in lowest terms; the factor is (q x - p).
    const g = gcd(Math.abs(B), 2 * A);
    const p = -B / g;
    const q = (2 * A) / g;
    steps.push(`完全平方式です（判別式 D = 0）。x = ${p}/${q} が重解になります`);
    const f = linearFactorText(q, -p);
    return `${f}^2`;
  }

  // AC method (たすき掛け): find m + n = B with m * n = A * C.
  const AC = A * C;
  let m: number | null = null;
  let n: number | null = null;
  const absAC = Math.abs(AC);
  for (let d = 1; d * d <= absAC; d++) {
    if (absAC % d !== 0) continue;
    for (const cand of [d, -d]) {
      const other = AC / cand;
      if (cand + other === B) {
        m = cand;
        n = other;
        break;
      }
      const negOther = AC / -cand;
      if (-cand + negOther === B) {
        m = -cand;
        n = negOther;
        break;
      }
    }
    if (m !== null) break;
  }
  if (m === null || n === null) {
    // D was a perfect square, so a rational split must exist; treat as unfactorable fallback.
    return null;
  }

  if (A === 1) {
    steps.push(
      `積が ${C}、和が ${B} になる2つの数は ${m} と ${n} です（公式 x^2 + (a + b)x + ab = (x + a)(x + b)）`,
    );
    return `${linearFactorText(1, m)}${linearFactorText(1, n)}`;
  }

  // General tasukigake: factors (g1 x + v)(u x + w) need g1*u = A,
  // v*w = C and g1*w + v*u = B. With the AC split m + n = B, m*n = A*C,
  // set g1 = gcd(A, m), w = m / g1, u = A / g1, v = C / w — then
  // g1*w = m and v*u = n exactly (the standard AC-method identity).
  const g1 = gcd(A, m);
  const w = m / g1;
  const u = A / g1;
  if (w === 0 || C % w !== 0) return null;
  const v = C / w;
  if (g1 * w + v * u !== B || g1 * u !== A || v * w !== C) return null;
  steps.push(
    `たすき掛け：${A} = ${g1} × ${u}、${C} = ${v} × ${w} と分けると、${g1} × ${w} + ${v} × ${u} = ${B} になります`,
  );
  return `${linearFactorText(g1, v)}${linearFactorText(u, w)}`;
}

/* ---------------- prime factorization steps ---------------- */

export type PrimeStep = { dividend: number; prime: number; quotient: number };

/** Repeated-division chain for n (2 <= n <= 1e12), empty for primes. */
export function primeFactorSteps(n: number): PrimeStep[] {
  if (!Number.isInteger(n) || n < 2 || n > 1e12) {
    throw new AlgebraError("2以上1兆以下の整数を入力してください");
  }
  const steps: PrimeStep[] = [];
  let rest = n;
  for (let p = 2; p * p <= rest; p = p === 2 ? 3 : p + 2) {
    while (rest % p === 0) {
      steps.push({ dividend: rest, prime: p, quotient: rest / p });
      rest /= p;
    }
  }
  return steps;
}
