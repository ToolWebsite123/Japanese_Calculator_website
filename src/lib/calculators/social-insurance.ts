/**
 * 社会保険料（健康保険・介護保険・子ども・子育て支援金・厚生年金・雇用保険）
 * 本人負担分の概算計算 — 令和8年度（2026年度）の料率・等級表に基づく。
 *
 * Wave 1B fix (H-03). 以前の実装（コンポーネント内蔵）の誤り:
 *  1. 雇用保険を本人料率で計算したうえに更に ÷2 していた
 *     （雇用保険は労使折半ではない。令和8年度 一般の事業の本人負担は 5/1000）。
 *  2. 健康保険料率が令和6年度のままだった。
 *  3. 標準報酬月額の等級・上限がなく、¥1,000,000 の給与に厚生年金
 *     ¥91,500 と計算していた（正しくは上限 650,000 円で ¥59,475）。
 *
 * 料率・等級の出典（2026-10-30 確認）:
 *  - 健康保険料率（都道府県別）・介護保険料率 1.62%・子ども・子育て支援金率 0.23%:
 *    全国健康保険協会（協会けんぽ）「令和8年度の保険料率」
 *    https://www.kyoukaikenpo.or.jp/about/business/insurance_rate/rate_prefectures/r08/
 *    （令和8年3月分から適用、支援金率は令和8年4月分から）
 *  - 厚生年金保険料率 18.3%（本人 9.15%）・標準報酬月額 32等級（88,000〜650,000円）:
 *    日本年金機構 https://www.nenkin.go.jp/service/kounen/hokenryo/hoshu/20150515-01.html
 *  - 標準報酬月額の等級表（健康保険 50等級 58,000〜1,390,000円・報酬月額の範囲）:
 *    健康保険法の等級表（協会けんぽ令和8年度保険料額表と照合）
 *  - 雇用保険料率（一般の事業・本人負担 5/1000、令和8年4月1日〜令和9年3月31日）:
 *    厚生労働省「令和8（2026）年度 雇用保険料率のご案内」
 *    https://www.mhlw.go.jp/content/001692566.pdf
 */

/** 令和8年度 協会けんぽ 都道府県別 健康保険料率（%） */
export const PREFECTURES: { name: string; rate: number }[] = [
  { name: "北海道", rate: 10.28 },
  { name: "青森県", rate: 9.85 },
  { name: "岩手県", rate: 9.51 },
  { name: "宮城県", rate: 10.1 },
  { name: "秋田県", rate: 10.01 },
  { name: "山形県", rate: 9.75 },
  { name: "福島県", rate: 9.5 },
  { name: "茨城県", rate: 9.52 },
  { name: "栃木県", rate: 9.82 },
  { name: "群馬県", rate: 9.68 },
  { name: "埼玉県", rate: 9.67 },
  { name: "千葉県", rate: 9.73 },
  { name: "東京都", rate: 9.85 },
  { name: "神奈川県", rate: 9.92 },
  { name: "新潟県", rate: 9.21 },
  { name: "富山県", rate: 9.59 },
  { name: "石川県", rate: 9.7 },
  { name: "福井県", rate: 9.71 },
  { name: "山梨県", rate: 9.55 },
  { name: "長野県", rate: 9.63 },
  { name: "岐阜県", rate: 9.8 },
  { name: "静岡県", rate: 9.61 },
  { name: "愛知県", rate: 9.93 },
  { name: "三重県", rate: 9.77 },
  { name: "滋賀県", rate: 9.88 },
  { name: "京都府", rate: 9.89 },
  { name: "大阪府", rate: 10.13 },
  { name: "兵庫県", rate: 10.12 },
  { name: "奈良県", rate: 9.91 },
  { name: "和歌山県", rate: 10.06 },
  { name: "鳥取県", rate: 9.86 },
  { name: "島根県", rate: 9.94 },
  { name: "岡山県", rate: 10.05 },
  { name: "広島県", rate: 9.78 },
  { name: "山口県", rate: 10.15 },
  { name: "徳島県", rate: 10.24 },
  { name: "香川県", rate: 10.02 },
  { name: "愛媛県", rate: 9.98 },
  { name: "高知県", rate: 10.05 },
  { name: "福岡県", rate: 10.11 },
  { name: "佐賀県", rate: 10.55 },
  { name: "長崎県", rate: 10.06 },
  { name: "熊本県", rate: 10.08 },
  { name: "大分県", rate: 10.08 },
  { name: "宮崎県", rate: 9.77 },
  { name: "鹿児島県", rate: 10.13 },
  { name: "沖縄県", rate: 9.44 },
];

