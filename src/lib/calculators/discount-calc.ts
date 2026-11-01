// 割引 計算 logic (forward + reverse). Independent from legacy discount.ts.

export type RoundMode = "floor" | "round" | "ceil";
export type DiscountUnit = "percent" | "wari" | "yen";
export type TaxMode = "excluded" | "included" | "none";

function applyRound(v: number, mode: RoundMode): number {
  if (!Number.isFinite(v)) return 0;
  // Snap binary float dust (e.g. 170 * 0.7 = 118.99999999999999, whose exact
  // value is 119) back to the intended decimal before rounding, so floor /
  // half-up never drop a yen to representation error. 1e-10 relative snap is
  // far below any real yen fraction this calculator can produce.
  const snapped = Math.round(v * 1e10) / 1e10;
  if (mode === "floor") return Math.floor(snapped);
  if (mode === "ceil") return Math.ceil(snapped);
  return Math.round(snapped);
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
  /** Optional second discount （重ねがけ), applied to the price after the
   *  first discount, before tax. Percent or wari only. */
  secondValue?: number;
  secondUnit?: Exclude<DiscountUnit, "yen">;
};

export type ForwardResult = {
  original: number;
  discountRate: number;
  discountAmount: number;
  /** Second discount amount (0 when no second discount is set). */
  secondDiscountAmount: number;
  /** Combined discount rate actually achieved (0-1). With a stacked
   *  discount this is NOT the sum of the two rates: 20% + 10% -> 0.28. */
  effectiveRate: number;
  discountedBase: number; // price after all discounts, pre-tax (or same as final if included/none)
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
  let afterDiscount = Math.max(original - discountAmount, 0);

  // Stacked second discount: applies to the already-discounted price,
  // rounded with the same mode, before tax (standard retail practice).
  let secondDiscountAmount = 0;
  if (input.secondValue !== undefined && input.secondUnit !== undefined) {
    const sv = input.secondValue;
    const rawSecondRate = input.secondUnit === "wari" ? sv / 10 : sv / 100;
    if (!Number.isFinite(sv) || sv < 0 || rawSecondRate > 1) {
      throw new Error("割引率は100%を超えることはできません");
    }
    secondDiscountAmount = applyRound(afterDiscount * rawSecondRate, round);
    afterDiscount = Math.max(afterDiscount - secondDiscountAmount, 0);
  }
  const discountedBase = afterDiscount;
  const effectiveRate = original > 0 ? (original - discountedBase) / original : 0;

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
    secondDiscountAmount,
    effectiveRate,
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

/* ---------------- discount rate from two prices （割引率を求める) ---------------- */

export type RateFromPricesResult = {
  originalPrice: number;
  salePrice: number;
  discountAmount: number;
  /** Discount rate in percent (0-100), one decimal place. */
  ratePercent: number;
  /** The same rate in 割 (0-10), one decimal place. */
  rateWari: number;
};

export function calcRateFromPrices(
  originalPrice: number,
  salePrice: number,
): RateFromPricesResult {
  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(salePrice) ||
    originalPrice <= 0 ||
    salePrice < 0 ||
    salePrice > originalPrice
  ) {
    throw new Error("金額が無効です");
  }
  const discountAmount = originalPrice - salePrice;
  const rate = discountAmount / originalPrice;
  return {
    originalPrice,
    salePrice,
    discountAmount,
    ratePercent: Math.round(rate * 1000) / 10,
    rateWari: Math.round(rate * 100) / 10,
  };
}
