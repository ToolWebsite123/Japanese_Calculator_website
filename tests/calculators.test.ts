/**
 * Wave 1B calculator-correctness tests.
 * Run with: npm test  (tsx + node:test — no extra test framework dependency)
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateScientific,
  evaluateComplexExpression,
  containsImaginaryUnit,
  primeFactorize,
  formatPrimeFactors,
} from "../src/lib/calculators/scientific";
import {
  calcSocialInsurance,
  standardMonthlyForHealth,
  standardMonthlyForPension,
  standardBonusAmount,
} from "../src/lib/calculators/social-insurance";
import { getLongDivisionSteps } from "../src/lib/calculators/longDivision";
import { solveSimultaneousEquations } from "../src/lib/calculators/simultaneous-equations";
import {
  calcFurusatoNozeiDetailed,
  type FurusatoDetailedInput,
} from "../src/lib/calculators/furusato-nozei-detailed";
import { calculateUnemployment } from "../src/lib/calculators/unemployment-insurance";
import { calculateBmi, getBmiCategory } from "../src/lib/calculators/bmi";
import ja from "../src/lib/i18n/ja";

const approx = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps;

/* ---------------- H-04: trig in degree / radian modes ---------------- */

test("H-04: sin(90) in degree mode equals 1 (live bug: returned 計算エラー)", () => {
  const v = evaluateScientific("sin(90)", "deg");
  assert.equal(typeof v, "number");
  assert.ok(approx(v as number, 1));
});

test("H-04: cos(0) = 1, tan(45) = 1, sin(30) = 0.5 in degree mode", () => {
  assert.ok(approx(evaluateScientific("cos(0)", "deg") as number, 1));
  assert.ok(approx(evaluateScientific("tan(45)", "deg") as number, 1));
  assert.ok(approx(evaluateScientific("sin(30)", "deg") as number, 0.5));
});

test("H-04: sin(pi/2) = 1 in radian mode", () => {
  assert.ok(approx(evaluateScientific(`sin(${Math.PI / 2})`, "rad") as number, 1));
});

test("H-04 regression: sqrt(144) = 12 still works", () => {
  assert.ok(approx(evaluateScientific("sqrt(144)", "deg") as number, 12));
});

test("H-04: containsImaginaryUnit ignores the letter i inside function names", () => {
  assert.equal(containsImaginaryUnit("sin(90)"), false);
  assert.equal(containsImaginaryUnit("asin(0.5)"), false);
  assert.equal(containsImaginaryUnit("3i+2"), true);
});

/* ---------------- H-05: complex expressions ---------------- */

test("H-05: 3i+2 evaluates to 2+3i, imaginary part is never dropped", () => {
  const z = evaluateComplexExpression("3i+2", "deg");
  assert.equal(z.re, 2);
  assert.equal(z.im, 3);
  const viaMain = evaluateScientific("3i+2", "deg");
  assert.deepEqual(viaMain, { re: 2, im: 3 });
});

test("H-05: (1+2i)*(3-i) = 5+5i", () => {
  const z = evaluateComplexExpression("(1+2i)*(3-i)", "deg");
  assert.ok(approx(z.re, 5) && approx(z.im, 5));
});

test("H-05: trig of a complex argument throws a clear Japanese error", () => {
  assert.throws(() => evaluateComplexExpression("sin(1+2i)", "deg"), /対応していません/);
});

/* ---------------- H-03: social insurance (FY2026 / 令和8年度) ---------------- */

test("H-03: pension is capped by the 650,000 standard grade (salary 1,000,000 -> 59,475)", () => {
  const r = calcSocialInsurance({
    monthlySalary: 1_000_000,
    bonus: 0,
    age: 30,
    prefectureIndex: 12, // 東京都
  });
  assert.equal(r.standardMonthlyPension, 650_000);
  assert.equal(r.salaryPension, 59_475); // 650,000 x 18.3% / 2
});

test("H-03: employment insurance is the employee rate applied ONCE, never halved (300,000 -> 1,500)", () => {
  const r = calcSocialInsurance({
    monthlySalary: 300_000,
    bonus: 0,
    age: 30,
    prefectureIndex: 12,
  });
  assert.equal(r.salaryEmployment, 1_500); // 300,000 x 0.5%
  assert.equal(r.employmentRate, 0.005);
});

