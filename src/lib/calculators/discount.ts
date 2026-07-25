export type DiscountResult = {
  original: number;
  discountRate: number;
  discountAmount: number;
  finalPrice: number;
};

export function calculateDiscount(
  original: number,
  discountRate: number
): DiscountResult {
  if (!Number.isFinite(original) || original < 0) {
    throw new Error("金額が無効です");
  }
  if (!Number.isFinite(discountRate) || discountRate < 0 || discountRate > 100) {
    throw new Error("割引率が無効です");
  }

  const discountAmount = Math.floor((original * discountRate) / 100);
  const finalPrice = original - discountAmount;

  return {
    original,
    discountRate,
    discountAmount,
    finalPrice,
  };
}
