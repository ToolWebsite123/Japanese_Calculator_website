// 時間計算 helpers: clock-time difference, clock + duration, decimal hours.
// All clock values are minutes since midnight (0–1439); durations are minutes
// (or seconds where named). Pure functions — the component stays live-reactive.

/** Parse an "HH:MM" clock string (from a time input) to minutes since midnight. */
export function parseClockTime(input: string): number | null {
  const m = input.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

/** Format minutes-since-midnight back to "H:MM" (zero-padded hour). */
export function formatClockTime(minutesOfDay: number): string {
  const wrapped = ((minutesOfDay % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const min = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export type ClockDifference = {
  minutes: number; // elapsed minutes from start to end
  nextDay: boolean; // true when end <= start was treated as the next day
};

/**
 * Elapsed minutes from a start clock time to an end clock time.
 * When the end is earlier than the start, the end is treated as next-day
 * (the standard overnight rule). Equal times give 0 minutes.
 */
export function clockDifference(startMin: number, endMin: number): ClockDifference {
  if (endMin < startMin) {
    return { minutes: endMin + 1440 - startMin, nextDay: true };
  }
  return { minutes: endMin - startMin, nextDay: false };
}

export type ClockOffset = {
  minutesOfDay: number; // resulting clock time, wrapped to 0–1439
  dayOffset: number; // -1 = previous day, 0 = same day, 1 = next day, etc.
};

/** Add (or subtract, for "before") a duration in minutes to a clock time. */
export function addToClock(
  startMin: number,
  durationMinutes: number,
  direction: "after" | "before",
): ClockOffset {
  const delta = direction === "after" ? durationMinutes : -durationMinutes;
  const total = startMin + delta;
  const dayOffset = Math.floor(total / 1440);
  const minutesOfDay = total - dayOffset * 1440;
  return { minutesOfDay, dayOffset };
}

/** "7時間30分" style label for a whole number of minutes. */
export function formatDurationMinutes(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h > 0 && m > 0) return `${sign}${h}時間${m}分`;
  if (h > 0) return `${sign}${h}時間`;
  return `${sign}${m}分`;
}

/**
 * Decimal-hours label with at most 2 decimals, trailing zeros trimmed:
 * 450 min -> "7.5", 255 min -> "4.25", 480 min -> "8".
 */
export function formatDecimalHoursFromMinutes(totalMinutes: number): string {
  return trimDecimal(totalMinutes / 60);
}

/** Same, from seconds (for results that carry a seconds part). */
export function formatDecimalHoursFromSeconds(totalSeconds: number): string {
  return trimDecimal(totalSeconds / 3600);
}

function trimDecimal(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
}