test("H-03: mid salary hand-checked (Tokyo, 300,000, age 30, no bonus)", () => {
  const r = calcSocialInsurance({
    monthlySalary: 300_000,
    bonus: 0,
    age: 30,
    prefectureIndex: 12,
  });
  assert.equal(r.standardMonthlyHealth, 300_000);
  assert.equal(r.salaryHealth, 14_775); // 300,000 x 9.85% (FY2026 Tokyo) / 2
  assert.equal(r.salaryPension, 27_450); // 300,000 x 18.3% / 2
  assert.equal(r.salaryChild, 345); // 300,000 x 0.23% / 2 (from Apr 2026)
  assert.equal(r.salaryCare, 0); // under 40
  assert.equal(r.totalDeduction, 14_775 + 27_450 + 1_500 + 345);
});

test("H-03: care insurance applies at 40-64 with the FY2026 rate 1.62%", () => {
  const r = calcSocialInsurance({
    monthlySalary: 300_000,
    bonus: 0,
    age: 45,
    prefectureIndex: 12,
  });
  assert.equal(r.salaryCare, 2_430); // 300,000 x 1.62% / 2
});

test("H-03: grade table lookups (floors, caps, pension band)", () => {
  assert.equal(standardMonthlyForHealth(295_000), 300_000);
  assert.equal(standardMonthlyForHealth(50_000), 58_000); // lowest grade
  assert.equal(standardMonthlyForHealth(2_000_000), 1_390_000); // health cap
  assert.equal(standardMonthlyForPension(50_000), 88_000); // pension floor
  assert.equal(standardMonthlyForPension(640_000), 650_000);
  assert.equal(standardBonusAmount(1_234_567, "health"), 1_234_000); // 1,000 yen truncation
  assert.equal(standardBonusAmount(2_000_000, "pension"), 1_500_000); // pension bonus cap
});

/* ---------------- M-01: long division ---------------- */

test("M-01: 7 / 2 -> q 3, r 1", () => {
  const r = getLongDivisionSteps(7, 2, 2);
  assert.equal(r.quotient, 3);
  assert.equal(r.remainder, 1);
});

test("M-01: -7 / 2 -> q -3, r -1 (truncated division keeps the identity)", () => {
  const r = getLongDivisionSteps(-7, 2, 2);
  assert.equal(r.quotient, -3);
  assert.equal(r.remainder, -1);
  assert.equal(r.quotient * 2 + r.remainder, -7);
});

/* ---------------- M-02: simultaneous equations ---------------- */

test("M-02: contradictory system 0=0, 0=5 reports no solution (was: infinite)", () => {
  assert.equal(solveSimultaneousEquations(0, 0, 0, 0, 0, 5).status, "no_solution");
});

test("M-02: 0=0, 0=0 reports infinitely many solutions", () => {
  assert.equal(solveSimultaneousEquations(0, 0, 0, 0, 0, 0).status, "infinite");
});

test("M-02: proportional rows are infinite, parallel inconsistent rows are no_solution", () => {
  assert.equal(solveSimultaneousEquations(1, 1, 2, 2, 2, 4).status, "infinite");
  assert.equal(solveSimultaneousEquations(1, 1, 2, 2, 2, 5).status, "no_solution");
});

test("M-02: normal system 2x+3y=8, x-y=1 -> x=2.2, y=1.2", () => {
  const r = solveSimultaneousEquations(2, 3, 8, 1, -1, 1);
  assert.equal(r.status, "success");
  if (r.status === "success") {
    assert.ok(approx(r.x, 2.2) && approx(r.y, 1.2));
  }
});

/* ---------------- M-03: furusato detailed ---------------- */

function furusatoInput(overrides: Partial<FurusatoDetailedInput>): FurusatoDetailedInput {
  return {
    annualIncome: 5_000_000,
    spouseType: "under70",
    spouseIncome: 0,
    dependents: {
      under16: 0,
      age16to18: 0,
      age19to22: 0,
      age23to69: 0,
      age70coliving: 0,
      age70separate: 0,
    },
    disability: { general: 0, special: 0, cohabitingSpecial: 0 },
    socialInsurance: 0,
    lifeInsurance: 0,
    earthquakeInsurance: 0,
    medical: 0,
    singleParent: false,
    housingLoanCredit: 0,
    ...overrides,
  };
}

