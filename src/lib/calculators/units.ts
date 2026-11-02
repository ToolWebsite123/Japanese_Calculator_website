/**
 * Unit converter library — 11 categories, as specified by the page content
 * (src/lib/i18n/ja.ts `unitsPage`) and the UC-01…UC-06 test suite:
 * length, area, weight, volume, temperature, speed, time, angle, pressure,
 * energy and currency, including traditional Japanese units (shakkanho).
 *
 * Every category converts via a base unit (metres, square metres, kilograms,
 * litres, celsius, metres/second, seconds, degrees, kilopascals, kilojoules,
 * JPY). Definitions follow the page's basis table: 1 shaku = 10/33 m,
 * 1 tsubo = 400/121 m2 (6 shaku x 6 shaku), 1 jo = 1.62 m2 (real-estate
 * convention), 1 sho = 1.803906837 L, 1 ri = 43,200/11 m.
 */
export type UnitCategory =
  | "length"
  | "area"
  | "weight"
  | "volume"
  | "temperature"
  | "speed"
  | "time"
  | "angle"
  | "pressure"
  | "energy"
  | "currency";

type UnitDef = {
  id: string;
  label: string;
  /** Convert a value in this unit to the category base unit. */
  toBase: (v: number) => number;
  /** Convert a base-unit value back to this unit. */
  fromBase: (v: number) => number;
};

/** Linear unit defined by one exact factor against the base unit. */
function linear(id: string, label: string, factor: number): UnitDef {
  return { id, label, toBase: (v) => v * factor, fromBase: (v) => v / factor };
}

