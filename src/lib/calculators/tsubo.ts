/**
 * 坪・畳・㎡ (tsubo / tatami / square-metre) area conversion.
 *
 * Definitions (consistent with the unit converter's area category):
 * - 1 坪 = 400/121 ㎡ exactly (6 尺 × 6 尺, with 1 尺 = 10/33 m).
 * - 1 畳 depends on the tatami size. The default is the real-estate
 *   display standard of 1.62 ㎡ per 畳 (per the 不動産の表示に関する
 *   公正競争規約, a 畳 is at least 1.62 ㎡); regional sizes （京間・
 *   中京間・江戸間・団地間） can be selected instead.
 */

export const SQM_PER_TSUBO = 400 / 121;

export type TatamiType = "fudosan" | "kyoma" | "chukyoma" | "edoma" | "danchima";

export const TATAMI_SQM: Record<TatamiType, number> = {
  fudosan: 1.62,
  kyoma: 1.824,
  chukyoma: 1.652,
  edoma: 1.548,
  danchima: 1.445,
};

export type AreaUnit = "tsubo" | "sqm" | "jo";

export type AreaConversion = {
  tsubo: number;
  sqm: number;
  jo: number;
};

function toSqm(value: number, from: AreaUnit, tatami: TatamiType): number {
  switch (from) {
    case "sqm":
      return value;
    case "tsubo":
      return value * SQM_PER_TSUBO;
    case "jo":
      return value * TATAMI_SQM[tatami];
  }
}

/** Convert an area value into all three units at once. */
export function convertArea(value: number, from: AreaUnit, tatami: TatamiType): AreaConversion {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("面積が無効です");
  }
  const sqm = toSqm(value, from, tatami);
  return {
    sqm,
    tsubo: sqm / SQM_PER_TSUBO,
    jo: sqm / TATAMI_SQM[tatami],
  };
}

export function tsuboToSqm(tsubo: number): number {
  return convertArea(tsubo, "tsubo", "fudosan").sqm;
}

export function sqmToTsubo(sqm: number): number {
  return convertArea(sqm, "sqm", "fudosan").tsubo;
}