test("M-03: spouse salary 1,150,000 (between old 1,030,000 and 2025 limit 1,230,000) gets the spouse deduction", () => {
  const r = calcFurusatoNozeiDetailed(furusatoInput({ spouseIncome: 1_150_000 }));
  assert.equal(r.spouseDeductionIncomeTax, 380_000);
  assert.equal(r.spouseDeductionResidence, 330_000);
});

test("M-03: spouse salary 1,240,000 (above the 2025 limit) gets no spouse deduction", () => {
  const r = calcFurusatoNozeiDetailed(furusatoInput({ spouseIncome: 1_240_000 }));
  assert.equal(r.spouseDeductionIncomeTax, 0);
  assert.equal(r.spouseDeductionResidence, 0);
});

test("M-03: life / earthquake insurance deductions are capped at the statutory maxima", () => {
  const r = calcFurusatoNozeiDetailed(
    furusatoInput({ lifeInsurance: 200_000, earthquakeInsurance: 80_000 }),
  );
  assert.equal(r.lifeInsurance, 120_000); // income-tax cap
  assert.equal(r.lifeInsuranceResidence, 70_000); // residence-tax cap
  assert.equal(r.earthquakeInsurance, 50_000); // income-tax cap
  assert.equal(r.earthquakeInsuranceResidence, 25_000); // residence-tax cap
});

/* ---------------- M-04: unemployment insurance (Aug 2026 tables) ---------------- */

test("M-04: zero wages give zero benefit, not a clamped-up minimum", () => {
  const r = calculateUnemployment({
    sixMonthWageTotal: 0,
    age: "30-34",
    tenure: "1-5",
    reason: "company",
  });
  assert.equal(r.benefitDaily, 0);
  assert.equal(r.totalBenefit, 0);
  assert.equal(r.monthlyBenefit, 0);
  assert.equal(r.benefitRate, 0);
});

test("M-04: standard case matches the Aug-2026 formula; rate is derived from the clamped benefit", () => {
  // 300,000/month x 6 = 1,800,000 -> wageDaily 10,000
  // y = 0.8*10000 - 0.3*((10000-5480)/8010)*10000 = 6307.11 -> 6307 (within 2,562..8,270)
  const r = calculateUnemployment({
    sixMonthWageTotal: 1_800_000,
    age: "30-34",
    tenure: "5-10",
    reason: "company",
  });
  assert.equal(r.wageDaily, 10_000);
  assert.equal(r.benefitDaily, 6_307);
  assert.ok(approx(r.benefitRate, 6_307 / 10_000, 1e-12));
  assert.equal(r.monthlyBenefit, 6_307 * 28); // 28-day certification cycle
  assert.equal(r.totalBenefit, 6_307 * r.prescribedDays);
});

test("M-04: senior (60-64) sliding formula uses the lower of the two Aug-2026 expressions", () => {
  // wageDaily 10,000: y1 = 8000 - 0.35*((10000-5480)/6640)*10000 = 5617.47
  //                   y2 = 0.05*10000 + 4848 = 5348 -> benefit 5,348
  const r = calculateUnemployment({
    sixMonthWageTotal: 1_800_000,
    age: "60-64",
    tenure: "10-20",
    reason: "company",
  });
  assert.equal(r.benefitDaily, 5_348);
});

/* ---------------- M-05: factorization cap ---------------- */

test("M-05: 12 -> 2^2 x 3 (unchanged)", () => {
  assert.deepEqual(primeFactorize(12), [
    { prime: 2, exponent: 2 },
    { prime: 3, exponent: 1 },
  ]);
  assert.equal(formatPrimeFactors(primeFactorize(12)), "2² × 3");
});

test("M-05: a large prime near the 1e12 cap returns promptly as itself", () => {
  const started = Date.now();
  const factors = primeFactorize(999_999_999_989);
  assert.ok(Date.now() - started < 5_000, "factorization must not hang");
  assert.equal(factors.length, 1);
  assert.equal(factors[0].prime, 999_999_999_989);
});

