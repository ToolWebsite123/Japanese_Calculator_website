/**
 * 失業保険（雇用保険 基本手当）計算ロジック
 * 令和7年8月1日改定の賃金日額・基本手当日額・所定給付日数に基づく
 * 概算計算（正式な支給額はハローワークの決定に従います）
 */

export type AgeBracket = "u29" | "30-34" | "35-44" | "45-59" | "60-64" | "65+";
export type TenureBracket = "u1" | "1-5" | "5-10" | "10-20" | "20+";
export type LeaveReason =
  | "self" // 自己都合
  | "company" // 会社都合（特定受給資格者）
  | "fixedTerm" // 有期雇用未更新（特定理由離職者）
  | "justSelf" // 正当な理由のある自己都合（特定理由離職者）
  | "retirement"; // 定年退職

export type UnemploymentResult = {
  wageDaily: number; // 賃金日額
  wageDailyRaw: number; // 上下限適用前
  benefitDaily: number; // 基本手当日額
  benefitRate: number; // 給付率
  prescribedDays: number; // 所定給付日数
  totalBenefit: number; // 受給総額
  monthlyBenefit: number; // 月あたりの受給金額（30日換算）
  isLumpSum: boolean; // 65歳以上の高年齢求職者給付金
  notes: string[];
};

// 賃金日額 上限（令和7年8月1日）
const WAGE_MAX: Record<AgeBracket, number> = {
  u29: 14510,
  "30-34": 16110,
  "35-44": 16110,
  "45-59": 17740,
  "60-64": 16940,
  "65+": 16940,
};

// 賃金日額 下限
const WAGE_MIN = 3014;

// 基本手当日額 上限（令和7年8月1日）
const BENEFIT_DAILY_MAX: Record<AgeBracket, number> = {
  u29: 7255,
  "30-34": 8055,
  "35-44": 8055,
  "45-59": 8870,
  "60-64": 7294,
  "65+": 7294,
};

// 基本手当日額 下限
const BENEFIT_DAILY_MIN = 2411;

// 所定給付日数 - 自己都合・定年退職（一般離職者）
function daysSelf(tenure: TenureBracket): number {
  switch (tenure) {
    case "u1":
      return 0; // 原則、被保険者期間12ヶ月未満は受給不可
    case "1-5":
      return 90;
    case "5-10":
      return 90;
    case "10-20":
      return 120;
    case "20+":
      return 150;
  }
}

// 所定給付日数 - 会社都合・特定理由離職者
function daysCompany(age: AgeBracket, tenure: TenureBracket): number {
  const table: Record<Exclude<AgeBracket, "65+">, Record<TenureBracket, number>> = {
    u29: { u1: 90, "1-5": 90, "5-10": 120, "10-20": 180, "20+": 180 },
    "30-34": { u1: 90, "1-5": 120, "5-10": 180, "10-20": 210, "20+": 240 },
    "35-44": { u1: 90, "1-5": 150, "5-10": 180, "10-20": 240, "20+": 270 },
    "45-59": { u1: 90, "1-5": 180, "5-10": 240, "10-20": 270, "20+": 330 },
    "60-64": { u1: 90, "1-5": 150, "5-10": 180, "10-20": 210, "20+": 240 },
  };
  if (age === "65+") return 0;
  return table[age][tenure];
}

function prescribedDays(age: AgeBracket, tenure: TenureBracket, reason: LeaveReason): number {
  if (age === "65+") {
    // 高年齢求職者給付金（一時金）
    return tenure === "u1" ? 30 : 50;
  }
  if (reason === "self" || reason === "retirement") {
    return daysSelf(tenure);
  }
  // company, fixedTerm, justSelf → 特定受給/特定理由 テーブル
  return daysCompany(age, tenure);
}

