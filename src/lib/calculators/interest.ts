/**
 * Simple vs compound interest over a period given in years, months or days.
 *
 * Day counts use the standard Japanese convention of a 365-day year:
 * simple interest accrues linearly (days / 365), compound interest uses
 * the fractional-year power (1 + r)^(days / 365).
 *
 * Deposit interest for individuals is withheld at 20.315%
 * (income tax 15.315% + local tax 5%), each component truncated to
 * whole yen, matching the banks' method.
 */
export type InterestPeriodUnit = "years" | "months" | "days";

export type InterestResult = {
  years: number;
  simpleTotal: number;
  compoundTotal: number;
  simpleInterest: number;
  compoundInterest: number;
  difference: number;
};

export function periodToYears(value: number, unit: InterestPeriodUnit): number {
  if (unit === "years") return value;
  if (unit === "months") return value / 12;
  return value / 365;
}

export function calcInterest(
  principal: number,
  annualRatePercent: number,
  periodValue: number,
  unit: InterestPeriodUnit,
): InterestResult {
  if (!Number.isFinite(principal) || principal < 0) {
    throw new Error("元金が無効です");
  }
  if (!Number.isFinite(annualRatePercent) || !Number.isFinite(periodValue) || periodValue < 0) {
    throw new Error("金利または期間が無効です");
  }
  const years = periodToYears(periodValue, unit);
  const r = annualRatePercent / 100;
  const simpleTotal = principal * (1 + r * years);
  const compoundTotal = principal * Math.pow(1 + r, years);
  return {
    years,
    simpleTotal,
    compoundTotal,
    simpleInterest: simpleTotal - principal,
    compoundInterest: compoundTotal - principal,
    difference: compoundTotal - simpleTotal,
  };
}

/** Withholding tax on deposit interest for an individual (20.315%). */
export function withholdingTax(interest: number): { incomeTax: number; localTax: number; total: number; net: number } {
  const gross = Math.max(0, interest);
  const incomeTax = Math.floor(gross * 0.15315);
  const localTax = Math.floor(gross * 0.05);
  const total = incomeTax + localTax;
  return { incomeTax, localTax, total, net: gross - total };
}
