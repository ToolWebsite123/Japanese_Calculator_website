// ふるさと納税 詳細シミュレーション logic.
// Uses the same core formula as the quick calculator (see furusato-nozei.ts)
// but subtracts ALL standard 所得控除 the user provides — 社会保険料・生命保険料・
// 地震保険料・医療費・障害者・ひとり親・配偶者（69歳以下/70歳以上）・扶養（年齢区分×同居/別居）
// — matching the official calculation method furusato-tax.jp uses in its Excel sheet.

import {
  calcEmploymentDeduction,
  calcBasicDeduction as calcIncomeTaxBasicDeduction,
} from "./income-tax";
import { marginalIncomeTaxRate } from "./furusato-nozei";

export type SpouseType = "none" | "under70" | "over70";

export type DetailedDependentKey =
  | "under16"
  | "age16to18"
  | "age19to22"
  | "age23to69"
  | "age70coliving"
  | "age70separate";

export type DisabilityKey = "general" | "special" | "cohabitingSpecial";

export type FurusatoDetailedInput = {
  annualIncome: number;
  spouseType: SpouseType;
  spouseIncome: number; // 配偶者の給与収入 (yen)
  dependents: Record<DetailedDependentKey, number>;
  disability: Record<DisabilityKey, number>;
  socialInsurance: number;
  lifeInsurance: number;
  earthquakeInsurance: number;
  medical: number;
  singleParent: boolean;
  housingLoanCredit: number; // 住宅ローン控除額 (税額控除, yen)
};

export type FurusatoDetailedResult = {
  annualIncome: number;
  employmentDeduction: number;
  employmentIncome: number;
  spouseDeductionResidence: number;
  spouseDeductionIncomeTax: number;
  dependentsDeductionResidence: number;
  dependentsDeductionIncomeTax: number;
  disabilityDeductionResidence: number;
  disabilityDeductionIncomeTax: number;
  singleParentDeductionResidence: number;
  singleParentDeductionIncomeTax: number;
  socialInsurance: number;
  lifeInsurance: number;
  earthquakeInsurance: number;
  medical: number;
  basicDeductionResidence: number;
  basicDeductionIncomeTax: number;
  totalDeductionResidence: number;
  totalDeductionIncomeTax: number;
  taxableIncomeResidence: number;
  taxableIncomeIncomeTax: number;
  residenceTaxIncomePortion: number; // 住民税所得割額 (housing loan差引後)
  incomeTaxRate: number;
  housingLoanCredit: number;
  donationLimit: number;
};

// 住民税用（万円→円）
const RES_DEP: Record<DetailedDependentKey, number> = {
  under16: 0,
  age16to18: 330_000,
  age19to22: 450_000, // 特定扶養
  age23to69: 330_000,
  age70coliving: 450_000, // 同居老親
  age70separate: 380_000,
};
const INC_DEP: Record<DetailedDependentKey, number> = {
  under16: 0,
  age16to18: 380_000,
  age19to22: 630_000,
  age23to69: 380_000,
  age70coliving: 580_000,
  age70separate: 480_000,
};
const RES_DIS: Record<DisabilityKey, number> = {
  general: 260_000,
  special: 300_000,
  cohabitingSpecial: 530_000,
};
const INC_DIS: Record<DisabilityKey, number> = {
  general: 270_000,
  special: 400_000,
  cohabitingSpecial: 750_000,
};
const RES_SPOUSE_UNDER70 = 330_000;
const RES_SPOUSE_OVER70 = 380_000;
const INC_SPOUSE_UNDER70 = 380_000;
const INC_SPOUSE_OVER70 = 480_000;
const RES_SINGLE_PARENT = 300_000;
const INC_SINGLE_PARENT = 350_000;
const RES_BASIC = 430_000;
// 配偶者控除は 配偶者の合計所得48万円以下 が原則。
// 給与収入103万円以下 (≒ 給与所得48万以下) をしきい値として判定する簡易実装。
const SPOUSE_INCOME_LIMIT = 1_030_000;