export const CARE_RATE = 0.0162; // 介護保険料率（令和8年度・全国一律、40〜64歳）
export const CHILD_SUPPORT_RATE = 0.0023; // 子ども・子育て支援金率（令和8年4月分〜・全国一律）
export const PENSION_RATE = 0.183; // 厚生年金保険料率（本人 9.15%）
export const EMPLOYMENT_RATE = 0.005; // 雇用保険 本人負担（令和8年度・一般の事業、折半ではない）

export const RATES_BASIS_LABEL =
  "令和8年度（2026年度）の料率で計算しています（健康保険：協会けんぽ、介護保険：1.62%、子ども・子育て支援金：0.23%、厚生年金：18.3%、雇用保険：0.5%＝一般の事業の本人負担）";

/**
 * 標準報酬月額の等級表（健康保険 50等級）。
 * standard: 標準報酬月額, lower: その等級になる報酬月額の下限（含む）。
 * 厚生年金は同じ表の 88,000円〜650,000円 の範囲（32等級）を使う。
 */
const GRADE_TABLE: { standard: number; lower: number }[] = [
  { standard: 58000, lower: 0 },
  { standard: 68000, lower: 63000 },
  { standard: 78000, lower: 73000 },
  { standard: 88000, lower: 83000 },
  { standard: 98000, lower: 93000 },
  { standard: 104000, lower: 101000 },
  { standard: 110000, lower: 107000 },
  { standard: 118000, lower: 114000 },
  { standard: 126000, lower: 122000 },
  { standard: 134000, lower: 130000 },
  { standard: 142000, lower: 138000 },
  { standard: 150000, lower: 146000 },
  { standard: 160000, lower: 155000 },
  { standard: 170000, lower: 165000 },
  { standard: 180000, lower: 175000 },
  { standard: 190000, lower: 185000 },
  { standard: 200000, lower: 195000 },
  { standard: 220000, lower: 210000 },
  { standard: 240000, lower: 230000 },
  { standard: 260000, lower: 250000 },
  { standard: 280000, lower: 270000 },
  { standard: 300000, lower: 290000 },
  { standard: 320000, lower: 310000 },
  { standard: 340000, lower: 330000 },
  { standard: 360000, lower: 350000 },
  { standard: 380000, lower: 370000 },
  { standard: 410000, lower: 395000 },
  { standard: 440000, lower: 425000 },
  { standard: 470000, lower: 455000 },
  { standard: 500000, lower: 485000 },
  { standard: 530000, lower: 515000 },
  { standard: 560000, lower: 545000 },
  { standard: 590000, lower: 575000 },
  { standard: 620000, lower: 605000 },
  { standard: 650000, lower: 635000 },
  { standard: 680000, lower: 665000 },
  { standard: 710000, lower: 695000 },
  { standard: 750000, lower: 730000 },
  { standard: 790000, lower: 770000 },
  { standard: 830000, lower: 810000 },
  { standard: 880000, lower: 855000 },
  { standard: 930000, lower: 905000 },
  { standard: 980000, lower: 955000 },
  { standard: 1030000, lower: 1005000 },
  { standard: 1090000, lower: 1055000 },
  { standard: 1150000, lower: 1115000 },
  { standard: 1210000, lower: 1175000 },
  { standard: 1270000, lower: 1235000 },
  { standard: 1330000, lower: 1295000 },
  { standard: 1390000, lower: 1355000 },
];

const PENSION_MIN_STANDARD = 88000;
const PENSION_MAX_STANDARD = 650000;
const HEALTH_MAX_STANDARD = 1390000;

/** 報酬月額から標準報酬月額を求める（健康保険の等級表） */
export function standardMonthlyForHealth(monthlyRemuneration: number): number {
  const salary = Math.max(0, Math.floor(monthlyRemuneration));
  let result = GRADE_TABLE[0].standard;
  for (const grade of GRADE_TABLE) {
    if (salary >= grade.lower) result = grade.standard;
    else break;
  }
  return Math.min(result, HEALTH_MAX_STANDARD);
}

/** 報酬月額から厚生年金の標準報酬月額を求める（88,000〜650,000円にクランプ） */
export function standardMonthlyForPension(monthlyRemuneration: number): number {
  return Math.min(
    Math.max(standardMonthlyForHealth(monthlyRemuneration), PENSION_MIN_STANDARD),
    PENSION_MAX_STANDARD,
  );
}

