export type RootMode = "square" | "nth";

export type RootResult = {
  value: number;
  radicand: number;
  index: number;
  isExact: boolean;
  exactText?: string;
  simplified?: SimplifiedRoot;
  simplifiedText?: string;
};

export type SimplifiedRoot = {
  coefficient: number;
  remaining: number;
};

/**
 * Simplify a square root of a positive integer into coefficient × √remaining
 * form (e.g. 72 → 6√2). Returns null when there is nothing to simplify:
 * non-integers, values below 4, perfect squares (handled as exact results),
 * and integers with no perfect-square factor (e.g. primes).
 */
export function simplifySquareRoot(radicand: number): SimplifiedRoot | null {
  if (!Number.isInteger(radicand) || radicand < 4) return null;
  for (let i = Math.floor(Math.sqrt(radicand)); i >= 2; i--) {
    const square = i * i;
    if (radicand % square === 0) {
      const remaining = radicand / square;
      if (remaining === 1) return null;
      return { coefficient: i, remaining };
    }
  }
  return null;
}

function isPerfectRoot(value: number, n: number): number | null {
  if (value < 0 && n % 2 === 0) return null;
  const root = Math.pow(Math.abs(value), 1 / n);
  const rounded = Math.round(root);
  if (Math.abs(Math.pow(rounded, n) - Math.abs(value)) < 1e-9) {
    return value < 0 ? -rounded : rounded;
  }
  return null;
}

export function calculateRoot(radicand: number, index: number, mode: RootMode): RootResult {
  if (!Number.isFinite(radicand)) throw new Error("無効な被開方数です");

  const n = mode === "square" ? 2 : index;
  if (!Number.isInteger(n) || n < 2) {
    throw new Error("次数は2以上の整数である必要があります");
  }

  if (radicand < 0 && n % 2 === 0) {
    throw new Error("負の数の偶数次根は実数では定義されません");
  }

  const perfect = isPerfectRoot(radicand, n);
  const value =
    radicand < 0 && n % 2 === 1 ? -Math.pow(Math.abs(radicand), 1 / n) : Math.pow(radicand, 1 / n);

  let exactText: string | undefined;
  if (perfect !== null) {
    exactText = n === 2 ? String(perfect) : `${perfect}`;
  } else if (n === 2) {
    exactText = `√${radicand}`;
  } else {
    exactText = `${n}√${radicand}`;
  }

  const simplified = n === 2 && perfect === null ? simplifySquareRoot(radicand) : null;

  return {
    value,
    radicand,
    index: n,
    isExact: perfect !== null,
    exactText,
    simplified: simplified ?? undefined,
    simplifiedText: simplified ? `${simplified.coefficient}√${simplified.remaining}` : undefined,
  };
}

export const ROOT_PRESETS = [
  { label: "√2", radicand: 2, index: 2 },
  { label: "√3", radicand: 3, index: 2 },
  { label: "√5", radicand: 5, index: 2 },
  { label: "√π", radicand: Math.PI, index: 2 },
] as const;
