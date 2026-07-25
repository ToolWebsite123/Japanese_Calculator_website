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
