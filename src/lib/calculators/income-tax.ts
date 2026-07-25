// 所得税 計算 logic (2025年 給与所得控除・基礎控除・速算表対応).

export type EmploymentType = "employee" | "self";

export type IncomeTaxInput = {
  annualIncome: number; // 年収 (yen)
  employmentType: EmploymentType;
  socialInsurance: number; // 社会保険料控除額 (yen)
  otherDeductions: number; // その他控除額 (yen)
};

export type IncomeTaxResult = {
  annualIncome: number;
  employmentDeduction: number; // 給与所得控除
  employmentIncome: number; // 給与所得 (or 所得 for self-employed)
  basicDeduction: number; // 基礎控除
  socialInsurance: number;
  otherDeductions: number;
  taxableIncome: number; // 課税所得
  incomeTax: number; // 所得税
  reconstructionTax: number; // 復興特別所得税
  totalTax: number; // 納税額合計
};

/** STEP 1 — 給与所得控除 (2025年改正後). */
export function calcEmploymentDeduction(income: number): number {
  if (!Number.isFinite(income) || income <= 0) return 0;
  if (income <= 1_625_000) return 650_000;
  if (income <= 1_800_000) return Math.max(Math.floor(income * 0.4 - 100_000), 650_000);
  if (income <= 3_600_000) return Math.floor(income * 0.3 + 80_000);
  if (income <= 6_600_000) return Math.floor(income * 0.2 + 440_000);
  if (income <= 8_500_000) return Math.floor(income * 0.1 + 1_100_000);
  return 1_950_000;
}

/** STEP 3 — 基礎控除 (2025-2026 phased). */
export function calcBasicDeduction(totalIncome: number): number {
  if (!Number.isFinite(totalIncome) || totalIncome < 0) return 0;
  if (totalIncome <= 1_320_000) return 950_000;
  if (totalIncome <= 3_360_000) return 880_000;
  if (totalIncome <= 4_890_000) return 680_000;
  if (totalIncome <= 6_550_000) return 630_000;
  if (totalIncome <= 23_500_000) return 580_000;
  if (totalIncome <= 24_000_000) return 480_000;
  if (totalIncome <= 24_500_000) return 320_000;
  if (totalIncome <= 25_000_000) return 160_000;
  return 0;
}

/** STEP 5 — 所得税 速算表. Returns income tax (before reconstruction surtax). */
export function calcIncomeTaxFromTaxable(taxable: number): number {
  if (!Number.isFinite(taxable) || taxable < 1_000) return 0;
  const brackets: Array<{ upTo: number; rate: number; deduct: number }> = [
    { upTo: 1_949_000, rate: 0.05, deduct: 0 },
    { upTo: 3_299_000, rate: 0.1, deduct: 97_500 },
    { upTo: 6_949_000, rate: 0.2, deduct: 427_500 },
    { upTo: 8_999_000, rate: 0.23, deduct: 636_000 },
    { upTo: 17_999_000, rate: 0.33, deduct: 1_536_000 },
    { upTo: 39_999_000, rate: 0.4, deduct: 2_796_000 },
    { upTo: Infinity, rate: 0.45, deduct: 4_796_000 },
  ];
  for (const b of brackets) {
    if (taxable <= b.upTo) {
      return Math.max(Math.floor(taxable * b.rate - b.deduct), 0);
    }
  }
  return 0;
}

export function calcIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const { annualIncome, employmentType } = input;
  if (!Number.isFinite(annualIncome) || annualIncome < 0) {
    throw new Error("年収が無効です");
  }
  const socialInsurance = Math.max(Math.floor(input.socialInsurance || 0), 0);
  const otherDeductions = Math.max(Math.floor(input.otherDeductions || 0), 0);

  const employmentDeduction =
    employmentType === "employee" ? calcEmploymentDeduction(annualIncome) : 0;
  const employmentIncome = Math.max(annualIncome - employmentDeduction, 0);

  const basicDeduction = calcBasicDeduction(employmentIncome);

  const rawTaxable = employmentIncome - basicDeduction - socialInsurance - otherDeductions;
  // round down to nearest 1,000 yen, min 0
  const taxableIncome = Math.max(Math.floor(rawTaxable / 1000) * 1000, 0);

  const incomeTax = calcIncomeTaxFromTaxable(taxableIncome);
  const reconstructionTax = Math.round(incomeTax * 0.021);
  const totalTax = incomeTax + reconstructionTax;

  return {
    annualIncome,
    employmentDeduction,
    employmentIncome,
    basicDeduction,
    socialInsurance,
    otherDeductions,
    taxableIncome,
    incomeTax,
    reconstructionTax,
    totalTax,
  };
}
