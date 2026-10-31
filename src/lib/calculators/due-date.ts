// 出産予定日 計算 logic. All dates handled in local time (no TZ shifts).

export type DueDateMode = "lmp" | "conception" | "reverse" | "ivf";

export type IvfEmbryoAge = 2 | 3 | 5;

const MS_PER_DAY = 86_400_000;

export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

export function diffDays(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.floor((b - a) / MS_PER_DAY);
}

export function parseDate(input: string): Date | null {
  if (!input) return null;
  const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [_, y, mo, d] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(mo) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return date;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${y}年${Number(m)}月${Number(d)}日（${weekdays[date.getDay()]}）`;
}

export type GestationalAge = {
  weeks: number;
  days: number;
  totalDays: number;
  label: string; // e.g. "12週3日"
};

export function gestationalAge(lmp: Date, today: Date): GestationalAge | null {
  const total = diffDays(lmp, today);
  if (total < 0) return null;
  const weeks = Math.floor(total / 7);
  const days = total % 7;
  return { weeks, days, totalDays: total, label: `${weeks}週${days}日` };
}

export type Trimester = {
  name: string;
  rangeLabel: string;
  startDate: Date;
  endDate: Date;
};

export type Milestone = {
  label: string;
  weekLabel: string;
  date: Date;
};

export type DueDateResult = {
  dueDate: Date; // 出産予定日 (40週0日)
  lmp: Date; // 最終月経開始日 (0週0日)
  conceptionDate: Date; // 排卵/受精想定日 (2週0日)
  gestational: GestationalAge | null; // today's 妊娠週数 (if LMP in the past)
  trimesters: Trimester[]; // 初期 / 中期 / 後期
  safeWindowStart: Date; // 37週0日
  safeWindowEnd: Date; // 41週6日
  daysRemaining: number; // days from today until the due date (negative if passed)
  milestones: Milestone[]; // dated pregnancy milestones (目安)
};

/**
 * Build a full calendar around a due date. `lmp` is treated as day 0
 * (40 weeks / 280 days before dueDate).
 */
export function buildDueDateResult(dueDate: Date, today: Date = new Date()): DueDateResult {
  const lmp = addDays(dueDate, -280);
  const conceptionDate = addDays(lmp, 14);
  const gestational = gestationalAge(lmp, today);

  const trimesters: Trimester[] = [
    {
      name: "妊娠初期",
      rangeLabel: "0週0日 〜 13週6日",
      startDate: lmp,
      endDate: addDays(lmp, 14 * 7 - 1),
    },
    {
      name: "妊娠中期",
      rangeLabel: "14週0日 〜 27週6日",
      startDate: addDays(lmp, 14 * 7),
      endDate: addDays(lmp, 28 * 7 - 1),
    },
    {
      name: "妊娠後期",
      rangeLabel: "28週0日 〜 出産まで",
      startDate: addDays(lmp, 28 * 7),
      endDate: addDays(lmp, 42 * 7 - 1),
    },
  ];

  const milestones: Milestone[] = [
    { label: "胎嚢（GS）確認の目安", weekLabel: "5週0日", date: addDays(lmp, 5 * 7) },
    { label: "心拍確認の目安", weekLabel: "6週ごろ", date: addDays(lmp, 6 * 7) },
    { label: "胎盤完成・安定期の目安", weekLabel: "16週0日", date: addDays(lmp, 16 * 7) },
    { label: "胎動を感じ始める目安", weekLabel: "18週ごろ", date: addDays(lmp, 18 * 7) },
    { label: "正期産の開始", weekLabel: "37週0日", date: addDays(lmp, 37 * 7) },
  ];

  return {
    dueDate,
    lmp,
    conceptionDate,
    gestational,
    trimesters,
    safeWindowStart: addDays(lmp, 37 * 7),
    safeWindowEnd: addDays(lmp, 42 * 7 - 1),
    daysRemaining: diffDays(today, dueDate),
    milestones,
  };
}

/** Mode 1: from LMP + cycle length. Due date = LMP + 280 + (cycle - 28). */
export function calcFromLmp(lmp: Date, cycleLength: number): Date {
  if (!Number.isFinite(cycleLength) || cycleLength < 21 || cycleLength > 40) {
    throw new Error("生理周期は21〜40日の範囲で入力してください");
  }
  return addDays(lmp, 280 + (cycleLength - 28));
}

/** Mode 2: from intercourse/ovulation date. Due date = date + 266. */
export function calcFromConception(conceptionDate: Date): Date {
  return addDays(conceptionDate, 266);
}

/** Mode 3: reverse — target conception/intercourse date from desired due date. */
export function calcTargetConception(desiredDueDate: Date): Date {
  return addDays(desiredDueDate, -266);
}

/**
 * Mode 4: IVF — from embryo transfer date. Fertilisation is taken as
 * (transfer date − embryo age in days); due date = fertilisation + 266 days.
 * Day-5 blastocyst → +261, day-3 embryo → +263, day-2 embryo → +264.
 */
export function calcFromIvf(transferDate: Date, embryoAge: IvfEmbryoAge): Date {
  if (embryoAge !== 2 && embryoAge !== 3 && embryoAge !== 5) {
    throw new Error("胚の種類（2日目胚・3日目胚・胚盤胞）を選択してください");
  }
  return addDays(transferDate, 266 - embryoAge);
}
