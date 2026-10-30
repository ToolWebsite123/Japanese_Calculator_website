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
