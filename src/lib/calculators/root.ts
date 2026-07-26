export type RootMode = "square" | "nth";

export type RootResult = {
  value: number;
  radicand: number;
  index: number;
  isExact: boolean;
  exactText?: string;
};

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

  return {
    value,
    radicand,
    index: n,
    isExact: perfect !== null,
    exactText,
  };
}

export const ROOT_PRESETS = [
  { label: "√2", radicand: 2, index: 2 },
  { label: "√3", radicand: 3, index: 2 },
  { label: "√5", radicand: 5, index: 2 },
  { label: "√π", radicand: Math.PI, index: 2 },
] as const;
