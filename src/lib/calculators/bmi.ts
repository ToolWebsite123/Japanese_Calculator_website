export type BmiCategory = "underweight" | "normal" | "obese1" | "obese2" | "obese3" | "obese4";

export type BmiResult = {
  bmi: number;
  category: BmiCategory;
  idealWeight: number;
  weightDiff: number;
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
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 100) / 100;
  const idealWeight = Math.round(22 * heightM * heightM * 100) / 100;
  const weightDiff = Math.round((weightKg - idealWeight) * 100) / 100;

  return {
    bmi: rounded,
    category: getBmiCategory(rounded),
    idealWeight,
    weightDiff,
  };
}