test("M-05: inputs above the cap throw the controlled Japanese message", () => {
  assert.throws(() => primeFactorize(2_000_000_000_000), /素因数分解は1より大きく/);
});

/* ---------------- BMI: core + Step A result upgrade ---------------- */

test("BMI: 170cm/65kg -> 22.49, normal, ideal 63.58kg", () => {
  const r = calculateBmi(170, 65);
  assert.equal(r.bmi, 22.49);
  assert.equal(r.category, "normal");
  assert.equal(r.idealWeight, 63.58);
  assert.ok(approx(r.weightDiff, 1.42));
});

test("BMI: category boundaries follow the Japan Society table", () => {
  assert.equal(getBmiCategory(18.49), "underweight");
  assert.equal(getBmiCategory(18.5), "normal");
  assert.equal(getBmiCategory(24.99), "normal");
  assert.equal(getBmiCategory(25), "obese1");
  assert.equal(getBmiCategory(30), "obese2");
  assert.equal(getBmiCategory(35), "obese3");
  assert.equal(getBmiCategory(40), "obese4");
});

test("BMI Step A: healthy range and variant weights for 160cm/55kg", () => {
  const r = calculateBmi(160, 55);
  // height^2 = 2.56; range = BMI 18.5..24.9, variants = BMI 20 / 18 / 17
  assert.ok(approx(r.healthyWeightMin, 47.36));
  assert.ok(approx(r.healthyWeightMax, 63.74));
  assert.ok(approx(r.beautyWeight, 51.2));
  assert.ok(approx(r.cinderellaWeight, 46.08));
  assert.ok(approx(r.modelWeight, 43.52));
  // diffs use the weightDiff convention: current weight minus target weight
  assert.ok(approx(r.beautyDiff, 3.8));
  assert.ok(approx(r.cinderellaDiff, 8.92));
  assert.ok(approx(r.modelDiff, 11.48));
});

test("BMI Step A: variant weights scale with height^2 (150cm)", () => {
  const r = calculateBmi(150, 45);
  assert.ok(approx(r.beautyWeight, 45.0));
  assert.ok(approx(r.cinderellaWeight, 40.5));
  assert.ok(approx(r.modelWeight, 38.25));
  assert.ok(approx(r.healthyWeightMin, 41.63));
  assert.ok(approx(r.healthyWeightMax, 56.03));
});

test("BMI: invalid inputs throw the controlled Japanese messages", () => {
  assert.throws(() => calculateBmi(0, 60), /身長が無効です/);
  assert.throws(() => calculateBmi(170, 0), /体重が無効です/);
  assert.throws(() => calculateBmi(Number.NaN, 60), /身長が無効です/);
});

/* ---------------- BMI Step B: WHO table + quick-lookup matrix ---------------- */

test("BMI Step B: matrix cells match the BMI formula (1 decimal, half-up)", () => {
  const { head, rows } = ja.bmiPage.guideMatrix;
  const cell = (heightLabel: string, weightLabel: string) => {
    const row = rows.find((r) => r[0] === heightLabel);
    assert.ok(row, `row ${heightLabel} exists`);
    const col = head.indexOf(weightLabel);
    assert.ok(col > 0, `column ${weightLabel} exists`);
    return row[col];
  };
  assert.equal(cell("170cm", "65kg"), "22.5");
  assert.equal(cell("160cm", "55kg"), "21.5");
  assert.equal(cell("180cm", "100kg"), "30.9");
  assert.equal(cell("140cm", "40kg"), "20.4");
  assert.equal(cell("190cm", "90kg"), "24.9");
  assert.equal(rows.length, 11);
  for (const row of rows) assert.equal(row.length, head.length);
});

test("BMI Step B: WHO classification table has the 8 WHO bands", () => {
  const { whoRows } = ja.bmiPage.guideFormula;
  assert.equal(whoRows.length, 8);
  assert.deepEqual(whoRows[3], ["18.50～24.99", "普通体重"]);
  assert.deepEqual(whoRows[7], ["40.00以上", "肥満（3度）"]);
});
