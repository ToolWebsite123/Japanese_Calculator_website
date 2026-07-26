export type UnitCategory = "length" | "weight" | "temperature" | "currency";

type UnitDef = {
  id: string;
  label: string;
  /** Multiply to get base unit (meters, kilograms, celsius, JPY). */
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
};

const LENGTH_UNITS: UnitDef[] = [
  { id: "m", label: "m", toBase: (v) => v, fromBase: (v) => v },
  { id: "km", label: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { id: "cm", label: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  { id: "mm", label: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { id: "in", label: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  { id: "ft", label: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  { id: "mi", label: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  { id: "ri", label: "里", toBase: (v) => v * 3927.27, fromBase: (v) => v / 3927.27 },
];

const WEIGHT_UNITS: UnitDef[] = [
  { id: "kg", label: "kg", toBase: (v) => v, fromBase: (v) => v },
  { id: "g", label: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { id: "mg", label: "mg", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
  { id: "lb", label: "lb", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
  { id: "oz", label: "oz", toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
  { id: "t", label: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
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
  weight: WEIGHT_UNITS,
  temperature: TEMP_UNITS,
  currency: CURRENCY_UNITS,
};

export function getUnits(category: UnitCategory): { id: string; label: string }[] {
  return UNITS[category].map(({ id, label }) => ({ id, label }));
}

export function convertUnit(
  category: UnitCategory,
  value: number,
  fromId: string,
  toId: string,
): number {
  if (!Number.isFinite(value)) throw new Error("値が無効です");

  const units = UNITS[category];
  const from = units.find((u) => u.id === fromId);
  const to = units.find((u) => u.id === toId);
  if (!from || !to) throw new Error("不明な単位です");

  const base = from.toBase(value);
  return to.fromBase(base);
}
