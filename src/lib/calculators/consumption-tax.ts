// 消費税 計算 logic (税抜→税込 / 税込→税抜の逆算). Independent pure functions,
// following the same conventions as discount-calc.ts:
// - 金額が無効な場合は Error を投げる（呼び出し側が日本語メッセージを表示）
// - 端数処理は消費税額（逆算時は税抜価格）に適用し、内訳が必ず一致する

export type RoundMode = "floor" | "round" | "ceil";

/** 標準税率 10% */
export const STANDARD_TAX_RATE = 0.1;
/** 軽減税率 8%（飲食料品・定期購読の新聞など） */
export const REDUCED_TAX_RATE = 0.08;

function applyRound(v: number, mode: RoundMode): number {
  if (!Number.isFinite(v)) return 0;
  // 浮動小数点の誤差を除去してから丸める（例: 1080 / 1.08 = 999.9999999999999
  // のまま切り捨てると 999 になってしまうため、有効数字12桁にそろえる）。
  const snapped = Number(v.toPrecision(12));
  if (mode === "floor") return Math.floor(snapped);
  if (mode === "ceil") return Math.ceil(snapped);
  return Math.round(snapped);
}

export type ConsumptionTaxInput = {
  /** 金額（円）。方向によって税抜価格／税込価格のどちらかを渡す */
  amount: number;
  /** 税率（0.10 = 10%、0.08 = 8%）。任意の税率も指定可 */
  rate: number;
  round: RoundMode;
};

export type ConsumptionTaxResult = {
  /** 税抜価格（円） */
  baseAmount: number;
  /** 消費税額（円） */
  taxAmount: number;
  /** 税込価格（円）= baseAmount + taxAmount（常に一致） */
  totalAmount: number;
  rate: number;
};

function validate(amount: number, rate: number): void {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("金額が無効です");
  }
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
    throw new Error("税率が無効です");
  }
}

/** 税抜価格から、消費税額と税込価格を求める。税額に端数処理を適用する。 */
export function calcFromTaxExcluded(input: ConsumptionTaxInput): ConsumptionTaxResult {
  const { amount, rate, round } = input;
  validate(amount, rate);
  const taxAmount = applyRound(amount * rate, round);
  return {
    baseAmount: amount,
    taxAmount,
    totalAmount: amount + taxAmount,
    rate,
  };
}

/**
 * 税込価格から、税抜価格と消費税額を逆算する。
 * 税抜価格に端数処理を適用し、税額は「税込 − 税抜」で求めるため、
 * 税抜価格 + 税額 = 税込価格 が常に一致する。
 */
export function calcFromTaxIncluded(input: ConsumptionTaxInput): ConsumptionTaxResult {
  const { amount, rate, round } = input;
  validate(amount, rate);
  const baseAmount = applyRound(amount / (1 + rate), round);
  return {
    baseAmount,
    taxAmount: amount - baseAmount,
    totalAmount: amount,
    rate,
  };
}
