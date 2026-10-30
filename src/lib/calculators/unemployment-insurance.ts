/**
 * 失業保険（雇用保険 基本手当）計算ロジック
 * 令和8年8月1日改定の賃金日額・基本手当日額・所定給付日数に基づく
 * 概算計算（正式な支給額はハローワークの決定に従います）
 *
 * 出典（2026-10-30 確認）: 厚生労働省「雇用保険の基本手当日額が変更になります
 * 〜令和8年8月1日から〜」および算定式資料
 * https://www.mhlw.go.jp/content/001726934.pdf
 * https://www.mhlw.go.jp/content/001726936.pdf
 *
 * Wave 1B fix (M-04):
 *  - 賃金が 0 のとき下限額に引き上げて給付を計算していた誤りを修正（給付は 0）。
 *  - 給付率は、上下限適用後の基本手当日額から逆算し、表示額と一致させた。
 *  - 月あたり金額は認定周期の 28 日換算で統一（型コメントの「30日換算」を修正）。
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
  monthlyBenefit: number; // 月あたりの受給金額（28日換算：認定は通常4週間ごと）
  isLumpSum: boolean; // 65歳以上の高年齢求職者給付金
  notes: string[];
};

// 賃金日額 上限（令和8年8月1日）
const WAGE_MAX: Record<AgeBracket, number> = {
  u29: 14900,
  "30-34": 16540,
  "35-44": 16540,
  "45-59": 18220,
  "60-64": 17400,
  "65+": 17400,
};

// 賃金日額 下限（令和8年8月1日）
const WAGE_MIN = 3203;

// 基本手当日額 上限（令和8年8月1日）
const BENEFIT_DAILY_MAX: Record<AgeBracket, number> = {
  u29: 7450,
  "30-34": 8270,
  "35-44": 8270,
  "45-59": 9110,
  "60-64": 7830,
  "65+": 7830,
};

// 基本手当日額 下限（令和8年8月1日）
const BENEFIT_DAILY_MIN = 2562;

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

// 基本手当日額の算出（令和8年8月1日 スライド式・厚生労働省の算定式資料に基づく）
function benefitDailyRaw(w: number, age: AgeBracket): number {
  const isSenior = age === "60-64";
  let y = 0;

  if (isSenior) {
    // 60〜64歳
    if (w < 5480) {
      y = 0.8 * w;
    } else if (w <= 12120) {
      // 下記2式のうち低い方
      const y1 = 0.8 * w - 0.35 * ((w - 5480) / 6640) * w;
      const y2 = 0.05 * w + 4848; // 0.05w + (12,120 × 0.4)
      y = Math.min(y1, y2);
    } else {
      y = 0.45 * w;
    }
  } else {
    // 29歳以下・30〜44歳・45〜59歳
    if (w < 5480) {
      y = 0.8 * w;
    } else if (w <= 13490) {
      y = 0.8 * w - 0.3 * ((w - 5480) / 8010) * w;
    } else {
      y = 0.5 * w;
    }
  }

  return Math.floor(y);
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

  // 賃金が入力されていない（賃金日額が 0）の場合は給付なし。
  // 下限額へのクランプで給付が生まれることはない（M-04）。
  if (wageDailyRaw <= 0) {
    return {
      wageDaily: 0,
      wageDailyRaw: 0,
      benefitDaily: 0,
      benefitRate: 0,
      prescribedDays: 0,
      totalBenefit: 0,
      monthlyBenefit: 0,
      isLumpSum: age === "65+",
      notes: [
        "賃金が入力されていないため、給付金額は0円です。離職前6か月の賃金総額を入力してください。",
      ],
    };
  }

  const wageMax = WAGE_MAX[age];
  const wageDaily = Math.min(Math.max(wageDailyRaw, WAGE_MIN), wageMax);

  // 2. 基本手当日額（65歳以上は同じ計算式を60-64相当で使用）
  const ageForBenefit: AgeBracket = age === "65+" ? "60-64" : age;
  const y = benefitDailyRaw(wageDaily, ageForBenefit);
  const benefitMax = BENEFIT_DAILY_MAX[age];
  const benefitDailyValue = Math.min(Math.max(y, BENEFIT_DAILY_MIN), benefitMax);

  // 給付率は、上下限適用後の基本手当日額 ÷ 賃金日額（上下限適用後）で表示額と一致させる
  const rate = wageDaily > 0 ? benefitDailyValue / wageDaily : 0;

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
