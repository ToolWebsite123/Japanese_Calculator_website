export type TaxMode = "included" | "excluded";

export type TaxResult = {
  basePrice: number;
  taxAmount: number;
  totalPrice: number;
  rate: number;
};

/** Calculate consumption tax for Japan (8% or 10%). */
export function calculateTax(
  price: number,
  rate: number,
  mode: TaxMode
): TaxResult {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("金額が無効です");
  }

  if (mode === "excluded") {
    // Price is tax-excluded; add tax
    const taxAmount = Math.floor(price * rate);
    return {
      basePrice: price,
      taxAmount,
      totalPrice: price + taxAmount,
      rate,
    };
  }

  // Price is tax-included; extract tax
  const basePrice = Math.ceil(price / (1 + rate));
  const taxAmount = price - basePrice;
  return {
    basePrice,
    taxAmount,
    totalPrice: price,
    rate,
  };
}
