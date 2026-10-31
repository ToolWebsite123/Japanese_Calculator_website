export type BmiCategory = "underweight" | "normal" | "obese1" | "obese2" | "obese3" | "obese4";

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  idealWeight: number;
  weightDiff: number;
  /** Weight at BMI 18.5 — lower end of the normal range for this height. */
  healthyWeightMin: number;
  /** Weight at BMI 24.9 — upper end of the normal range for this height. */
  healthyWeightMax: number;
  /** Beauty weight (BMI 20) for this height — a popular-culture yardstick, not an official standard. */
  beautyWeight: number;
  /** Current weight minus beauty weight (same sign convention as weightDiff). */
  beautyDiff: number;
  /** Cinderella weight (BMI 18) for this height — not an official standard. */
  cinderellaWeight: number;
  /** Current weight minus cinderella weight. */
  cinderellaDiff: number;
  /** Model weight (BMI 17) for this height — not an official standard. */
  modelWeight: number;
  /** Current weight minus model weight. */
  modelDiff: number;
};

/** Japanese Society for the Study of Obesity categories. */
export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "obese1";
  if (bmi < 35) return "obese2";
  if (bmi < 40) return "obese3";
  return "obese4";
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new Error("身長が無効です");
  }
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("体重が無効です");
  }

  const heightM = heightCm / 100;
  const heightSq = heightM * heightM;
  const bmi = weightKg / heightSq;
  const rounded = Math.round(bmi * 100) / 100;

  const weightAt = (targetBmi: number) => Math.round(targetBmi * heightSq * 100) / 100;
  const diffTo = (targetWeight: number) => Math.round((weightKg - targetWeight) * 100) / 100;

  const idealWeight = weightAt(22);
  const beautyWeight = weightAt(20);
  const cinderellaWeight = weightAt(18);
  const modelWeight = weightAt(17);

  return {
    bmi: rounded,
    category: getBmiCategory(rounded),
    idealWeight,
    weightDiff: diffTo(idealWeight),
    healthyWeightMin: weightAt(18.5),
    healthyWeightMax: weightAt(24.9),
    beautyWeight,
    beautyDiff: diffTo(beautyWeight),
    cinderellaWeight,
    cinderellaDiff: diffTo(cinderellaWeight),
    modelWeight,
    modelDiff: diffTo(modelWeight),
  };
}

export type BmiSex = "male" | "female";

/**
 * Target BMI range by age — MHLW "日本人の食事摂取基準（2025年版）".
 * Returns null for under-18s, to whom the adult ranges do not apply.
 */
export function getAgeTargetRange(age: number): { min: number; max: number } | null {
  if (!Number.isFinite(age) || age < 0) return null;
  if (age < 18) return null;
  if (age < 50) return { min: 18.5, max: 24.9 };
  if (age < 65) return { min: 20.0, max: 24.9 };
  return { min: 21.5, max: 24.9 };
}

/**
 * Body-fat percentage estimate (Deurenberg et al., 1991):
 * BF% = 1.20 × BMI + 0.23 × age − 10.8 × sex − 5.4 (sex: male 1, female 0).
 * An estimate from BMI/age/sex only — not a measurement.
 */
export function estimateBodyFatPercent(bmi: number, age: number, sex: BmiSex): number {
  const raw = 1.2 * bmi + 0.23 * age - 10.8 * (sex === "male" ? 1 : 0) - 5.4;
  return Math.round(Math.max(0, raw) * 10) / 10;
}
