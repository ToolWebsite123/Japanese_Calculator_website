/**
 * Simplified Japanese salary net-pay estimate.
 * Rates are approximate and for educational/demo purposes only.
 */

export type SalaryResult = {
  grossMonthly: number;
  grossAnnual: number;
  healthInsurance: number;
  pension: number;
  employmentInsurance: number;
  socialInsuranceTotal: number;
  incomeTax: number;
  residentTax: number;
  totalDeductions: number;
  netMonthly: number;
  netAnnual: number;
};

/** Approximate health insurance employee share (~5% of monthly gross, capped). */
function calcHealthInsurance(monthly: number): number {
  const rate = 0.05;
  return Math.floor(Math.min(monthly * rate, 75000));
}

/** Approximate employee pension (~9.15% of monthly, standard grade estimate). */
function calcPension(monthly: number): number {
  const rate = 0.0915;
  return Math.floor(Math.min(monthly * rate, 59475));
}

/** Employment insurance employee share (~0.6%). */
function calcEmploymentInsurance(monthly: number): number {
  return Math.floor(monthly * 0.006);
}

/**
 * Simplified income tax on annual taxable income.
 * Uses rough brackets after a flat deduction estimate.
 */
function calcIncomeTax(annualTaxable: number): number {
  if (annualTaxable <= 0) return 0;

  const brackets: [number, number][] = [
    [1_950_000, 0.05],
    [3_300_000, 0.1],
    [6_950_000, 0.2],
    [9_000_000, 0.23],
    [18_000_000, 0.33],
    [40_000_000, 0.4],
    [Infinity, 0.45],
  ];

  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of brackets) {
    const taxable = Math.min(annualTaxable, limit) - prev;
    if (taxable > 0) tax += taxable * rate;
    if (annualTaxable <= limit) break;
    prev = limit;
  }

  return Math.floor(tax);
}

/** Resident tax estimate: ~10% of taxable income. */
function calcResidentTax(annualTaxable: number): number {
  if (annualTaxable <= 0) return 0;
  return Math.floor(annualTaxable * 0.1);
}

export function calculateSalary(grossMonthly: number): SalaryResult {
  if (!Number.isFinite(grossMonthly) || grossMonthly < 0) {
    throw new Error("給与額が無効です");
  }

  const grossAnnual = grossMonthly * 12;
  const healthInsurance = calcHealthInsurance(grossMonthly);
  const pension = calcPension(grossMonthly);
  const employmentInsurance = calcEmploymentInsurance(grossMonthly);
  const socialInsuranceTotal = healthInsurance + pension + employmentInsurance;

  const annualSocial = socialInsuranceTotal * 12;
  // Rough basic deduction + social insurance deduction
  const annualTaxable = Math.max(0, grossAnnual - annualSocial - 480_000);

  const incomeTaxAnnual = calcIncomeTax(annualTaxable);
  const residentTaxAnnual = calcResidentTax(annualTaxable);

  const incomeTax = Math.floor(incomeTaxAnnual / 12);
  const residentTax = Math.floor(residentTaxAnnual / 12);

  const totalDeductions = socialInsuranceTotal + incomeTax + residentTax;
  const netMonthly = grossMonthly - totalDeductions;

  return {
    grossMonthly,
    grossAnnual,
    healthInsurance,
    pension,
    employmentInsurance,
    socialInsuranceTotal,
    incomeTax,
    residentTax,
    totalDeductions,
    netMonthly,
    netAnnual: netMonthly * 12,
  };
}
