// パーセント計算 helpers: the four percentage modes + 歩合 conversion.
// Pure functions; null means "cannot be computed" (division by zero).

/** Mode 1: whole の pct% はいくつか. */
export function percentOf(whole: number, pct: number): number {
  return whole * (pct / 100);
}

/** Mode 2: part は whole の何%か. Null when whole is 0. */
export function ratioPercent(part: number, whole: number): number | null {
  if (whole === 0) return null;
  return (part / whole) * 100;
}

/** Mode 3: from から to への変化率（%). Null when from is 0. */
export function changePercent(from: number, to: number): number | null {
  if (from === 0) return null;
  return ((to - from) / Math.abs(from)) * 100;
}

/** Mode 4 （逆算）: part が pct% にあたるとき、全体はいくつか. Null when pct is 0. */
export function wholeFromPart(part: number, pct: number): number | null {
  if (pct === 0) return null;
  return part / (pct / 100);
}

/**
 * Percent -> 歩合（割・分・厘）label, e.g. 20 -> "2割", 25 -> "2割5分",
 * 25.5 -> "2割5分5厘", 100 -> "10割". Returns null outside 0 < pct <= 100,
 * where a 歩合 label is not shown.
 */
export function percentToBuai(pct: number): string | null {
  if (!Number.isFinite(pct) || pct <= 0 || pct > 100) return null;
  const totalRin = Math.round(pct * 10); // 1厘 = 0.1%
  const wari = Math.floor(totalRin / 100);
  const bu = Math.floor((totalRin % 100) / 10);
  const rin = totalRin % 10;
  const parts: string[] = [];
  if (wari > 0) parts.push(`${wari}割`);
  if (bu > 0) parts.push(`${bu}分`);
  if (rin > 0) parts.push(`${rin}厘`);
  return parts.length > 0 ? parts.join("") : null;
}
