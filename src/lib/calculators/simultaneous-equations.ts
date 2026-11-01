/**
 * 連立方程式 (a x + b y = c, d x + e y = f) をクラメルの公式で解く。
 *
 * Wave 1B fix (M-02): D = 0 のときの分類を修正。
 * 以前は a f = c d かつ b f = c e だけで「解は無数」と判定していたため、
 * 0 = 0 / 0 = 5 のような矛盾した式（解なし）を「無数」と誤判定していた。
 * 行列式 Dx, Dy と、係数がすべて 0 で定数項だけが残る行（0 = k, k != 0）の
 * 有無で判定する。
 */

export type SimultaneousEquationsResult =
  | { status: "success"; x: number; y: number; determinant: number; dx: number; dy: number }
  | { status: "infinite" }
  | { status: "no_solution" }
  | { status: "invalid" };

export function solveSimultaneousEquations(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): SimultaneousEquationsResult {
  if (![a, b, c, d, e, f].every((v) => Number.isFinite(v))) {
    return { status: "invalid" };
  }

  const determinant = a * e - b * d;
  const dx = c * e - b * f;
  const dy = a * f - c * d;

  if (determinant !== 0) {
    return { status: "success", x: dx / determinant, y: dy / determinant, determinant, dx, dy };
  }

  // A row like 0x + 0y = k (k != 0) can never hold -> no solution,
  // no matter what the other row says.
  const contradictoryRow = (a === 0 && b === 0 && c !== 0) || (d === 0 && e === 0 && f !== 0);
  if (contradictoryRow) {
    return { status: "no_solution" };
  }

  // Dependent (proportional) rows -> infinitely many solutions;
  // parallel but inconsistent rows -> no solution.
  if (dx === 0 && dy === 0) {
    return { status: "infinite" };
  }
  return { status: "no_solution" };
}

/* -------- exact fractions + schoolbook elimination steps -------- */

import { simplify as simplifyFraction, type Fraction } from "./fraction";

export type { Fraction };

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

function fracOf(n: number, d: number): Fraction {
  return simplifyFraction(n, d);
}

function fAdd(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction(a.num * b.den + b.num * a.den, a.den * b.den);
}
function fMul(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction(a.num * b.num, a.den * b.den);
}
function fDiv(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction(a.num * b.den, a.den * b.num);
}

export function fractionText(f: Fraction): string {
  return f.den === 1 ? `${f.num}` : `${f.num}/${f.den}`;
}

/** Exact rational solution for integer inputs; null otherwise. */
export function solveExactFractions(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): { x: Fraction; y: Fraction } | null {
  if (![a, b, c, d, e, f].every((v) => Number.isInteger(v))) return null;
  const D = a * e - b * d;
  if (D === 0) return null;
  return {
    x: fracOf(c * e - b * f, D),
    y: fracOf(a * f - c * d, D),
  };
}

function termText(coef: number, variable: string, first: boolean): string {
  if (coef === 0) return "";
  const sign = coef < 0 ? " - " : first ? "" : " + ";
  const abs = Math.abs(coef);
  const body = abs === 1 ? variable : `${abs}${variable}`;
  return first && coef < 0 ? `-${body}` : `${sign}${body}`;
}

export function equationText(a: number, b: number, c: number): string {
  const parts = termText(a, "x", true) + termText(b, "y", a === 0);
  return `${parts === "" ? "0" : parts} = ${c}`;
}

function scaledEquationText(a: number, b: number, c: number, m: number): string {
  return equationText(a * m, b * m, c * m);
}

/**
 * Schoolbook 加減法 steps for integer inputs with a unique solution.
 * Returns [] when the inputs are not integers (caller falls back).
 */
export function eliminationSteps(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): string[] {
  const exact = solveExactFractions(a, b, c, d, e, f);
  if (!exact) return [];
  const { x, y } = exact;
  const steps: string[] = [];

  // One equation already lacks y: solve it for x directly, then substitute.
  if (b === 0 || e === 0) {
    const first = b === 0;
    const [pa, pc, label] = first ? [a, c, "①"] : [d, f, "②"];
    steps.push(`${label}にはyが含まれないので、${label}から x = ${fractionText(x)} が分かります`);
    const [qa, qb, qc, qlabel] = first ? [d, e, f, "②"] : [a, b, c, "①"];
    const rest = fAdd({ num: qc, den: 1 }, fMul({ num: -qa, den: 1 }, x));
    steps.push(
      `x を${qlabel}に代入すると ${fractionText(fMul({ num: qa, den: 1 }, x))} + ${qb}y = ${qc}、つまり ${qb}y = ${fractionText(rest)}`,
    );
    steps.push(`よって y = ${fractionText(y)}`);
    return steps;
  }

  // Align the y coefficients with positive multipliers, then add or subtract.
  const L = (Math.abs(b) * Math.abs(e)) / gcd(b, e);
  const m1 = L / Math.abs(b);
  const m2 = L / Math.abs(e);
  const scaled1 = scaledEquationText(a, b, c, m1);
  const scaled2 = scaledEquationText(d, e, f, m2);
  const alignParts: string[] = [];
  alignParts.push(m1 === 1 ? `①はそのまま ${scaled1}` : `①×${m1}：${scaled1}`);
  alignParts.push(m2 === 1 ? `②はそのまま ${scaled2}` : `②×${m2}：${scaled2}`);
  steps.push(`yの係数をそろえます。${alignParts.join("、")}`);

  const sameSign = Math.sign(b * m1) === Math.sign(e * m2);
  const xCoef = sameSign ? a * m1 - d * m2 : a * m1 + d * m2;
  const cCoef = sameSign ? c * m1 - f * m2 : c * m1 + f * m2;
  steps.push(
    sameSign
      ? `① - ② を計算すると y が消えて ${xCoef}x = ${cCoef}`
      : `① + ② を計算すると y が消えて ${xCoef}x = ${cCoef}`,
  );
  steps.push(`x = ${fractionText(x)}`);

  // Substitute back into equation 1.
  const axPart = fMul({ num: a, den: 1 }, x);
  const restY = fAdd({ num: c, den: 1 }, fMul({ num: -1, den: 1 }, axPart));
  steps.push(
    `x = ${fractionText(x)} を①に代入すると ${fractionText(axPart)} + ${b}y = ${c}、つまり ${b}y = ${fractionText(restY)}`,
  );
  steps.push(`よって y = ${fractionText(y)}`);
  return steps;
}

