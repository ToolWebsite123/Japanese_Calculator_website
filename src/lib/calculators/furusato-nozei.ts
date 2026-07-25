// ふるさと納税 控除上限額 計算 logic.
// Reuses 給与所得控除 and 所得税 speedy-calc table from income tax calculator
// so the formula stays consistent with the government's official method.

import {
  calcEmploymentDeduction,
  calcBasicDeduction as calcIncomeTaxBasicDeduction,
} from "./income-tax";

export type DependentCategory =
  | "under16" // 16歳未満（控除対象外）
  | "age16to18" // 一般扶養（33万円 住民税）
  | "age19to22" // 特定扶養（63万円 住民税）
  | "age23plus" // 一般扶養（38万円 → 住民税 33万円）
  | "age70plus"; // 老人扶養（48万円 → 住民税 38万円）

export type FurusatoInput = {
  annualIncome: number; // 年収 (yen)
  hasSpouse: boolean; // 配偶者控除の対象
  dependents: Record<DependentCategory, number>; // 人数
  socialInsurance?: number; // 社会保険料控除額 (yen)。未入力なら年収×15%
};

export type FurusatoResult = {
  annualIncome: number;
  employmentDeduction: number;
  employmentIncome: number; // 給与所得
  socialInsurance: number;
  spouseDeductionResidence: number;
  dependentsDeductionResidence: number;
  totalDeductionResidence: number; // 所得控除合計（住民税用）
  taxableIncomeResidence: number; // 住民税課税所得
  residenceTaxIncomePortion: number; // 住民税所得割額（10%）
  incomeTaxRate: number; // 所得税の限界税率（小数、例: 0.2）
  donationLimit: number; // 控除上限額（寄付上限の目安）
};

// 住民税用 扶養控除額 (per person)
const RESIDENCE_DEP_DEDUCTION: Record<DependentCategory, number> = {
  under16: 0,
  age16to18: 330_000,
  age19to22: 450_000, // 特定扶養 住民税
  age23plus: 330_000,
  age70plus: 380_000,
};

// 所得税用 扶養控除額 (per person) — used only to derive the marginal tax rate.
const INCOME_TAX_DEP_DEDUCTION: Record<DependentCategory, number> = {
  under16: 0,
  age16to18: 380_000,
  age19to22: 630_000,
  age23plus: 380_000,
  age70plus: 480_000,
};

const RESIDENCE_BASIC_DEDUCTION = 430_000;
const RESIDENCE_SPOUSE_DEDUCTION = 330_000;
const INCOME_TAX_SPOUSE_DEDUCTION = 380_000;

/** 所得税 速算表 から限界税率を返す (2025 年基準). */
export function marginalIncomeTaxRate(taxable: number): number {
  if (!Number.isFinite(taxable) || taxable <= 1_950_000) return 0.05;
  if (taxable <= 3_300_000) return 0.1;
  if (taxable <= 6_950_000) return 0.2;
  if (taxable <= 9_000_000) return 0.23;
  if (taxable <= 18_000_000) return 0.33;
  if (taxable <= 40_000_000) return 0.4;
  return 0.45;
}

export function calcFurusatoNozei(input: FurusatoInput): FurusatoResult {
  const { annualIncome, hasSpouse, dependents } = input;
  if (!Number.isFinite(annualIncome) || annualIncome < 0) {
    throw new Error("年収が無効です");
  }

  const socialInsurance = Math.max(
    Math.floor(
      input.socialInsurance != null && input.socialInsurance > 0
        ? input.socialInsurance
        : annualIncome * 0.15
    ),
    0
  );

  const employmentDeduction = calcEmploymentDeduction(annualIncome);
  const employmentIncome = Math.max(annualIncome - employmentDeduction, 0);

  // ---- 住民税側 ----
  const spouseDeductionResidence = hasSpouse ? RESIDENCE_SPOUSE_DEDUCTION : 0;
  let dependentsDeductionResidence = 0;
  (Object.keys(dependents) as DependentCategory[]).forEach((k) => {
    const n = Math.max(Math.floor(dependents[k] || 0), 0);
    dependentsDeductionResidence += n * RESIDENCE_DEP_DEDUCTION[k];
  });
  const totalDeductionResidence =
    RESIDENCE_BASIC_DEDUCTION +
    socialInsurance +
    spouseDeductionResidence +
    dependentsDeductionResidence;
  const taxableIncomeResidence = Math.max(
    employmentIncome - totalDeductionResidence,
    0
  );
  const residenceTaxIncomePortion = Math.floor(taxableIncomeResidence * 0.1);

  // ---- 所得税側（限界税率を求めるための課税所得） ----
  const incomeTaxBasic = calcIncomeTaxBasicDeduction(employmentIncome);
  const spouseDeductionIncomeTax = hasSpouse ? INCOME_TAX_SPOUSE_DEDUCTION : 0;
  let dependentsDeductionIncomeTax = 0;
  (Object.keys(dependents) as DependentCategory[]).forEach((k) => {
    const n = Math.max(Math.floor(dependents[k] || 0), 0);
    dependentsDeductionIncomeTax += n * INCOME_TAX_DEP_DEDUCTION[k];
  });
  const totalDeductionIncomeTax =
    incomeTaxBasic +
    socialInsurance +
    spouseDeductionIncomeTax +
    dependentsDeductionIncomeTax;
  const taxableIncomeIncomeTax = Math.max(
    Math.floor((employmentIncome - totalDeductionIncomeTax) / 1000) * 1000,
    0
  );
  const rate = marginalIncomeTaxRate(taxableIncomeIncomeTax);

  // ---- 控除上限額 ----
  // = 住民税所得割額 × 20% ÷ (90% − 所得税率×1.021) + 2,000
  const denom = 0.9 - rate * 1.021;
  const donationLimit =
    denom > 0
      ? Math.floor((residenceTaxIncomePortion * 0.2) / denom) + 2000
      : 0;

  return {
    annualIncome,
    employmentDeduction,
    employmentIncome,
    socialInsurance,
    spouseDeductionResidence,
    dependentsDeductionResidence,
    totalDeductionResidence,
    taxableIncomeResidence,
    residenceTaxIncomePortion,
    incomeTaxRate: rate,
    donationLimit,
  };
}