const LENGTH_UNITS: UnitDef[] = [
  { id: "m", label: "m", toBase: (v) => v, fromBase: (v) => v },
  { id: "km", label: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { id: "cm", label: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  { id: "mm", label: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  linear("um", "µm", 1e-6),
  { id: "in", label: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  { id: "ft", label: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  linear("yd", "yd", 0.9144),
  { id: "mi", label: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  linear("nmi", "海里", 1852),
  // Shakkanho (traditional Japanese units): 1 shaku = 10/33 m exactly.
  linear("bu", "分", 1 / 330),
  linear("sun", "寸", 1 / 33),
  linear("shaku", "尺", 10 / 33),
  linear("ken", "間", 60 / 33),
  linear("take", "丈", 100 / 33),
  linear("cho", "町", 3600 / 33),
  // 1 ri = 36 cho = 43,200/11 m (the page FAQ states this exact definition).
  linear("ri", "里", 43200 / 11),
];

const AREA_UNITS: UnitDef[] = [
  linear("m2", "㎡", 1),
  // 1 tsubo = (60/33 m)^2 = 400/121 m2; se/tan/cho are 30/300/3000 tsubo.
  linear("tsubo", "坪", 400 / 121),
  // 1 jo = 1.62 m2 (real-estate display convention, per the page content).
  linear("jo", "畳", 1.62),
  linear("km2", "km²", 1e6),
  linear("ha", "ha", 1e4),
  linear("a", "a", 100),
  linear("se", "畝", 12000 / 121),
  linear("tan", "反", 120000 / 121),
  linear("cho", "町", 1200000 / 121),
];

const WEIGHT_UNITS: UnitDef[] = [
  { id: "kg", label: "kg", toBase: (v) => v, fromBase: (v) => v },
  { id: "g", label: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { id: "mg", label: "mg", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
  { id: "lb", label: "lb", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
  { id: "oz", label: "oz", toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
  { id: "t", label: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  // Shakkanho weights: 1 monme = 3.75 g, 1 ryo = 10 monme, 1 kin = 160 monme,
  // 1 kan = 1000 monme = 3.75 kg.
  linear("monme", "匁", 0.00375),
  linear("ryo", "両", 0.0375),
  linear("kin", "斤", 0.6),
  linear("kan", "貫", 3.75),
];

/** 1 sho (升) in litres — the traditional exact value behind "1.8039 L". */
const SHO_LITRES = 1.803906837;

const VOLUME_UNITS: UnitDef[] = [
  linear("l", "L", 1),
  linear("ml", "mL", 0.001),
  linear("m3", "m³", 1000),
  linear("floz", "液量オンス", 0.0295735295625),
  linear("gal", "ガロン", 3.785411784),
  // Shakkanho volumes: 1 koku = 100 sho, 1 to = 10 sho, 1 gou = 1/10 sho,
  // 1 shaku (勺) = 1/100 sho.
  linear("shaku", "勺", SHO_LITRES / 100),
  linear("gou", "合", SHO_LITRES / 10),
  linear("sho", "升", SHO_LITRES),
  linear("to", "斗", SHO_LITRES * 10),
  linear("koku", "石", SHO_LITRES * 100),
];

const TEMP_UNITS: UnitDef[] = [
  {
    id: "c",
    label: "°C",
    toBase: (v) => v,
    fromBase: (v) => v,
  },
  {
    id: "f",
    label: "°F",
    toBase: (v) => ((v - 32) * 5) / 9,
    fromBase: (v) => (v * 9) / 5 + 32,
  },
  {
    id: "k",
    label: "K",
    toBase: (v) => v - 273.15,
    fromBase: (v) => v + 273.15,
  },
];

const SPEED_UNITS: UnitDef[] = [
  {
    id: "kmh",
    label: "km/h",
    toBase: (v) => (v * 1000) / 3600,
    fromBase: (v) => (v * 3600) / 1000,
  },
  linear("ms", "m/s", 1),
  linear("mph", "mph", 0.44704),
  // 1 knot = 1 nautical mile (1852 m) per hour.
  {
    id: "knot",
    label: "ノット",
    toBase: (v) => (v * 1852) / 3600,
    fromBase: (v) => (v * 3600) / 1852,
  },
];

const TIME_UNITS: UnitDef[] = [
  linear("h", "時間", 3600),
  linear("min", "分", 60),
  linear("s", "秒", 1),
  linear("ms", "ms", 0.001),
  linear("day", "日", 86400),
  linear("week", "週間", 604800),
  // 1 year = 365 days (conversion convention).
  linear("year", "年", 31536000),
];

const ANGLE_UNITS: UnitDef[] = [
  linear("deg", "度", 1),
  {
    id: "rad",
    label: "rad",
    toBase: (v) => (v * 180) / Math.PI,
    fromBase: (v) => (v * Math.PI) / 180,
  },
  linear("grad", "グラード", 0.9),
  linear("turn", "回転", 360),
];

const PRESSURE_UNITS: UnitDef[] = [
  linear("kpa", "kPa", 1),
  linear("hpa", "hPa", 0.1),
  linear("pa", "Pa", 0.001),
  linear("atm", "atm", 101.325),
  linear("bar", "bar", 100),
  // 1 mmHg = 1/760 atm.
  linear("mmhg", "mmHg", 101.325 / 760),
  linear("psi", "psi", 6.894757293),
];

const ENERGY_UNITS: UnitDef[] = [
  linear("kj", "kJ", 1),
  linear("j", "J", 0.001),
  linear("cal", "cal", 0.004184),
  linear("kcal", "kcal", 4.184),
  linear("wh", "Wh", 3.6),
  linear("kwh", "kWh", 3600),
  linear("btu", "BTU", 1.055055853),
];

/** Approximate rates to JPY (static demo rates). */
const CURRENCY_UNITS: UnitDef[] = [
  { id: "jpy", label: "JPY ¥", toBase: (v) => v, fromBase: (v) => v },
  { id: "usd", label: "USD $", toBase: (v) => v * 150, fromBase: (v) => v / 150 },
  { id: "eur", label: "EUR €", toBase: (v) => v * 163, fromBase: (v) => v / 163 },
  { id: "cny", label: "CNY ¥", toBase: (v) => v * 21, fromBase: (v) => v / 21 },
  { id: "krw", label: "KRW ₩", toBase: (v) => v * 0.11, fromBase: (v) => v / 0.11 },
  { id: "gbp", label: "GBP £", toBase: (v) => v * 190, fromBase: (v) => v / 190 },
];

const UNITS: Record<UnitCategory, UnitDef[]> = {
  length: LENGTH_UNITS,
  area: AREA_UNITS,
  weight: WEIGHT_UNITS,
  volume: VOLUME_UNITS,
  temperature: TEMP_UNITS,
  speed: SPEED_UNITS,
  time: TIME_UNITS,
  angle: ANGLE_UNITS,
  pressure: PRESSURE_UNITS,
  energy: ENERGY_UNITS,
  currency: CURRENCY_UNITS,
};

function unitsFor(category: UnitCategory): UnitDef[] {
  const units = UNITS[category];
  if (!units) throw new Error("不明なカテゴリです");
  return units;
}

export function getUnits(category: UnitCategory): { id: string; label: string }[] {
  return unitsFor(category).map(({ id, label }) => ({ id, label }));
}

export function convertUnit(
  category: UnitCategory,
  value: number,
  fromId: string,
  toId: string,
): number {
  if (!Number.isFinite(value)) throw new Error("値が無効です");

  const units = unitsFor(category);
  const from = units.find((u) => u.id === fromId);
  const to = units.find((u) => u.id === toId);
  if (!from || !to) throw new Error("不明な単位です");

  const base = from.toBase(value);
  return to.fromBase(base);
}

export type UnitConversion = { id: string; label: string; value: number };

/**
 * Convert a value into every unit of its category — the "show in all units"
 * list promised by the unit-converter page's how-to text.
 */
export function convertToAllUnits(
  category: UnitCategory,
  value: number,
  fromId: string,
): UnitConversion[] {
  return unitsFor(category).map((unit) => ({
    id: unit.id,
    label: unit.label,
    value: convertUnit(category, value, fromId, unit.id),
  }));
}
