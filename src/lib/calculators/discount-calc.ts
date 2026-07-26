// 割引 計算 logic (forward + reverse). Independent from legacy discount.ts.

export type RoundMode = "floor" | "round" | "ceil";
export type DiscountUnit = "percent" | "wari" | "yen";
export type TaxMode = "excluded" | "included" | "none";

function applyRound(v: number, mode: RoundMode): number {
  if (!Number.isFinite(v)) return 0;
  if (mode === "floor") return Math.floor(v);
  if (mode === "ceil") return Math.ceil(v);
  return Math.round(v);
}

/** Convert user-entered discount value + unit into a rate (0-1) and yen-off (if any). */
export function toDiscount(
  value: number,
  unit: DiscountUnit,
  original: number,
): { rate: number; yenOff: number } {
  if (!Number.isFinite(value) || value < 0) return { rate: 0, yenOff: 0 };
  if (unit === "percent") return { rate: Math.min(value / 100, 1), yenOff: 0 };
  if (unit === "wari") return { rate: Math.min(value / 10, 1), yenOff: 0 };
  // yen
  const off = Math.min(value, original);
  const rate = original > 0 ? off / original : 0;
  return { rate, yenOff: off };
}

export type ForwardInput = {
  original: number;
  discountValue: number;
  discountUnit: DiscountUnit;
  taxMode: TaxMode; // "excluded" = entered price is tax-excl; "included" = tax-incl; "none" = no tax handling
  taxRate: number; // e.g. 0.10
  round: RoundMode;
};

export type ForwardResult = {
  original: number;
  discountRate: number;
  discountAmount: number;
  discountedBase: number; // price after discount, pre-tax (or same as final if included/none)
  taxAmount: number;
  finalPrice: number;
  wariEquivalent: number;
};

export function calcForward(input: ForwardInput): ForwardResult {
  const { original, discountValue, discountUnit, taxMode, taxRate, round } = input;
  if (!Number.isFinite(original) || original < 0) {
    throw new Error("金額が無効です");
  }
  if (discountUnit !== "yen") {
    const rawRate = discountUnit === "wari" ? discountValue / 10 : discountValue / 100;
    if (rawRate > 1) throw new Error("割引率は100%を超えることはできません");
  }
  const { rate, yenOff } = toDiscount(discountValue, discountUnit, original);
  const rawDiscount = discountUnit === "yen" ? yenOff : original * rate;
  const discountAmount = applyRound(rawDiscount, round);
  const discountedBase = Math.max(original - discountAmount, 0);

  let taxAmount = 0;
  let finalPrice = discountedBase;
  if (taxMode === "excluded") {
    taxAmount = applyRound(discountedBase * taxRate, round);
    finalPrice = discountedBase + taxAmount;
  }
  return {
    original,
    discountRate: rate,
    discountAmount,
    discountedBase,
    taxAmount,
    finalPrice,
    wariEquivalent: rate * 10,
  };
}

export type ReverseInput = {
  discountedPrice: number;
  discountValue: number;
  discountUnit: Exclude<DiscountUnit, "yen">;
  round: RoundMode;
};

export type ReverseResult = {
  discountedPrice: number;
  discountRate: number;
  originalPrice: number;
  discountAmount: number;
  wariEquivalent: number;
};

export function calcReverse(input: ReverseInput): ReverseResult {
  const { discountedPrice, discountValue, discountUnit, round } = input;
  if (!Number.isFinite(discountedPrice) || discountedPrice < 0) {
    throw new Error("金額が無効です");
  }
  const rawRate = discountUnit === "wari" ? discountValue / 10 : discountValue / 100;
  if (rawRate > 1) throw new Error("割引率は100%を超えることはできません");
  const { rate } = toDiscount(discountValue, discountUnit, discountedPrice);
  if (rate >= 1) throw new Error("割引率は100%を超えることはできません");
  const rawOriginal = discountedPrice / (1 - rate);
  const originalPrice = applyRound(rawOriginal, round);
  const discountAmount = originalPrice - discountedPrice;
  return {
    discountedPrice,
    discountRate: rate,
    originalPrice,
    discountAmount,
    wariEquivalent: rate * 10,
  };
}
