export type EraId = "reiwa" | "heisei" | "showa" | "taisho" | "meiji";

export type EraDef = {
  id: EraId;
  nameJa: string;
  nameEn: string;
  startYear: number;
  endYear: number | null;
};

export const ERAS: EraDef[] = [
  { id: "reiwa", nameJa: "令和", nameEn: "Reiwa", startYear: 2019, endYear: null },
  { id: "heisei", nameJa: "平成", nameEn: "Heisei", startYear: 1989, endYear: 2019 },
  { id: "showa", nameJa: "昭和", nameEn: "Showa", startYear: 1926, endYear: 1989 },
  { id: "taisho", nameJa: "大正", nameEn: "Taisho", startYear: 1912, endYear: 1926 },
  { id: "meiji", nameJa: "明治", nameEn: "Meiji", startYear: 1868, endYear: 1912 },
];

export function westernToEra(year: number): { era: EraDef; eraYear: number } | null {
  if (!Number.isInteger(year) || year < 1868) return null;

  for (const era of ERAS) {
    const end = era.endYear ?? Infinity;
    if (year >= era.startYear && year < end) {
      return { era, eraYear: year - era.startYear + 1 };
    }
    // Era change years: both eras valid; prefer newer era for that year
    if (era.endYear === year) {
      continue;
    }
  }

  // Handle transition years belonging to previous era's last year
  for (const era of ERAS) {
    if (era.endYear === year) {
      return { era, eraYear: year - era.startYear + 1 };
    }
  }

  return null;
}

export function eraToWestern(eraId: EraId, eraYear: number): number | null {
  const era = ERAS.find((e) => e.id === eraId);
  if (!era || !Number.isInteger(eraYear) || eraYear < 1) return null;

  const western = era.startYear + eraYear - 1;
  const end = era.endYear ?? Infinity;
  if (western >= end && era.endYear !== western) return null;
  if (era.endYear && western > era.endYear) return null;

  return western;
}

/**
 * Every era a western year belongs to. Era-change years belong to two eras
 * (e.g. 2019 is both Heisei 31 and Reiwa 1); the newer era comes first.
 * Added for the ERA test suite (ERA-03) — the year-level page UI keeps using
 * westernToEra/eraToWestern above, unchanged.
 */
export function westernToEras(year: number): { era: EraDef; eraYear: number }[] {
  if (!Number.isInteger(year) || year < 1868) return [];

  return ERAS.filter((era) => {
    const end = era.endYear ?? Infinity;
    return year >= era.startYear && year <= end;
  }).map((era) => ({ era, eraYear: year - era.startYear + 1 }));
}

/** First calendar day of each era (Meiji uses the year convention, Jan 1). */
const ERA_START_DATES: Record<EraId, [number, number, number]> = {
  meiji: [1868, 1, 1],
  taisho: [1912, 7, 30],
  showa: [1926, 12, 25],
  heisei: [1989, 1, 8],
  reiwa: [2019, 5, 1],
};

function dateKey(year: number, month: number, day: number): number {
  return year * 10000 + month * 100 + day;
}

function isValidDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/**
 * Convert an exact western date to its era, applying the real era-change
 * dates (e.g. 1989-01-07 is Showa 64, 1989-01-08 is Heisei 1). Returns null
 * for non-existent dates and dates before 1868.
 */
export function westernDateToEra(
  year: number,
  month: number,
  day: number,
): { era: EraDef; eraYear: number } | null {
  if (!isValidDate(year, month, day) || year < 1868) return null;

  const key = dateKey(year, month, day);
  // ERAS is newest-first: the first era whose start date is on/before the
  // given date is the era that date belongs to.
  for (const era of ERAS) {
    const [sy, sm, sd] = ERA_START_DATES[era.id];
    if (key >= dateKey(sy, sm, sd)) {
      return { era, eraYear: year - era.startYear + 1 };
    }
  }
  return null;
}

/**
 * Convert an exact era date back to a western date. Dates that never existed
 * in that era (e.g. Showa 64-01-08, Reiwa 1-04-30) return null, as do
 * non-existent calendar dates.
 */
export function eraDateToWestern(
  eraId: EraId,
  eraYear: number,
  month: number,
  day: number,
): { year: number; month: number; day: number } | null {
  const year = eraToWestern(eraId, eraYear);
  if (year === null || !isValidDate(year, month, day)) return null;

  const back = westernDateToEra(year, month, day);
  if (!back || back.era.id !== eraId || back.eraYear !== eraYear) return null;

  return { year, month, day };
}

const ZODIAC_SIGNS = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

/** Japanese zodiac (eto) of a western year; the cycle anchor is 4 AD = 子. */
export function zodiacOf(year: number): string {
  const index = (((year - 4) % 12) + 12) % 12;
  return ZODIAC_SIGNS[index];
}
