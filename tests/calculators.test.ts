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
import {
  computeLongDivision,
  getLongDivisionSteps,
} from "../src/lib/calculators/longDivision";
import { calculateRoot, simplifySquareRoot } from "../src/lib/calculators/root";
import {
  buildDueDateResult,
  calcFromIvf,
  diffDays,
  formatDate,
  parseDate,
} from "../src/lib/calculators/due-date";
import {
  calcFurusatoNozei,
  remainingDonationRoom,
} from "../src/lib/calculators/furusato-nozei";
import { solveSimultaneousEquations } from "../src/lib/calculators/simultaneous-equations";
import {
  calcForward,
  calcRateFromPrices,
  calcReverse,
} from "../src/lib/calculators/discount-calc";
import {
  decimalToFraction,
  formatFraction,
  getFractionSteps,
  operateFractions,
} from "../src/lib/calculators/fraction";
import {
  evaluateExpressionSafe,
  solveLinearEquationSafe,
} from "../src/lib/calculators/algebra";
import { simplifyExpression } from "../src/lib/calculators/polynomial";
import { convertToAllUnits, convertUnit, getUnits } from "../src/lib/calculators/units";
import { buildFu, calcMahjong } from "../src/lib/calculators/mahjong";
import {
  eraDateToWestern,
  eraToWestern,
  westernDateToEra,
  westernToEra,
  westernToEras,
  zodiacOf,
} from "../src/lib/calculators/era";
import {
  factorizeExpression,
  primeFactorSteps,
} from "../src/lib/calculators/factorize";
import {
  cramerNumerators3,
  eliminationSteps,
  solveExactFractions,
  solveSimultaneous3,
  solveSimultaneousEquations,
} from "../src/lib/calculators/simultaneous-equations";
import {
  solveTimeValueOfMoney,
  tvmFutureValue,
} from "../src/lib/calculators/financial";
import { calculateLoan } from "../src/lib/calculators/loan";
import { calcCompoundInterest } from "../src/lib/calculators/compound-interest";
import { calcInterest, withholdingTax } from "../src/lib/calculators/interest";
import { calcSocialInsurance } from "../src/lib/calculators/social-insurance";
import { calculateUnemployment } from "../src/lib/calculators/unemployment-insurance";
import { calcFromTaxExcluded, calcFromTaxIncluded } from "../src/lib/calculators/consumption-tax";
import { calcIncomeTax, calcEmploymentDeduction, calcBasicDeduction } from "../src/lib/calculators/income-tax";
import { calcFurusatoNozeiDetailed } from "../src/lib/calculators/furusato-nozei-detailed";
import {
  calcFurusatoNozeiDetailed,
  type FurusatoDetailedInput,
} from "../src/lib/calculators/furusato-nozei-detailed";
import { calculateUnemployment } from "../src/lib/calculators/unemployment-insurance";
import { calcFromTaxExcluded, calcFromTaxIncluded } from "../src/lib/calculators/consumption-tax";
import { calcIncomeTax, calcEmploymentDeduction, calcBasicDeduction } from "../src/lib/calculators/income-tax";
import { calcFurusatoNozeiDetailed } from "../src/lib/calculators/furusato-nozei-detailed";
import {
  calculateBmi,
  getBmiCategory,
  getAgeTargetRange,
  estimateBodyFatPercent,
} from "../src/lib/calculators/bmi";
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

/* ------------- Scientific upgrade: true n-th root (y√) + custom-base log (logₐ) ------------- */

test("SCI-UP: n-th root — 27 y√ 3 = 3, 16 y√ 2 = 4, 32 y√ 5 = 2", () => {
  assert.ok(approx(evaluateScientific("27 y√ 3", "deg") as number, 3));
  assert.ok(approx(evaluateScientific("16 y√ 2", "deg") as number, 4));
  assert.ok(approx(evaluateScientific("32 y√ 5", "deg") as number, 2));
});

test("SCI-UP: odd root of a negative number is real — -8 y√ 3 = -2", () => {
  assert.ok(approx(evaluateScientific("-8 y√ 3", "deg") as number, -2));
});

test("SCI-UP: even root of a negative number and 0-degree root throw", () => {
  assert.throws(() => evaluateScientific("-16 y√ 2", "deg"));
  assert.throws(() => evaluateScientific("27 y√ 0", "deg"));
});

test("SCI-UP: custom-base log — 2 logₐ 8 = 3, 10 logₐ 1000 = 3", () => {
  assert.ok(approx(evaluateScientific("2 logₐ 8", "deg") as number, 3));
  assert.ok(approx(evaluateScientific("10 logₐ 1000", "deg") as number, 3));
});