// 基本手当日額の算出（令和7年8月1日 スライド式）
function benefitDaily(w: number, age: AgeBracket): { y: number; rate: number } {
  const isSenior = age === "60-64";
  let y = 0;

  if (isSenior) {
    // 60〜64歳
    if (w < 5340) {
      y = 0.8 * w;
    } else if (w <= 11800) {
      // 下記2式のうち低い方
      const y1 = 0.8 * w - 0.35 * ((w - 5340) / 6460) * w;
      const y2 = 0.05 * w + 4720;
      y = Math.min(y1, y2);
    } else {
      y = 0.45 * w;
    }
  } else {
    // 29歳以下・30〜44歳・45〜59歳
    if (w < 5340) {
      y = 0.8 * w;
    } else if (w <= 13140) {
      y = 0.8 * w - 0.3 * ((w - 5340) / 7800) * w;
    } else {
      y = 0.5 * w;
    }
  }

  y = Math.floor(y);
  const rate = w > 0 ? y / w : 0;
  return { y, rate };
}

export function calculateUnemployment(params: {
  sixMonthWageTotal: number;
  age: AgeBracket;
  tenure: TenureBracket;
  reason: LeaveReason;
}): UnemploymentResult {
  const { sixMonthWageTotal, age, tenure, reason } = params;

  if (!Number.isFinite(sixMonthWageTotal) || sixMonthWageTotal < 0) {
    throw new Error("6ヶ月の賃金合計が無効です");
  }

  // 1. 賃金日額
  const wageDailyRaw = Math.floor(sixMonthWageTotal / 180);
  const wageMax = WAGE_MAX[age];
  const wageDaily = Math.min(Math.max(wageDailyRaw, WAGE_MIN), wageMax);

  // 2. 基本手当日額（65歳以上は同じ計算式を60-64相当で使用）
  const ageForBenefit: AgeBracket = age === "65+" ? "60-64" : age;
  const { y, rate } = benefitDaily(wageDaily, ageForBenefit);
  const benefitMax = BENEFIT_DAILY_MAX[age];
  const benefitDailyValue = Math.min(Math.max(y, BENEFIT_DAILY_MIN), benefitMax);

  // 3. 所定給付日数
  const days = prescribedDays(age, tenure, reason);

  // 4. 受給総額
  const totalBenefit = benefitDailyValue * days;

  // 月あたり（28日想定/月として概算）
  const monthlyBenefit = benefitDailyValue * 28;

  const notes: string[] = ["受給には7日間の待期期間があります。"];
  if (reason === "self" || reason === "retirement") {
    notes.push("自己都合退職の場合、待期後さらに原則1ヶ月の給付制限があります。");
  }
  if (age === "65+") {
    notes.push("65歳以上は「高年齢求職者給付金」として一時金で支給されます。");
  }
  if (days === 0) {
    notes.push("被保険者期間が不足しているため、原則として受給できません。");
  }

  return {
    wageDaily,
    wageDailyRaw,
    benefitDaily: benefitDailyValue,
    benefitRate: rate,
    prescribedDays: days,
    totalBenefit,
    monthlyBenefit,
    isLumpSum: age === "65+",
    notes,
  };
}

export const AGE_OPTIONS: { value: AgeBracket; label: string }[] = [
  { value: "u29", label: "29歳以下" },
  { value: "30-34", label: "30～34歳" },
  { value: "35-44", label: "35～44歳" },
  { value: "45-59", label: "45～59歳" },
  { value: "60-64", label: "60～64歳" },
  { value: "65+", label: "65歳以上" },
];

export const TENURE_OPTIONS: { value: TenureBracket; label: string }[] = [
  { value: "u1", label: "1年未満" },
  { value: "1-5", label: "1年以上5年未満" },
  { value: "5-10", label: "5年以上10年未満" },
  { value: "10-20", label: "10年以上20年未満" },
  { value: "20+", label: "20年以上" },
];

export const REASON_OPTIONS: { value: LeaveReason; label: string }[] = [
  { value: "self", label: "自己都合" },
  { value: "company", label: "会社都合" },
  { value: "fixedTerm", label: "有期雇用未更新" },
  { value: "justSelf", label: "正当な理由のある自己都合" },
  { value: "retirement", label: "定年退職" },
];