/* -------- 3-variable systems (exact rational row reduction) -------- */

function toFrac(value: number): Fraction {
  if (Number.isInteger(value)) return { num: value, den: 1 };
  return simplifyFraction(Math.round(value * 1_000_000), 1_000_000);
}

function fSub(a: Fraction, b: Fraction): Fraction {
  return fAdd(a, { num: -b.num, den: b.den });
}
function fIsZero(f: Fraction): boolean {
  return f.num === 0;
}

export type Simultaneous3Result =
  | { status: "success"; x: Fraction; y: Fraction; z: Fraction; determinant: Fraction }
  | { status: "infinite" }
  | { status: "no_solution" }
  | { status: "invalid" };

/** Determinant of a 3x3 fraction matrix given as rows [a,b,c],[d,e,f],[g,h,i]. */
function det3(m: Fraction[][]): Fraction {
  const [r1, r2, r3] = m;
  const term = (x: Fraction, y: Fraction, z: Fraction) => fMul(fMul(x, y), z);
  return fAdd(
    fAdd(term(r1[0], r2[1], r3[2]), term(r1[1], r2[2], r3[0])),
    fAdd(
      term(r1[2], r2[0], r3[1]),
      fMul({ num: -1, den: 1 }, fAdd(fAdd(term(r1[2], r2[1], r3[0]), term(r1[1], r2[0], r3[2])), term(r1[0], r2[2], r3[1]))),
    ),
  );
}

export function solveSimultaneous3(
  rows: [number, number, number, number][],
): Simultaneous3Result {
  if (
    rows.length !== 3 ||
    !rows.every((r) => r.length === 4 && r.every((v) => Number.isFinite(v)))
  ) {
    return { status: "invalid" };
  }
  const A = rows.map((r) => r.slice(0, 3).map(toFrac));
  const aug = rows.map((r) => r.map(toFrac));
  const determinant = det3(A);

  // Row-reduce the augmented matrix to find the ranks.
  const M = aug.map((r) => [...r]);
  let rankA = 0;
  let rankAug = 0;
  const pivotCols: number[] = [];
  let row = 0;
  for (let col = 0; col < 4 && row < 3; col++) {
    let pivot = -1;
    for (let i = row; i < 3; i++) {
      if (!fIsZero(M[i][col])) {
        pivot = i;
        break;
      }
    }
    if (pivot === -1) continue;
    [M[row], M[pivot]] = [M[pivot], M[row]];
    const pv = M[row][col];
    for (let i = 0; i < 3; i++) {
      if (i === row || fIsZero(M[i][col])) continue;
      const factor = fDiv(M[i][col], pv);
      for (let j = col; j < 4; j++) {
        M[i][j] = fSub(M[i][j], fMul(factor, M[row][j]));
      }
    }
    if (col < 3) {
      rankA++;
      pivotCols.push(col);
    }
    rankAug++;
    row++;
  }
  // rankAug counts pivots in all 4 columns; coefficient rank is pivotCols length.
  void rankAug;
  const augRank = rankA + (hasAugPivot(M, rankA) ? 1 : 0);
  if (rankA < augRank) return { status: "no_solution" };
  if (rankA < 3) return { status: "infinite" };

  // Unique solution: read off from the reduced rows (each pivot row has one pivot col).
  const solution: Fraction[] = [
    { num: 0, den: 1 },
    { num: 0, den: 1 },
    { num: 0, den: 1 },
  ];
  for (let i = 0; i < 3; i++) {
    const col = pivotCols[i];
    solution[col] = fDiv(M[i][3], M[i][col]);
  }
  return {
    status: "success",
    x: solution[0],
    y: solution[1],
    z: solution[2],
    determinant,
  };
}

function hasAugPivot(M: Fraction[][], rankA: number): boolean {
  for (let i = rankA; i < 3; i++) {
    const coeffZero = M[i].slice(0, 3).every(fIsZero);
    if (coeffZero && !fIsZero(M[i][3])) return true;
  }
  return false;
}

/** Cramer numerators for the 3x3 system (Dx, Dy, Dz) as exact fractions. */
export function cramerNumerators3(
  rows: [number, number, number, number][],
): { dx: Fraction; dy: Fraction; dz: Fraction } {
  const m = rows.map((r) => r.map(toFrac));
  const dxM = m.map((r, i) => [toFrac(rows[i][3]), r[1], r[2]]);
  const dyM = m.map((r, i) => [r[0], toFrac(rows[i][3]), r[2]]);
  const dzM = m.map((r, i) => [r[0], r[1], toFrac(rows[i][3])]);
  return { dx: det3(dxM), dy: det3(dyM), dz: det3(dzM) };
}