test("SCI-UP: custom-base log rejects invalid base and value", () => {
  assert.throws(() => evaluateScientific("1 logₐ 8", "deg"));
  assert.throws(() => evaluateScientific("0 logₐ 8", "deg"));
  assert.throws(() => evaluateScientific("2 logₐ -8", "deg"));
  assert.throws(() => evaluateScientific("2 logₐ 0", "deg"));
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

/* ---------------- #6: full 筆算 engine (computeLongDivision) ---------------- */

test("LD-01: 1234 / 7 layout rows are the schoolbook ones (12, 53, 44)", () => {
  const r = computeLongDivision(1234, 7, 4);
  const intRows = r.rows.filter((row) => !row.isDecimalStep);
  assert.deepEqual(
    intRows.map((row) => row.partialDividend),
    [12, 53, 44],
  );
  assert.deepEqual(
    intRows.map((row) => row.product),
    [7, 49, 42],
  );
  assert.equal(r.quotientInteger, "176");
  assert.equal(r.remainder, "2");
  assert.equal(r.decimalDigits, "2857");
  assert.equal(r.cycleStart, null); // cycle not provable within 4 places
  assert.equal(r.roundedDecimal, "176.2857");
});

test("LD-02: 1234 / 7 with 10 places detects the repeating cycle 285714", () => {
  const r = computeLongDivision(1234, 7, 10);
  assert.equal(r.cycleStart, 0);
  assert.equal(r.decimalDisplay, "176.(285714)");
  assert.equal(r.terminates, false);
});

test("LD-03: 100 / 7 -> q 14 r 2, rows 10 and 30", () => {
  const r = computeLongDivision(100, 7, 2);
  const intRows = r.rows.filter((row) => !row.isDecimalStep);
  assert.deepEqual(
    intRows.map((row) => row.partialDividend),
    [10, 30],
  );
  assert.equal(r.quotientInteger, "14");
  assert.equal(r.remainder, "2");
  assert.equal(r.decimalDisplay, "14.28");
  assert.equal(r.roundedDecimal, "14.29");
});

test("LD-04: 25 / 4 terminates at 6.25", () => {
  const r = computeLongDivision(25, 4, 4);
  assert.equal(r.quotientInteger, "6");
  assert.equal(r.remainder, "1");
  assert.equal(r.terminates, true);
  assert.equal(r.decimalDisplay, "6.25");
  assert.equal(r.roundedDecimal, "6.25");
});

test("LD-05: decimal inputs are scaled (12.5 / 2.5 = 5 exactly)", () => {
  const r = computeLongDivision(12.5, 2.5, 4);
  assert.equal(r.scaledDividend, 125);
  assert.equal(r.scaledDivisor, 25);
  assert.equal(r.quotientInteger, "5");
  assert.equal(r.remainder, "0");
  assert.equal(r.decimalDisplay, "5");
});

test("LD-06: -7 / 2 keeps truncated signs (q -3, r -1, decimal -3.5)", () => {
  const r = computeLongDivision(-7, 2, 2);
  assert.equal(r.quotientInteger, "-3");
  assert.equal(r.remainder, "-1");
  assert.equal(r.decimalDisplay, "-3.5");
  assert.equal(Number(r.quotientInteger) * 2 + Number(r.remainder), -7);
});

test("LD-07: 3 / 7 has no integer rows, quotient 0, digits 428", () => {
  const r = computeLongDivision(3, 7, 3);
  assert.equal(r.rows.filter((row) => !row.isDecimalStep).length, 0);
  assert.equal(r.quotientInteger, "0");
  assert.equal(r.remainder, "3");
  assert.equal(r.decimalDigits, "428");
  assert.equal(r.roundedDecimal, "0.429");
});

test("LD-08: 612 / 3 includes the zero quotient digit (204)", () => {
  const r = computeLongDivision(612, 3, 0);
  assert.deepEqual(
    r.rows.map((row) => row.quotientDigit),
    [2, 0, 4],
  );
  assert.equal(r.quotientInteger, "204");
  assert.equal(r.remainder, "0");
});

test("LD-09: decimalPlaces 0 stops at the remainder", () => {
  const r = computeLongDivision(100, 7, 0);
  assert.equal(r.decimalDigits, "");
  assert.equal(r.decimalDisplay, "14");
  assert.equal(r.remainder, "2");
});

test("LD-10: invalid inputs throw", () => {
  assert.throws(() => computeLongDivision(10, 0, 2));
  assert.throws(() => computeLongDivision(10, 3, -1));
  assert.throws(() => computeLongDivision(10, 3, 99));
  assert.throws(() => computeLongDivision(Number.NaN, 3, 2));
});

/* ---------------- #7: discount （割引計算） ---------------- */

test("DC-01: 10,000 yen at 30% off, tax-excluded 10%, floor -> 7,700 total", () => {
  const r = calcForward({
    original: 10000,
    discountValue: 30,
    discountUnit: "percent",
    taxMode: "excluded",
    taxRate: 0.1,
    round: "floor",
  });
  assert.equal(r.discountAmount, 3000);
  assert.equal(r.discountedBase, 7000);
  assert.equal(r.taxAmount, 700);
  assert.equal(r.finalPrice, 7700);
  assert.equal(r.effectiveRate, 0.3);
});

test("DC-02: float dust cannot steal a yen (170 yen, 70% off, floor)", () => {
  // 170 * 0.7 is 118.99999999999999 in binary float; exact value is 119.
  const r = calcForward({
    original: 170,
    discountValue: 70,
    discountUnit: "percent",
    taxMode: "none",
    taxRate: 0.1,
    round: "floor",
  });
  assert.equal(r.discountAmount, 119);
  assert.equal(r.finalPrice, 51);
});

test("DC-03: float dust cannot steal a yen (165 yen, 70% off, round half-up)", () => {
  // 165 * 0.7 = 115.49999999999999 in float; exact 115.5 rounds to 116.
  const r = calcForward({
    original: 165,
    discountValue: 70,
    discountUnit: "percent",
    taxMode: "none",
    taxRate: 0.1,
    round: "round",
  });
  assert.equal(r.discountAmount, 116);
});

test("DC-04: wari unit — 3割引 of 10,000 is 7,000", () => {
  const r = calcForward({
    original: 10000,
    discountValue: 3,
    discountUnit: "wari",
    taxMode: "included",
    taxRate: 0.1,
    round: "floor",
  });
  assert.equal(r.finalPrice, 7000);
  assert.equal(r.wariEquivalent, 3);
});

test("DC-05: stacked discount 20% + 10% is 28% off, not 30%", () => {
  const r = calcForward({
    original: 10000,
    discountValue: 20,
    discountUnit: "percent",
    secondValue: 10,
    secondUnit: "percent",
    taxMode: "none",
    taxRate: 0.1,
    round: "floor",
  });
  assert.equal(r.discountAmount, 2000);
  assert.equal(r.secondDiscountAmount, 800);
  assert.equal(r.discountedBase, 7200);
  assert.equal(r.effectiveRate, 0.28);
});

test("DC-06: reverse — 7,000 yen after 30% off came from 10,000", () => {
  const r = calcReverse({
    discountedPrice: 7000,
    discountValue: 30,
    discountUnit: "percent",
    round: "floor",
  });
  assert.equal(r.originalPrice, 10000);
  assert.equal(r.discountAmount, 3000);
});

test("DC-07: rate from prices — 10,000 -> 7,000 is 30% (3割)", () => {
  const r = calcRateFromPrices(10000, 7000);
  assert.equal(r.discountAmount, 3000);
  assert.equal(r.ratePercent, 30);
  assert.equal(r.rateWari, 3);
});

test("DC-08: rate from prices — 3,980 -> 2,786 is 30%", () => {
  const r = calcRateFromPrices(3980, 2786);
  assert.equal(r.ratePercent, 30);
  assert.equal(r.rateWari, 3);
});

/* ---------------- #8: fraction （分数計算） ---------------- */

test("FR-01: 1/2 + 1/3 = 5/6 (through common denominator 6)", () => {
  const r = operateFractions({ num: 1, den: 2 }, { num: 1, den: 3 }, "+");
  assert.deepEqual(r, { num: 5, den: 6 });
});

test("FR-02: 2/3 x 3/4 reduces to 1/2", () => {
  const r = operateFractions({ num: 2, den: 3 }, { num: 3, den: 4 }, "*");
  assert.deepEqual(r, { num: 1, den: 2 });
});

test("FR-03: mixed numbers 1 1/2 + 2 1/3 = 23/6, formatted 3 5/6", () => {
  const r = operateFractions(
    { whole: 1, num: 1, den: 2 },
    { whole: 2, num: 1, den: 3 },
    "+",
  );
  assert.deepEqual(r, { num: 23, den: 6 });
  assert.equal(formatFraction(r), "3 5/6");
});

test("FR-04: division flips the divisor: 3/4 / 2/5 = 15/8", () => {
  const r = operateFractions({ num: 3, den: 4 }, { num: 2, den: 5 }, "/");
  assert.deepEqual(r, { num: 15, den: 8 });
});

test("FR-05: steps end at the same result and mention the LCD", () => {
  const { steps, finalResult } = getFractionSteps(
    { num: 1, den: 2 },
    { num: 1, den: 3 },
    "+",
  );
  assert.deepEqual(finalResult, { num: 5, den: 6 });
  assert.ok(steps.length >= 3);
});

test("FR-06: decimalToFraction is exact for typed decimals", () => {
  assert.deepEqual(decimalToFraction("0.75").fraction, { num: 3, den: 4 });
  assert.deepEqual(decimalToFraction("0.75").unreduced, { num: 75, den: 100 });
  assert.deepEqual(decimalToFraction("1.25").fraction, { num: 5, den: 4 });
  assert.deepEqual(decimalToFraction("0.333").fraction, { num: 333, den: 1000 });
  assert.deepEqual(decimalToFraction("2.5").fraction, { num: 5, den: 2 });
  assert.deepEqual(decimalToFraction("0.1").fraction, { num: 1, den: 10 });
  assert.deepEqual(decimalToFraction("-0.5").fraction, { num: -1, den: 2 });
});

test("FR-07: invalid fraction inputs throw", () => {
  assert.throws(() => operateFractions({ num: 1, den: 2 }, { num: 0, den: 5 }, "/"));
  assert.throws(() => decimalToFraction("abc"));
  assert.throws(() => decimalToFraction("1.2.3"));
  assert.throws(() => decimalToFraction(""));
});

test("DC-09: invalid discount inputs throw", () => {
  assert.throws(() =>
    calcForward({
      original: 1000,
      discountValue: 120,
      discountUnit: "percent",
      taxMode: "none",
      taxRate: 0.1,
      round: "floor",
    }),
  );
  assert.throws(() => calcRateFromPrices(1000, 1200));
  assert.throws(() => calcRateFromPrices(0, 0));
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

/* ---------------- BMI Step C: age target range + body-fat estimate ---------------- */

test("BMI Step C: age target ranges follow the MHLW 2025 bands", () => {
  assert.equal(getAgeTargetRange(17), null);
  assert.deepEqual(getAgeTargetRange(18), { min: 18.5, max: 24.9 });
  assert.deepEqual(getAgeTargetRange(49), { min: 18.5, max: 24.9 });
  assert.deepEqual(getAgeTargetRange(50), { min: 20.0, max: 24.9 });
  assert.deepEqual(getAgeTargetRange(64), { min: 20.0, max: 24.9 });
  assert.deepEqual(getAgeTargetRange(65), { min: 21.5, max: 24.9 });
  assert.deepEqual(getAgeTargetRange(75), { min: 21.5, max: 24.9 });
  assert.deepEqual(getAgeTargetRange(100), { min: 21.5, max: 24.9 });
});

test("BMI Step C: Deurenberg body-fat estimate (BMI 21.48, age 60)", () => {
  assert.ok(approx(estimateBodyFatPercent(21.48, 60, "female"), 34.2, 1e-9));
  assert.ok(approx(estimateBodyFatPercent(21.48, 60, "male"), 23.4, 1e-9));
  assert.ok(approx(estimateBodyFatPercent(22.49, 30, "male"), 17.7, 1e-9));
  // the estimate never goes below zero
  assert.equal(estimateBodyFatPercent(10, 18, "male"), 0);
});

import {
  taxIncluded,
  taxExcluded,
  sqrtValue,
} from "../src/lib/calculators/desk-features";

test("Step A: desk tax buttons — taxIncluded at 10% and 8%", () => {
  assert.equal(taxIncluded(1000, 10), 1100);
  assert.equal(taxIncluded(1000, 8), 1080);
  assert.equal(taxIncluded(2980, 10), 3278);
  // half-up to whole yen: 1985 * 1.1 = 2183.5 -> 2184
  assert.equal(taxIncluded(1985, 10), 2184);
  assert.equal(taxIncluded(0, 10), 0);
});

test("Step A: desk tax buttons — taxExcluded at 10% and 8%", () => {
  assert.equal(taxExcluded(1100, 10), 1000);
  assert.equal(taxExcluded(3300, 10), 3000);
  // the classic float trap: 1080 / 1.08 must be exactly 1000
  assert.equal(taxExcluded(1080, 8), 1000);
  // 2184 / 1.1 = 1985.4545… -> 1985
  assert.equal(taxExcluded(2184, 10), 1985);
});

test("Step A: desk sqrt key", () => {
  assert.equal(sqrtValue(529), 23);
  assert.equal(sqrtValue(0), 0);
  const r = sqrtValue(2);
  assert.ok(r !== null && Math.abs(r - 1.41421356237) < 1e-11);
  assert.equal(sqrtValue(-4), null);
});

/* ---------------- Compound interest + monthly contribution ---------------- */
import { calcCompoundInterest } from "../src/lib/calculators/compound-interest";
import { calcInterest, withholdingTax } from "../src/lib/calculators/interest";
import { calcSocialInsurance } from "../src/lib/calculators/social-insurance";
import { calculateUnemployment } from "../src/lib/calculators/unemployment-insurance";
import { calcFromTaxExcluded, calcFromTaxIncluded } from "../src/lib/calculators/consumption-tax";
import { calcIncomeTax, calcEmploymentDeduction, calcBasicDeduction } from "../src/lib/calculators/income-tax";
import { calcFurusatoNozeiDetailed } from "../src/lib/calculators/furusato-nozei-detailed";

test("Compound: no contribution matches the legacy formula exactly", () => {
  const r = calcCompoundInterest({ principal: 1000000, annualRatePercent: 5, years: 10, frequency: 1 });
  assert.ok(approx(r.futureValue, 1000000 * Math.pow(1.05, 10), 1e-6));
  assert.equal(r.contributionFutureValue, 0);
  assert.equal(r.totalContributions, 1000000);
  assert.ok(approx(r.totalInterest, r.futureValue - 1000000, 1e-6));
});

test("Compound: draft example — 30,000/month, 3%, 20 years ≈ 9.85M yen", () => {
  const r = calcCompoundInterest({
    principal: 0,
    annualRatePercent: 3,
    years: 20,
    frequency: 12,
    monthlyContribution: 30000,
  });
  assert.equal(r.totalContributions, 7200000);
  assert.ok(r.futureValue > 9840000 && r.futureValue < 9860000, `FV was ${r.futureValue}`);
  assert.ok(approx(r.totalInterest, r.futureValue - 7200000, 1e-6));
});

test("Compound: zero rate with contribution is a plain sum", () => {
  const r = calcCompoundInterest({
    principal: 100000,
    annualRatePercent: 0,
    years: 5,
    frequency: 12,
    monthlyContribution: 10000,
  });
  assert.equal(r.futureValue, 100000 + 10000 * 60);
  assert.equal(r.totalInterest, 0);
});

test("Compound: yearly projection's last row equals the totals", () => {
  const r = calcCompoundInterest({
    principal: 500000,
    annualRatePercent: 4,
    years: 7,
    frequency: 12,
    monthlyContribution: 20000,
  });
  assert.equal(r.yearly.length, 7);
  const last = r.yearly[r.yearly.length - 1];
  assert.ok(approx(last.futureValue, r.futureValue, 1e-6));
  assert.ok(approx(last.contributed, r.totalContributions, 1e-6));
});

/* ------------- Square root simplification (F1, 2026-10-31) ------------- */

test("ROOT-SIMPLIFY: 72 -> 6√2, 12 -> 2√3, 18 -> 3√2, 50 -> 5√2, 200 -> 10√2, 8 -> 2√2", () => {
  assert.deepEqual(simplifySquareRoot(72), { coefficient: 6, remaining: 2 });
  assert.deepEqual(simplifySquareRoot(12), { coefficient: 2, remaining: 3 });
  assert.deepEqual(simplifySquareRoot(18), { coefficient: 3, remaining: 2 });
  assert.deepEqual(simplifySquareRoot(50), { coefficient: 5, remaining: 2 });
  assert.deepEqual(simplifySquareRoot(200), { coefficient: 10, remaining: 2 });
  assert.deepEqual(simplifySquareRoot(8), { coefficient: 2, remaining: 2 });
});

test("ROOT-SIMPLIFY: no simplification for primes, perfect squares, small, decimal, negative", () => {
  assert.equal(simplifySquareRoot(7), null);
  assert.equal(simplifySquareRoot(2), null);
  assert.equal(simplifySquareRoot(3), null);
  assert.equal(simplifySquareRoot(144), null);
  assert.equal(simplifySquareRoot(4), null);
  assert.equal(simplifySquareRoot(1), null);
  assert.equal(simplifySquareRoot(0), null);
  assert.equal(simplifySquareRoot(4.5), null);
  assert.equal(simplifySquareRoot(-8), null);
});

test("ROOT-SIMPLIFY: calculateRoot exposes simplifiedText only for square mode", () => {
  const r72 = calculateRoot(72, 2, "square");
  assert.equal(r72.simplifiedText, "6√2");
  assert.equal(r72.isExact, false);
  const r144 = calculateRoot(144, 2, "square");
  assert.equal(r144.simplifiedText, undefined);
  assert.equal(r144.isExact, true);
  const r2 = calculateRoot(2, 2, "square");
  assert.equal(r2.simplifiedText, undefined);
  const cube = calculateRoot(72, 3, "nth");
  assert.equal(cube.simplifiedText, undefined);
});

test("ROOT-SIMPLIFY: simplified value still equals the numeric root", () => {
  for (const n of [72, 12, 18, 50, 200, 8, 98, 27 * 2]) {
    const s = simplifySquareRoot(n);
    assert.ok(s, `expected simplification for ${n}`);
    const rebuilt = s.coefficient * Math.sqrt(s.remaining);
    assert.ok(Math.abs(rebuilt - Math.sqrt(n)) < 1e-12, `mismatch for ${n}`);
  }
});

/* ------------- Due date: IVF mode + milestones + days remaining (2026-10-31) ------------- */

test("DUE-IVF: blastocyst (day-5) transfer 2026-10-31 -> due 2027-07-19 (competitor-verified)", () => {
  const transfer = parseDate("2026-10-31");
  assert.ok(transfer);
  const due = calcFromIvf(transfer, 5);
  assert.ok(formatDate(due).startsWith("2027年7月19日"), formatDate(due));
  assert.equal(diffDays(transfer, due), 261);
});

test("DUE-IVF: day-3 embryo -> +263 days, day-2 embryo -> +264 days", () => {
  const transfer = parseDate("2026-10-31");
  assert.ok(transfer);
  assert.equal(diffDays(transfer, calcFromIvf(transfer, 3)), 263);
  assert.equal(diffDays(transfer, calcFromIvf(transfer, 2)), 264);
});

test("DUE-IVF: invalid embryo age throws a Japanese error", () => {
  const transfer = parseDate("2026-10-31");
  assert.ok(transfer);
  // @ts-expect-error deliberately invalid embryo age
  assert.throws(() => calcFromIvf(transfer, 4), /胚の種類/);
});

test("DUE-RESULT: milestones are dated from the derived LMP and daysRemaining is exact", () => {
  const due = parseDate("2027-07-19");
  const today = parseDate("2026-10-31");
  assert.ok(due && today);
  const r = buildDueDateResult(due, today);
  assert.equal(r.daysRemaining, 261);
  assert.equal(r.milestones.length, 5);
  // LMP = due - 280 = 2026-10-12; first milestone = LMP + 35 = 2026-11-16
  assert.ok(formatDate(r.milestones[0].date).startsWith("2026年11月16日"), formatDate(r.milestones[0].date));
  // last milestone (37w0d) equals the safe-window start
  assert.equal(r.milestones[4].date.getTime(), r.safeWindowStart.getTime());
});

/* ------------- Furusato nozei: SI=0 fix + anchor + remaining room (2026-10-31) ------------- */

const NO_DEPS = { under16: 0, age16to18: 0, age19to22: 0, age23plus: 0, age70plus: 0 };

test("FURUSATO: anchor — ¥6,000,000 single, SI estimated 15% -> limit ¥77,949", () => {
  const r = calcFurusatoNozei({ annualIncome: 6_000_000, hasSpouse: false, dependents: NO_DEPS });
  assert.equal(r.donationLimit, 77949);
  assert.equal(r.socialInsurance, 900000);
});

test("FURUSATO: an explicit social insurance of ¥0 is honoured, not replaced by the estimate", () => {
  const r = calcFurusatoNozei({
    annualIncome: 6_000_000,
    hasSpouse: false,
    dependents: NO_DEPS,
    socialInsurance: 0,
  });
  assert.equal(r.socialInsurance, 0);
  assert.equal(r.donationLimit, 114963);
});

test("FURUSATO: remainingDonationRoom subtracts donations and floors at 0", () => {
  assert.equal(remainingDonationRoom(77949, 30000), 47949);
  assert.equal(remainingDonationRoom(77949, 100000), 0);
  assert.equal(remainingDonationRoom(77949, 0), 77949);
});

test("FURUSATO: expanded table anchors — ¥2,000,000 single and spouse+2 university students", () => {
  const low = calcFurusatoNozei({ annualIncome: 2_000_000, hasSpouse: false, dependents: NO_DEPS });
  assert.equal(low.donationLimit, 15899);
  const uni2 = calcFurusatoNozei({
    annualIncome: 10_000_000,
    hasSpouse: true,
    dependents: { ...NO_DEPS, age19to22: 2 },
  });
  assert.equal(uni2.donationLimit, 142557);
});

/* ------------- Time: clock modes + decimal (2026-10-31) ------------- */
import {
  addToClock,
  clockDifference,
  formatClockTime,
  formatDecimalHoursFromMinutes,
  formatDecimalHoursFromSeconds,
  formatDurationMinutes,
  parseClockTime,
} from "../src/lib/calculators/time";

test("TIME: parseClockTime accepts HH:MM and rejects junk", () => {
  assert.equal(parseClockTime("09:00"), 540);
  assert.equal(parseClockTime("17:30"), 1050);
  assert.equal(parseClockTime("24:00"), null);
  assert.equal(parseClockTime("9:99"), null);
  assert.equal(parseClockTime(""), null);
});

test("TIME: clock difference 9:00 -> 17:30 is 510 minutes, same day", () => {
  const d = clockDifference(540, 1050);
  assert.equal(d.minutes, 510);
  assert.equal(d.nextDay, false);
});

test("TIME: overnight difference 22:00 -> 6:00 is 480 minutes, next day", () => {
  const d = clockDifference(1320, 360);
  assert.equal(d.minutes, 480);
  assert.equal(d.nextDay, true);
});

test("TIME: clock + duration — 9:00 + 7h30 = 16:30 same day; 22:00 + 3h = 01:00 next day", () => {
  const a = addToClock(540, 450, "after");
  assert.equal(formatClockTime(a.minutesOfDay), "16:30");
  assert.equal(a.dayOffset, 0);
  const b = addToClock(1320, 180, "after");
  assert.equal(formatClockTime(b.minutesOfDay), "01:00");
  assert.equal(b.dayOffset, 1);
  const c = addToClock(60, 120, "before");
  assert.equal(formatClockTime(c.minutesOfDay), "23:00");
  assert.equal(c.dayOffset, -1);
});

test("TIME: decimal + duration formatting", () => {
  assert.equal(formatDecimalHoursFromMinutes(450), "7.5");
  assert.equal(formatDecimalHoursFromMinutes(255), "4.25");
  assert.equal(formatDecimalHoursFromMinutes(480), "8");
  assert.equal(formatDecimalHoursFromSeconds(2700), "0.75");
  assert.equal(formatDurationMinutes(450), "7時間30分");
  assert.equal(formatDurationMinutes(60), "1時間");
  assert.equal(formatDurationMinutes(45), "45分");
});

/* ------------- Percentage: 4 modes + buai (2026-10-31) ------------- */
import {
  changePercent,
  percentOf,
  percentToBuai,
  ratioPercent,
  wholeFromPart,
} from "../src/lib/calculators/percentage";

test("PCT: the four modes on the universal test cases", () => {
  assert.equal(percentOf(150, 20), 30);
  assert.equal(ratioPercent(30, 150), 20);
  assert.equal(changePercent(100, 120), 20);
  assert.equal(wholeFromPart(30, 20), 150);
});

test("PCT: division-by-zero cases return null", () => {
  assert.equal(ratioPercent(10, 0), null);
  assert.equal(changePercent(0, 50), null);
  assert.equal(wholeFromPart(10, 0), null);
});

test("PCT: buai conversion is correct (incl. the Rakko-style trap)", () => {
  assert.equal(percentToBuai(20), "2割");
  assert.equal(percentToBuai(25), "2割5分");
  assert.equal(percentToBuai(25.5), "2割5分5厘");
  assert.equal(percentToBuai(100), "10割");
  assert.equal(percentToBuai(0), null);
  assert.equal(percentToBuai(150), null);
  assert.equal(percentToBuai(-5), null);
});

test("PCT: worked-examples table values verify against the lib", () => {
  assert.equal(percentOf(5000, 80), 4000); // 5,000円の20%引き -> 4,000円
  assert.equal(percentOf(2500, 110), 2750); // 2,500円の税込10% -> 2,750円
  assert.equal(ratioPercent(80, 400), 20); // 400点中80点 -> 20%
  assert.equal(wholeFromPart(30, 20), 150); // 30は20% -> 全体150
  assert.equal(changePercent(100, 120), 20); // 100 -> 120 は +20%
});

/* ---------------- #9: algebra （文字式） ---------------- */

test("ALG-01: solve 2x + 3 = 7 -> x = 2", () => {
  assert.equal(solveLinearEquationSafe("2x + 3 = 7"), 2);
});

test("ALG-02: x on both sides: 3x + 2 = x + 8 -> x = 3", () => {
  assert.equal(solveLinearEquationSafe("3x + 2 = x + 8"), 3);
});

test("ALG-03: disguised quadratic (x+1)(x+2) = 6 is rejected, not mis-solved", () => {
  assert.throws(() => solveLinearEquationSafe("(x+1)(x+2) = 6"));
});

test("ALG-04: x^2 and x*x equations are rejected as non-linear", () => {
  assert.throws(() => solveLinearEquationSafe("x^2 = 4"));
  assert.throws(() => solveLinearEquationSafe("x*x = 9"));
});

test("ALG-05: constant powers are fine: 2^2 = x -> x = 4", () => {
  assert.equal(solveLinearEquationSafe("2^2 = x"), 4);
});

test("ALG-06: malformed numbers throw instead of silently truncating", () => {
  assert.throws(() => evaluateExpressionSafe("1.2.3 + x", 1));
  assert.throws(() => evaluateExpressionSafe("x + .", 1));
});

test("ALG-07: evaluate still works: 2x + 3 at x = 5 -> 13", () => {
  assert.equal(evaluateExpressionSafe("2x + 3", 5), 13);
});

test("POLY-01: combine like terms: 2x + 3x = 5x", () => {
  assert.equal(simplifyExpression("2x + 3x").result, "5x");
});

test("POLY-02: distribution: 3(x + 2) = 3x + 6 with the expansion line", () => {
  const r = simplifyExpression("3(x + 2)");
  assert.equal(r.result, "3x + 6");
  assert.ok(r.expansionSteps.includes("3x + 6"));
});

test("POLY-03: binomial expansion (x + 2)(x + 3) with schoolbook steps", () => {
  const r = simplifyExpression("(x + 2)(x + 3)");
  assert.equal(r.result, "x^2 + 5x + 6");
  assert.ok(r.expansionSteps.includes("x^2 + 3x + 2x + 6"));
});

test("POLY-04: fraction coefficients: x/2 + x/3 = 5/6x", () => {
  assert.equal(simplifyExpression("x/2 + x/3").result, "5/6x");
});

test("POLY-05: subtraction across brackets: 2(x - 1) - (x + 3) = x - 5", () => {
  assert.equal(simplifyExpression("2(x - 1) - (x + 3)").result, "x - 5");
});

test("POLY-06: squared bracket (x + 2)^2 = x^2 + 4x + 4", () => {
  const r = simplifyExpression("(x + 2)^2");
  assert.equal(r.result, "x^2 + 4x + 4");
  assert.ok(r.expansionSteps.includes("x^2 + 2x + 2x + 4"));
});

test("POLY-07: unsupported forms throw", () => {
  assert.throws(() => simplifyExpression("1/x"));
  assert.throws(() => simplifyExpression("x^x"));
  assert.throws(() => simplifyExpression("(x + 1)/(x - 1)"));
});

/* ---------------- #10: factorization （因数分解） ---------------- */

test("FACT-01: x^2 + 5x + 6 = (x + 2)(x + 3)", () => {
  const r = factorizeExpression("x^2 + 5x + 6");
  assert.equal(r.result, "(x + 2)(x + 3)");
  assert.equal(r.irreducible, false);
});

test("FACT-02: difference of squares x^2 - 9 = (x + 3)(x - 3)", () => {
  const r = factorizeExpression("x^2 - 9");
  assert.equal(r.result, "(x + 3)(x - 3)");
  assert.ok(r.steps.some((s) => s.includes("和と差の積")));
});

test("FACT-03: tasukigake 2x^2 + 7x + 3 = (x + 3)(2x + 1)", () => {
  const r = factorizeExpression("2x^2 + 7x + 3");
  assert.equal(r.result, "(x + 3)(2x + 1)");
  assert.ok(r.steps.some((s) => s.includes("たすき掛け")));
});

test("FACT-04: common factor + quadratic: 2x^3 + 10x^2 + 12x = 2x(x + 2)(x + 3)", () => {
  const r = factorizeExpression("2x^3 + 10x^2 + 12x");
  assert.equal(r.result, "2x(x + 2)(x + 3)");
});

test("FACT-05: perfect square (x + 2)^2 and (2x - 1)^2 forms", () => {
  assert.equal(factorizeExpression("x^2 + 4x + 4").result, "(x + 2)^2");
  assert.equal(factorizeExpression("4x^2 - 4x + 1").result, "(2x - 1)^2");
});

test("FACT-06: fraction coefficients: x^2/2 + 3x/2 + 1 = 1/2(x + 1)(x + 2)", () => {
  assert.equal(factorizeExpression("x^2/2 + 3/2*x + 1").result, "1/2(x + 1)(x + 2)");
});

test("FACT-07: irreducible quadratics stay whole and say so", () => {
  const r = factorizeExpression("x^2 + 3x + 1");
  assert.equal(r.irreducible, true);
  assert.equal(r.result, "x^2 + 3x + 1");
  assert.ok(r.steps.some((s) => s.includes("判別式")));
});

test("FACT-08: linear with common factor: 2x + 4 = 2(x + 2); plain x + 2 untouched", () => {
  assert.equal(factorizeExpression("2x + 4").result, "2(x + 2)");
  assert.equal(factorizeExpression("x + 2").result, "(x + 2)");
});

test("FACT-09: prime division steps for 360 and none for a prime", () => {
  const steps = primeFactorSteps(360);
  assert.equal(steps.length, 5);
  assert.deepEqual(steps[0], { dividend: 360, prime: 2, quotient: 180 });
  assert.deepEqual(steps[4], { dividend: 15, prime: 3, quotient: 5 });
  assert.equal(primeFactorSteps(313).length, 0);
});

/* ---------------- #11: simultaneous equations （連立方程式） ---------------- */

test("SIM-01: baseline solve with exact fractions: 2x+3y=8, 5x-y=3 -> (1, 2)", () => {
  const r = solveSimultaneousEquations(2, 3, 8, 5, -1, 3);
  assert.equal(r.status, "success");
  const exact = solveExactFractions(2, 3, 8, 5, -1, 3);
  assert.deepEqual(exact, { x: { num: 1, den: 1 }, y: { num: 2, den: 1 } });
});

test("SIM-02: fractional solution stays exact: 2x+3y=8, 3x-y=5 -> (23/11, 14/11)", () => {
  const exact = solveExactFractions(2, 3, 8, 3, -1, 5);
  assert.deepEqual(exact, { x: { num: 23, den: 11 }, y: { num: 14, den: 11 } });
});

test("SIM-03: classification: no solution vs infinite", () => {
  assert.equal(solveSimultaneousEquations(1, 1, 1, 1, 1, 2).status, "no_solution");
  assert.equal(solveSimultaneousEquations(1, 1, 3, 2, 2, 6).status, "infinite");
  assert.equal(solveSimultaneousEquations(0, 0, 5, 1, 1, 1).status, "no_solution");
});

test("SIM-04: elimination steps for x+y=7, x-y=1 (add to cancel y)", () => {
  const steps = eliminationSteps(1, 1, 7, 1, -1, 1);
  assert.ok(steps.some((s) => s.includes("① + ②")));
  assert.ok(steps.some((s) => s.includes("2x = 8")));
  assert.ok(steps.some((s) => s.includes("x = 4")));
  assert.ok(steps[steps.length - 1].includes("y = 3"));
});

test("SIM-05: elimination steps scale when needed: 2x+3y=8, 5x-y=3", () => {
  const steps = eliminationSteps(2, 3, 8, 5, -1, 3);
  assert.ok(steps.some((s) => s.includes("②×3")));
  assert.ok(steps.some((s) => s.includes("17x = 17")));
  assert.ok(steps[steps.length - 1].includes("y = 2"));
});

test("SIM-06: missing-y equation path and decimal inputs give no exact steps", () => {
  const steps = eliminationSteps(2, 0, 6, 1, 1, 5);
  assert.ok(steps.some((s) => s.includes("x = 3")));
  assert.ok(steps[steps.length - 1].includes("y = 2"));
  assert.equal(eliminationSteps(1.5, 1, 4, 1, 1, 3).length, 0);
  assert.equal(solveExactFractions(1.5, 1, 4, 1, 1, 3), null);
});

test("SIM3-01: 3-variable unique solution (1, 2, 3)", () => {
  const r = solveSimultaneous3([
    [1, 1, 1, 6],
    [2, 1, 1, 7],
    [1, 2, 1, 8],
  ]);
  assert.equal(r.status, "success");
  if (r.status === "success") {
    assert.deepEqual([r.x, r.y, r.z], [
      { num: 1, den: 1 },
      { num: 2, den: 1 },
      { num: 3, den: 1 },
    ]);
  }
});

test("SIM3-02: 3-variable fractional solution", () => {
  // x + y + z = 1, 2x - y = 0, x + z = 0 -> x = z? solve: y = 2x, z = -x -> x + 2x - x = 1 -> x = 1/2, y = 1, z = -1/2
  const r = solveSimultaneous3([
    [1, 1, 1, 1],
    [2, -1, 0, 0],
    [1, 0, 1, 0],
  ]);
  assert.equal(r.status, "success");
  if (r.status === "success") {
    assert.deepEqual(r.x, { num: 1, den: 2 });
    assert.deepEqual(r.y, { num: 1, den: 1 });
    assert.deepEqual(r.z, { num: -1, den: 2 });
  }
});

test("SIM3-03: 3-variable degenerate classification", () => {
  assert.equal(
    solveSimultaneous3([
      [1, 1, 1, 3],
      [1, 1, 1, 4],
      [1, -1, 0, 0],
    ]).status,
    "no_solution",
  );
  assert.equal(
    solveSimultaneous3([
      [1, 1, 1, 3],
      [2, 2, 2, 6],
      [1, -1, 0, 1],
    ]).status,
    "infinite",
  );
});

test("SIM-07: word-problem system (apples/oranges) solves to (3, 7)", () => {
  const r = solveSimultaneousEquations(1, 1, 10, 150, 80, 1010);
  assert.equal(r.status, "success");
  if (r.status === "success") {
    assert.equal(r.x, 3);
    assert.equal(r.y, 7);
  }
});

test("SIM3-04: Cramer numerators reproduce the solutions (x = Dx/D ...)", () => {
  const rows: [number, number, number, number][] = [
    [1, 1, 1, 6],
    [2, 1, 1, 7],
    [1, 2, 1, 8],
  ];
  const n = cramerNumerators3(rows);
  // D = 1 for this system, so the numerators equal the solution itself.
  assert.deepEqual(n.dx, { num: 1, den: 1 });
  assert.deepEqual(n.dy, { num: 2, den: 1 });
  assert.deepEqual(n.dz, { num: 3, den: 1 });

  const rows2: [number, number, number, number][] = [
    [1, 1, 1, 1],
    [2, -1, 0, 0],
    [1, 0, 1, 0],
  ];
  const n2 = cramerNumerators3(rows2);
  // D = -2 here; solution (1/2, 1, -1/2) -> numerators (-1, -2, 1).
  assert.deepEqual(n2.dx, { num: -1, den: 1 });
  assert.deepEqual(n2.dy, { num: -2, den: 1 });
  assert.deepEqual(n2.dz, { num: 1, den: 1 });
});

/* ---------------- #12: financial （金融計算・ローン） ---------------- */

test("FIN-01: TVM future value: 100,000 at 5% for 10 periods", () => {
  const r = solveTimeValueOfMoney("FV", { pv: 100000, fv: 0, pmt: 0, ratePercent: 5, periods: 10 });
  assert.ok(Math.abs(r.solvedValue - 162889.4627) < 0.5);
});

test("FIN-02: TVM payment solve round-trips to the target FV", () => {
  const r = solveTimeValueOfMoney("PMT", { pv: 0, fv: 1000000, pmt: 0, ratePercent: 3, periods: 36 });
  const check = tvmFutureValue(0, r.solvedValue, 3, 36);
  assert.ok(Math.abs(check - 1000000) < 1);
});

test("FIN-03: loan benchmark (equal payment): 3,000,000 at 3% for 5 years", () => {
  const r = calculateLoan(3000000, 3, 5);
  assert.equal(r.monthlyPayment, 53906);
  assert.ok(r.totalPayment >= 3234300 && r.totalPayment <= 3234400);
  assert.equal(r.scheduleMode, "monthly");
  assert.equal(r.schedule.length, 60);
  assert.equal(r.schedule[59].balance, 0);
});

test("FIN-04: equal-principal loan: first payment 57,500 and shrinking payments", () => {
  const r = calculateLoan(3000000, 3, 5, "equal_principal");
  assert.equal(r.firstPayment, 57500);
  assert.ok(Math.abs(r.totalInterest - 228750) <= 150);
  assert.equal(r.schedule.length, 60);
  assert.ok(r.schedule[0].payment > r.schedule[59].payment);
  assert.equal(r.schedule[59].balance, 0);
});

test("FIN-05: long loan (35 years) uses the yearly schedule summary", () => {
  const r = calculateLoan(30000000, 1.5, 35);
  assert.equal(r.scheduleMode, "yearly");
  assert.equal(r.schedule.length, 35);
  assert.equal(r.schedule[34].balance, 0);
});

/* ---------------- #13: compound interest （複利） ---------------- */

test("CI-01: one-time deposit benchmark: 1,000,000 at 5% for 10 years (yearly)", () => {
  const r = calcCompoundInterest({ principal: 1000000, annualRatePercent: 5, years: 10, frequency: 1 });
  assert.equal(Math.round(r.futureValue), 1628895);
  assert.equal(Math.round(r.totalInterest), 628895);
  assert.equal(r.yearly.length, 10);
  assert.equal(Math.round(r.yearly[9].futureValue), 1628895);
});

test("CI-02: monthly saving benchmark: 30,000/month at 3% for 20 years", () => {
  const r = calcCompoundInterest({ principal: 0, annualRatePercent: 3, years: 20, frequency: 12, monthlyContribution: 30000 });
  assert.equal(Math.round(r.futureValue), 9849060);
  assert.equal(r.totalContributions, 7200000);
  assert.equal(Math.round(r.totalInterest), 2649060);
});

test("CI-03: zero rate keeps contributions exact", () => {
  const r = calcCompoundInterest({ principal: 100000, annualRatePercent: 0, years: 5, frequency: 1, monthlyContribution: 10000 });
  assert.equal(r.futureValue, 700000);
  assert.equal(r.totalInterest, 0);
});

/* ---------------- #14: interest （利息・単利複利＋税） ---------------- */

test("INT-01: deposit benchmark: 1,000,000 at 1% for 3 years", () => {
  const r = calcInterest(1000000, 1, 3, "years");
  assert.equal(Math.round(r.simpleInterest), 30000);
  assert.equal(Math.round(r.compoundInterest), 30301);
  assert.equal(Math.round(r.difference), 301);
});

test("INT-02: daily interest: 500,000 at 5% for 100 days (365-day basis)", () => {
  const r = calcInterest(500000, 5, 100, "days");
  assert.equal(Math.round(r.simpleInterest), 6849);
});

test("INT-03: months convert to fractional years", () => {
  const r = calcInterest(120000, 6, 6, "months");
  assert.equal(Math.round(r.simpleInterest), 3600);
});

test("INT-04: withholding tax on 30,000 yen interest (individual, 20.315%)", () => {
  const tax = withholdingTax(30000);
  assert.equal(tax.incomeTax, 4594);
  assert.equal(tax.localTax, 1500);
  assert.equal(tax.total, 6094);
  assert.equal(tax.net, 23906);
});

/* ---------------- #15: social insurance （社会保険料・令和8年度） ---------------- */

test("SI-01: market benchmark: salary 350,000, age 35, Tokyo, no bonus", () => {
  const r = calcSocialInsurance({ monthlySalary: 350000, bonus: 0, age: 35, prefectureIndex: 12 });
  assert.equal(r.standardMonthlyHealth, 360000);
  assert.equal(r.standardMonthlyPension, 360000);
  assert.equal(r.salaryHealth, 17730);
  assert.equal(r.salaryPension, 32940);
  assert.equal(r.salaryChild, 414);
  assert.equal(r.salaryEmployment, 1750);
  assert.equal(r.careValue, 0);
  assert.equal(r.totalDeduction, 52834);
});

test("SI-02: age 45 adds care insurance (1.62% split)", () => {
  const r = calcSocialInsurance({ monthlySalary: 350000, bonus: 0, age: 45, prefectureIndex: 12 });
  assert.equal(r.salaryCare, 2916);
  assert.equal(r.totalDeduction, 55750);
});

test("SI-03: pension standard amount caps at 650,000", () => {
  const r = calcSocialInsurance({ monthlySalary: 1000000, bonus: 0, age: 35, prefectureIndex: 12 });
  assert.equal(r.standardMonthlyPension, 650000);
  assert.equal(r.salaryPension, 59475);
});

test("SI-04: bonus premiums use the standard bonus amount", () => {
  const r = calcSocialInsurance({ monthlySalary: 300000, bonus: 500000, age: 35, prefectureIndex: 12 });
  assert.equal(r.standardBonusPension, 500000);
  assert.equal(r.bonusPension, 45750);
  assert.equal(r.bonusEmployment, 2500);
});

/* ---------------- #16: unemployment insurance （失業保険・令和8年8月） ---------------- */

test("UE-01: benchmark: 35yo, 5-10y insured, voluntary leaving", () => {
  const r = calculateUnemployment({ sixMonthWageTotal: 1800000, age: "35-44", tenure: "5-10", reason: "self" });
  assert.equal(r.wageDaily, 10000);
  assert.equal(r.benefitDaily, 6307);
  assert.equal(r.prescribedDays, 90);
  assert.equal(r.totalBenefit, 567630);
  assert.equal(r.monthlyBenefit, 6307 * 28);
});

test("UE-02: company reason doubles the days for the same case", () => {
  const r = calculateUnemployment({ sixMonthWageTotal: 1800000, age: "35-44", tenure: "5-10", reason: "company" });
  assert.equal(r.prescribedDays, 180);
  assert.equal(r.totalBenefit, 1135260);
});

test("UE-03: zero wage means zero benefit (no minimum clamp-up)", () => {
  const r = calculateUnemployment({ sixMonthWageTotal: 0, age: "30-34", tenure: "1-5", reason: "self" });
  assert.equal(r.benefitDaily, 0);
  assert.equal(r.totalBenefit, 0);
});

test("UE-04: age 65+ is a lump sum (50 days at 1-5y tenure)", () => {
  const r = calculateUnemployment({ sixMonthWageTotal: 1800000, age: "65+", tenure: "1-5", reason: "retirement" });
  assert.equal(r.isLumpSum, true);
  assert.equal(r.prescribedDays, 50);
  assert.equal(r.benefitDaily, 5348);
  assert.equal(r.totalBenefit, 267400);
});

/* ---------------- #17: consumption tax （消費税） ---------------- */

test("CTX-01: forward 10% and the reverse float case", () => {
  const f = calcFromTaxExcluded({ amount: 10000, rate: 0.1, round: "floor" });
  assert.equal(f.taxAmount, 1000);
  assert.equal(f.totalAmount, 11000);
  // 1080 / 1.08 = 999.9999999999999 in float — the snap guard must give 1000, not 999
  const r = calcFromTaxIncluded({ amount: 1080, rate: 0.08, round: "floor" });
  assert.equal(r.baseAmount, 1000);
  assert.equal(r.taxAmount, 80);
});

test("CTX-02: rounding modes on 999 yen at 10%", () => {
  assert.equal(calcFromTaxExcluded({ amount: 999, rate: 0.1, round: "floor" }).totalAmount, 1098);
  assert.equal(calcFromTaxExcluded({ amount: 999, rate: 0.1, round: "round" }).totalAmount, 1099);
  assert.equal(calcFromTaxExcluded({ amount: 999, rate: 0.1, round: "ceil" }).totalAmount, 1099);
});

test("CTX-03: breakdown always reconciles (base + tax = total)", () => {
  const r = calcFromTaxIncluded({ amount: 2728, rate: 0.1, round: "floor" });
  assert.equal(r.baseAmount + r.taxAmount, r.totalAmount);
  assert.equal(r.baseAmount, 2480);
  assert.equal(r.taxAmount, 248);
});


test("IT-01: 2025 employment deduction table (minimum 650,000)", () => {
  assert.equal(calcEmploymentDeduction(1500000), 650000);
  assert.equal(calcEmploymentDeduction(5000000), 1440000);
  assert.equal(calcEmploymentDeduction(10000000), 1950000);
});

test("IT-02: 2025-26 basic deduction tiers", () => {
  assert.equal(calcBasicDeduction(1320000), 950000);
  assert.equal(calcBasicDeduction(4360000), 680000);
  assert.equal(calcBasicDeduction(10000000), 580000);
  assert.equal(calcBasicDeduction(26000000), 0);
});

test("IT-03: full case 6,000,000 employee, reconstruction tax truncated", () => {
  const r = calcIncomeTax({ annualIncome: 6000000, employmentType: "employee", socialInsurance: 0, otherDeductions: 0 });
  assert.equal(r.employmentIncome, 4360000);
  assert.equal(r.taxableIncome, 3680000);
  assert.equal(r.incomeTax, 308500);
  // 308,500 x 2.1% = 6,478.5 -> truncation gives 6,478 (rounding would give 6,479)
  assert.equal(r.reconstructionTax, 6478);
  assert.equal(r.totalTax, 314978);
});

/* ---------------- #19: furusato nozei detailed （ふるさと納税詳細） ---------------- */

const fndBase = {
  spouseType: "none" as const,
  spouseIncome: 0,
  dependents: { under16: 0, age16to18: 0, age19to22: 0, age23to69: 0, age70coliving: 0, age70separate: 0 },
  disability: { general: 0, special: 0, cohabitingSpecial: 0 },
  socialInsurance: 0,
  lifeInsurance: 0,
  earthquakeInsurance: 0,
  medical: 0,
  singleParent: false,
  housingLoanCredit: 0,
  ideco: 0,
};

test("FND-01: standard family case matches the quick calculator exactly", () => {
  const r = calcFurusatoNozeiDetailed({
    ...fndBase,
    annualIncome: 6000000,
    spouseType: "under70",
    dependents: { ...fndBase.dependents, age16to18: 1 },
    socialInsurance: 900000,
  });
  assert.equal(r.donationLimit, 61405);
});

test("FND-02: iDeCo contributions lower the limit (full deduction)", () => {
  const withIdeco = calcFurusatoNozeiDetailed({ ...fndBase, annualIncome: 8000000, socialInsurance: 1200000, ideco: 276000 });
  const without = calcFurusatoNozeiDetailed({ ...fndBase, annualIncome: 8000000, socialInsurance: 1200000 });
  assert.equal(without.donationLimit, 130485);
  assert.equal(withIdeco.donationLimit, 122551);
  assert.equal(withIdeco.ideco, 276000);
});

test("FND-03: zero income gives a zero limit", () => {
  const r = calcFurusatoNozeiDetailed({ ...fndBase, annualIncome: 0 });
  assert.equal(r.donationLimit, 0);
});

/* ---------------- #20: unit converter （単位変換） ---------------- */

const approxEq = (actual: number, expected: number, tol = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${actual} != ${expected}`);

test("UC-01: area benchmark — 10 tsubo is 33.0579 m2", () => {
  approxEq(convertUnit("area", 10, "tsubo", "m2"), 33.057851, 1e-6);
  approxEq(convertUnit("area", 1, "tsubo", "jo"), 2.040608, 1e-6);
  approxEq(convertUnit("area", 6, "jo", "m2"), 9.72, 1e-9);
});

test("UC-02: length and temperature benchmarks", () => {
  approxEq(convertUnit("length", 100, "cm", "in"), 39.370079, 1e-6);
  approxEq(convertUnit("temperature", 36.5, "c", "f"), 97.7, 1e-9);
  approxEq(convertUnit("temperature", 0, "c", "k"), 273.15, 1e-9);
});

test("UC-03: traditional volume units (shakkanho)", () => {
  approxEq(convertUnit("volume", 1, "sho", "l"), 1.803907, 1e-6);
  approxEq(convertUnit("volume", 1, "koku", "sho"), 100, 1e-9);
  approxEq(convertUnit("volume", 1, "gou", "ml"), 180.390684, 1e-6);
});

test("UC-04: speed, pressure and energy benchmarks", () => {
  approxEq(convertUnit("speed", 60, "kmh", "ms"), 16.666667, 1e-6);
  approxEq(convertUnit("pressure", 1, "atm", "kpa"), 101.325, 1e-9);
  approxEq(convertUnit("energy", 1, "kcal", "kj"), 4.184, 1e-9);
});

test("UC-05: exact ri and traditional length/weight factors", () => {
  approxEq(convertUnit("length", 1, "ri", "m"), 3927.272727, 1e-6);
  approxEq(convertUnit("length", 1, "shaku", "cm"), 30.30303, 1e-5);
  approxEq(convertUnit("weight", 1, "kan", "kg"), 3.75, 1e-12);
  approxEq(convertUnit("weight", 1, "kin", "g"), 600, 1e-9);
});

test("UC-06: invalid input and unknown units throw; all-units covers the category", () => {
  assert.throws(() => convertUnit("length", Number.NaN, "cm", "in"));
  assert.throws(() => convertUnit("length", 1, "cm", "nope"));
  const all = convertToAllUnits("area", 10, "tsubo");
  assert.equal(all.length, getUnits("area").length);
  assert.ok(all.some((u) => u.id === "m2" && Math.abs(u.value - 33.057851) < 1e-6));
});

/* ---------------- #21: era converter （和暦西暦変換） ---------------- */

test("ERA-01: year benchmarks both directions", () => {
  assert.equal(westernToEra(2026)?.era.id, "reiwa");
  assert.equal(westernToEra(2026)?.eraYear, 8);
  assert.equal(eraToWestern("heisei", 20), 2008);
  assert.equal(eraToWestern("showa", 64), 1989);
  assert.equal(westernToEra(1868)?.era.id, "meiji");
  assert.equal(westernToEra(1867), null);
});

test("ERA-02: final era years accepted, the year after rejected", () => {
  assert.equal(eraToWestern("heisei", 31), 2019);
  assert.equal(eraToWestern("heisei", 32), null);
  assert.equal(eraToWestern("meiji", 45), 1912);
  assert.equal(eraToWestern("meiji", 46), null);
  assert.equal(eraToWestern("taisho", 15), 1926);
  assert.equal(eraToWestern("reiwa", 1), 2019);
});

test("ERA-03: era-change years have two eras", () => {
  for (const [year, ids] of [[2019, ["reiwa", "heisei"]], [1989, ["heisei", "showa"]], [1926, ["showa", "taisho"]], [1912, ["taisho", "meiji"]]] as const) {
    assert.deepEqual(westernToEras(year).map((r) => r.era.id), [...ids]);
  }
  assert.equal(westernToEras(2026).length, 1);
});

test("ERA-04: date conversion applies the real era-change dates", () => {
  assert.equal(westernDateToEra(1989, 1, 7)?.era.id, "showa");
  assert.equal(westernDateToEra(1989, 1, 7)?.eraYear, 64);
  assert.equal(westernDateToEra(1989, 1, 8)?.era.id, "heisei");
  assert.equal(westernDateToEra(2019, 4, 30)?.era.id, "heisei");
  assert.equal(westernDateToEra(2019, 4, 30)?.eraYear, 31);
  assert.equal(westernDateToEra(2019, 5, 1)?.era.id, "reiwa");
  assert.equal(westernDateToEra(1912, 7, 29)?.era.id, "meiji");
  assert.equal(westernDateToEra(1912, 7, 30)?.era.id, "taisho");
  assert.equal(westernDateToEra(2026, 2, 29), null);
});

test("ERA-05: impossible era dates are rejected", () => {
  assert.deepEqual(eraDateToWestern("showa", 64, 1, 7), { year: 1989, month: 1, day: 7 });
  assert.equal(eraDateToWestern("showa", 64, 1, 8), null);
  assert.deepEqual(eraDateToWestern("heisei", 31, 4, 30), { year: 2019, month: 4, day: 30 });
  assert.equal(eraDateToWestern("heisei", 31, 5, 1), null);
  assert.equal(eraDateToWestern("reiwa", 1, 4, 30), null);
  assert.deepEqual(eraDateToWestern("reiwa", 1, 5, 1), { year: 2019, month: 5, day: 1 });
});

test("ERA-06: zodiac of the year", () => {
  assert.equal(zodiacOf(2026), "午");
  assert.equal(zodiacOf(2008), "子");
  assert.equal(zodiacOf(1989), "巳");
});

/* ---------------- #22: mahjong score （麻雀点数計算） ---------------- */

test("MJ-01: standard ron benchmarks (DX + Socialrubik agree)", () => {
  assert.equal(calcMahjong({ han: 4, fu: 30, seat: "nondealer", win: "ron" }).total, 7700);
  assert.equal(calcMahjong({ han: 4, fu: 30, seat: "dealer", win: "ron" }).total, 11600);
  // 1 han 70 fu child ron is 2,300 (3,400 is the dealer value)
  assert.equal(calcMahjong({ han: 1, fu: 70, seat: "nondealer", win: "ron" }).total, 2300);
  assert.equal(calcMahjong({ han: 1, fu: 70, seat: "dealer", win: "ron" }).total, 3400);
});

test("MJ-02: child tsumo split payments", () => {
  const r = calcMahjong({ han: 3, fu: 30, seat: "nondealer", win: "tsumo" });
  assert.equal(r.total, 4000);
  assert.ok(r.breakdown.includes("2,000") && r.breakdown.includes("1,000"));
});

test("MJ-03: mangan cutoffs and fixed hands", () => {
  assert.equal(calcMahjong({ han: 4, fu: 40, seat: "nondealer", win: "ron" }).label, "満貫");
  assert.equal(calcMahjong({ han: 3, fu: 70, seat: "nondealer", win: "ron" }).total, 8000);
  assert.equal(calcMahjong({ han: 5, fu: 30, seat: "dealer", win: "ron" }).total, 12000);
  assert.equal(calcMahjong({ han: 13, fu: 30, seat: "nondealer", win: "ron" }).label, "役満");
});

test("MJ-04: chiitoitsu 25 fu and pinfu tsumo 20 fu", () => {
  assert.equal(calcMahjong({ han: 2, fu: 25, seat: "nondealer", win: "ron" }).total, 1600);
  const pinfu = calcMahjong({ han: 2, fu: 20, seat: "nondealer", win: "tsumo" });
  assert.equal(pinfu.total, 1500);
});

test("MJ-05: fu builder — pinfu tsumo stays 20, open ron becomes 30", () => {
  const none = [
    { tile: "simple", shape: "none" },
    { tile: "simple", shape: "none" },
    { tile: "simple", shape: "none" },
    { tile: "simple", shape: "none" },
  ] as const;
  const tsumo = buildFu({ method: "tsumo", wait: "ryanmenShanpon", pair: "other", melds: [...none] });
  // A pinfu shape won by tsumo earns no tsumo fu: it stays at 20 fu.
  assert.equal(tsumo.total, 20);
  assert.equal(tsumo.rounded, 20);
  assert.equal(tsumo.pinfuTsumo, true);
  const openRon = buildFu({ method: "openRon", wait: "ryanmenShanpon", pair: "other", melds: [...none] });
  assert.equal(openRon.total, 20);
  assert.equal(openRon.rounded, 30);
  assert.equal(openRon.openRonAdjusted, true);
  const menzen = buildFu({ method: "menzenRon", wait: "ryanmenShanpon", pair: "other", melds: [...none] });
  assert.equal(menzen.rounded, 30);
  assert.equal(menzen.openRonAdjusted, false);
});

test("MJ-06: fu builder — a full 70 fu hand", () => {
  const r = buildFu({
    method: "menzenRon",
    wait: "ryanmenShanpon",
    pair: "other",
    melds: [
      { tile: "terminalHonor", shape: "closedKan" },
      { tile: "terminalHonor", shape: "closedTriplet" },
      { tile: "simple", shape: "none" },
      { tile: "simple", shape: "none" },
    ],
  });
  assert.equal(r.total, 70);
  assert.equal(r.rounded, 70);
});