/** 標準賞与額（1,000円未満切捨て＋上限） */
export function standardBonusAmount(bonus: number, kind: "health" | "pension"): number {
  const truncated = Math.floor(Math.max(0, bonus) / 1000) * 1000;
  // 健康保険: 年度累計 573万円が上限（本計算では1回分として同額を上限にする）
  // 厚生年金: 1回あたり 150万円が上限
  return kind === "health" ? Math.min(truncated, 5730000) : Math.min(truncated, 1500000);
}

/** 折半額の端数処理（50銭以下は切捨て、50銭超は切上げ） */
function splitPremium(standardAmount: number, rate: number): number {
  const half = (standardAmount * rate) / 2 + 1e-9;
  const floored = Math.floor(half);
  return half - floored > 0.5 ? floored + 1 : floored;
}

export type SocialInsuranceInput = {
  monthlySalary: number; // 報酬月額（円）
  bonus: number; // 賞与額（円、含めない場合は 0）
  age: number;
  prefectureIndex: number; // PREFECTURES のインデックス
};

export type SocialInsuranceResult = {
  salary: number;
  bonus: number;
  prefName: string;
  standardMonthlyHealth: number;
  standardMonthlyPension: number;
  standardBonusHealth: number;
  standardBonusPension: number;
  healthRate: number; // 小数（例 0.0985）
  careRate: number; // 小数（40〜64歳以外は 0）
  childRate: number;
  pensionRate: number;
  employmentRate: number;
  salaryHealth: number;
  bonusHealth: number;
  healthValue: number;
  salaryCare: number;
  bonusCare: number;
  careValue: number;
  salaryChild: number;
  bonusChild: number;
  childValue: number;
  salaryPension: number;
  bonusPension: number;
  pensionValue: number;
  salaryEmployment: number;
  bonusEmployment: number;
  employmentValue: number;
  totalDeduction: number;
};

export function calcSocialInsurance(input: SocialInsuranceInput): SocialInsuranceResult {
  const salary = Number.isFinite(input.monthlySalary) ? Math.max(0, input.monthlySalary) : 0;
  const bonus = Number.isFinite(input.bonus) ? Math.max(0, input.bonus) : 0;
  const age = Number.isFinite(input.age) ? input.age : 0;
  const pref = PREFECTURES[input.prefectureIndex] ?? PREFECTURES[12];

  const healthRate = pref.rate / 100;
  const careRate = age >= 40 && age <= 64 ? CARE_RATE : 0;

  const standardMonthlyHealth = standardMonthlyForHealth(salary);
  const standardMonthlyPension = standardMonthlyForPension(salary);
  const standardBonusHealth = standardBonusAmount(bonus, "health");
  const standardBonusPension = standardBonusAmount(bonus, "pension");

  const salaryHealth = splitPremium(standardMonthlyHealth, healthRate);
  const bonusHealth = splitPremium(standardBonusHealth, healthRate);
  const salaryCare = careRate > 0 ? splitPremium(standardMonthlyHealth, careRate) : 0;
  const bonusCare = careRate > 0 ? splitPremium(standardBonusHealth, careRate) : 0;
  const salaryChild = splitPremium(standardMonthlyHealth, CHILD_SUPPORT_RATE);
  const bonusChild = splitPremium(standardBonusHealth, CHILD_SUPPORT_RATE);
  const salaryPension = splitPremium(standardMonthlyPension, PENSION_RATE);
  const bonusPension = splitPremium(standardBonusPension, PENSION_RATE);

  // 雇用保険: 賃金（給与・賞与の実額）× 本人料率。そのまま1回だけ適用する（折半しない）。
  // 円未満は切捨て。
  const salaryEmployment = Math.floor(salary * EMPLOYMENT_RATE);
  const bonusEmployment = Math.floor(bonus * EMPLOYMENT_RATE);

  const healthValue = salaryHealth + bonusHealth;
  const careValue = salaryCare + bonusCare;
  const childValue = salaryChild + bonusChild;
  const pensionValue = salaryPension + bonusPension;
  const employmentValue = salaryEmployment + bonusEmployment;

  return {
    salary,
    bonus,
    prefName: pref.name,
    standardMonthlyHealth,
    standardMonthlyPension,
    standardBonusHealth,
    standardBonusPension,
    healthRate,
    careRate,
    childRate: CHILD_SUPPORT_RATE,
    pensionRate: PENSION_RATE,
    employmentRate: EMPLOYMENT_RATE,
    salaryHealth,
    bonusHealth,
    healthValue,
    salaryCare,
    bonusCare,
    careValue,
    salaryChild,
    bonusChild,
    childValue,
    salaryPension,
    bonusPension,
    pensionValue,
    salaryEmployment,
    bonusEmployment,
    employmentValue,
    totalDeduction: healthValue + careValue + childValue + pensionValue + employmentValue,
  };
}