export function calcFurusatoNozeiDetailed(
  input: FurusatoDetailedInput
): FurusatoDetailedResult {
  const {
    annualIncome,
    spouseType,
    spouseIncome,
    dependents,
    disability,
    singleParent,
  } = input;

  if (!Number.isFinite(annualIncome) || annualIncome < 0) {
    throw new Error("年収が無効です");
  }

  const socialInsurance = Math.max(Math.floor(input.socialInsurance || 0), 0);
  const lifeInsurance = Math.max(Math.floor(input.lifeInsurance || 0), 0);
  const earthquakeInsurance = Math.max(
    Math.floor(input.earthquakeInsurance || 0),
    0
  );
  const medical = Math.max(Math.floor(input.medical || 0), 0);
  const housingLoanCredit = Math.max(
    Math.floor(input.housingLoanCredit || 0),
    0
  );

  const employmentDeduction = calcEmploymentDeduction(annualIncome);
  const employmentIncome = Math.max(annualIncome - employmentDeduction, 0);

  // 配偶者控除（給与収入103万円以下のときのみ適用）
  const spouseEligible =
    spouseType !== "none" && (spouseIncome || 0) <= SPOUSE_INCOME_LIMIT;
  const spouseDeductionResidence = spouseEligible
    ? spouseType === "over70"
      ? RES_SPOUSE_OVER70
      : RES_SPOUSE_UNDER70
    : 0;
  const spouseDeductionIncomeTax = spouseEligible
    ? spouseType === "over70"
      ? INC_SPOUSE_OVER70
      : INC_SPOUSE_UNDER70
    : 0;

  let dependentsDeductionResidence = 0;
  let dependentsDeductionIncomeTax = 0;
  (Object.keys(dependents) as DetailedDependentKey[]).forEach((k) => {
    const n = Math.max(Math.floor(dependents[k] || 0), 0);
    dependentsDeductionResidence += n * RES_DEP[k];
    dependentsDeductionIncomeTax += n * INC_DEP[k];
  });

  let disabilityDeductionResidence = 0;
  let disabilityDeductionIncomeTax = 0;
  (Object.keys(disability) as DisabilityKey[]).forEach((k) => {
    const n = Math.max(Math.floor(disability[k] || 0), 0);
    disabilityDeductionResidence += n * RES_DIS[k];
    disabilityDeductionIncomeTax += n * INC_DIS[k];
  });

  const singleParentDeductionResidence = singleParent ? RES_SINGLE_PARENT : 0;
  const singleParentDeductionIncomeTax = singleParent ? INC_SINGLE_PARENT : 0;

  const basicDeductionResidence = RES_BASIC;
  const basicDeductionIncomeTax = calcIncomeTaxBasicDeduction(employmentIncome);

  const totalDeductionResidence =
    basicDeductionResidence +
    socialInsurance +
    lifeInsurance +
    earthquakeInsurance +
    medical +
    spouseDeductionResidence +
    dependentsDeductionResidence +
    disabilityDeductionResidence +
    singleParentDeductionResidence;

  const totalDeductionIncomeTax =
    basicDeductionIncomeTax +
    socialInsurance +
    lifeInsurance +
    earthquakeInsurance +
    medical +
    spouseDeductionIncomeTax +
    dependentsDeductionIncomeTax +
    disabilityDeductionIncomeTax +
    singleParentDeductionIncomeTax;

  const taxableIncomeResidence = Math.max(
    employmentIncome - totalDeductionResidence,
    0
  );
  const taxableIncomeIncomeTax = Math.max(
    Math.floor((employmentIncome - totalDeductionIncomeTax) / 1000) * 1000,
    0
  );

  const rawResidencePortion = Math.floor(taxableIncomeResidence * 0.1);
  // 住宅ローン控除は住民税所得割からも一部控除される (簡易的に差し引く)
  const residenceTaxIncomePortion = Math.max(
    rawResidencePortion - housingLoanCredit,
    0
  );

  const rate = marginalIncomeTaxRate(taxableIncomeIncomeTax);
  const denom = 0.9 - rate * 1.021;
  const donationLimit =
    denom > 0
      ? Math.floor((residenceTaxIncomePortion * 0.2) / denom) + 2000
      : 0;

  return {
    annualIncome,
    employmentDeduction,
    employmentIncome,
    spouseDeductionResidence,
    spouseDeductionIncomeTax,
    dependentsDeductionResidence,
    dependentsDeductionIncomeTax,
    disabilityDeductionResidence,
    disabilityDeductionIncomeTax,
    singleParentDeductionResidence,
    singleParentDeductionIncomeTax,
    socialInsurance,
    lifeInsurance,
    earthquakeInsurance,
    medical,
    basicDeductionResidence,
    basicDeductionIncomeTax,
    totalDeductionResidence,
    totalDeductionIncomeTax,
    taxableIncomeResidence,
    taxableIncomeIncomeTax,
    residenceTaxIncomePortion,
    incomeTaxRate: rate,
    housingLoanCredit,
    donationLimit,
  };
}
