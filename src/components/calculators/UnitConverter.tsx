"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { UnitConverterWorkedExamples } from "@/components/calculator/UnitConverterWorkedExamples";
import { SegmentedControl, SelectWell, Divider } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  convertToAllUnits,
  convertUnit,
  getUnits,
  type UnitCategory,
} from "@/lib/calculators/units";
import { formatDisplayNumber } from "@/lib/format";

// Category order matches the page content (unitsPage description/intro):
// length, area, weight, volume, temperature, speed, time, angle, pressure,
// energy, currency — all 11 categories the content and FAQ promise.
const CATEGORIES: UnitCategory[] = [
  "length",
  "area",
  "weight",
  "volume",
  "temperature",
  "speed",
  "time",
  "angle",
  "pressure",
  "energy",
  "currency",
];

// Sensible starting pair per category (the examples the page content uses).
const DEFAULT_PAIRS: Record<UnitCategory, [string, string]> = {
  length: ["m", "km"],
  area: ["tsubo", "m2"],
  weight: ["kg", "g"],
  volume: ["sho", "l"],
  temperature: ["c", "f"],
  speed: ["kmh", "ms"],
  time: ["h", "min"],
  angle: ["deg", "rad"],
  pressure: ["atm", "kpa"],
  energy: ["kcal", "kj"],
  currency: ["jpy", "usd"],
};

const sectionClass = "mt-16 border-t border-border pt-16";
const headingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const bodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

/** Static guide table, same markup pattern as the BMI page guide tables. */
function GuideTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) => (
                <td
                  key={`${row[0]}-${i}`}
                  data-label={head[i]}
                  className={`border border-border px-3 py-2 ${
                    i === 0 ? "font-semibold text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UnitConverter() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("1");
  const [fromId, setFromId] = useState("m");
  const [toId, setToId] = useState("km");
  const touchedRef = useRef(false);
  const lastHistoryKeyRef = useRef<string | null>(null);

  const units = useMemo(() => getUnits(category), [category]);

  const categoryLabel = (cat: UnitCategory) => {
    const map: Record<UnitCategory, string> = {
      length: t.units.length,
      area: t.units.area,
      weight: t.units.weight,
      volume: t.units.volume,
      temperature: t.units.temperature,
      speed: t.units.speed,
      time: t.units.time,
      angle: t.units.angle,
      pressure: t.units.pressure,
      energy: t.units.energy,
      currency: t.units.currency,
    };
    return map[cat];
  };

  function switchCategory(cat: UnitCategory) {
    touchedRef.current = true;
    setCategory(cat);
    const [from, to] = DEFAULT_PAIRS[cat];
    setFromId(from);
    setToId(to);
  }

  function swapUnits() {
    touchedRef.current = true;
    setFromId(toId);
    setToId(fromId);
  }

  // Live results, as the page's how-to text promises: the result and the
  // all-units list update as soon as the input changes (no button press).
  const parsed = value.trim() === "" ? null : Number(value);
  const isInvalid = parsed !== null && !Number.isFinite(parsed);
  const result = useMemo(() => {
    if (parsed === null || !Number.isFinite(parsed)) return null;
    try {
      return convertUnit(category, parsed, fromId, toId);
    } catch {
      return null;
    }
  }, [category, parsed, fromId, toId]);

  const allUnits = useMemo(() => {
    if (parsed === null || !Number.isFinite(parsed) || result === null) return null;
    try {
      return convertToAllUnits(category, parsed, fromId);
    } catch {
      return null;
    }
  }, [category, parsed, fromId, result]);

  useEffect(() => {
    if (result === null || !touchedRef.current) return;
    const key = `${category}|${value}|${fromId}|${toId}|${result}`;
    if (lastHistoryKeyRef.current === key) return;
    lastHistoryKeyRef.current = key;
    const fromLabel = units.find((u) => u.id === fromId)?.label ?? fromId;
    const toLabel = units.find((u) => u.id === toId)?.label ?? toId;
    addEntry({
      expression: `${value} ${fromLabel} → ${toLabel}`,
      result: formatDisplayNumber(result, 6),
      route: "/unit-converter",
    });
  }, [result, category, value, fromId, toId, units, addEntry]);

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.unitsPage.title}
      </h1>
      <CalculatorCard
        actions={
          result !== null ? <CopyResultButton value={formatDisplayNumber(result, 6)} /> : undefined
        }
      >
        <div className="space-y-4">
          <SegmentedControl
            value={category}
            onChange={switchCategory}
            columns={5}
            options={CATEGORIES.map((cat) => ({
              value: cat,
              label: categoryLabel(cat),
            }))}
          />

          <FormField
            label={t.units.value}
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => {
              touchedRef.current = true;
              setValue(e.target.value);
            }}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">{t.units.from}</span>
              <SelectWell
                value={fromId}
                onChange={(e) => {
                  touchedRef.current = true;
                  setFromId(e.target.value);
                }}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </SelectWell>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">{t.units.to}</span>
              <SelectWell
                value={toId}
                onChange={(e) => {
                  touchedRef.current = true;
                  setToId(e.target.value);
                }}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </SelectWell>
            </label>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={swapUnits}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text-primary transition hover:bg-surface-sunken"
            >
              ⇄ {t.units.swap}
            </button>
          </div>

          {isInvalid && <ErrorMessage message={t.common.invalidInput} />}

          {result !== null && (
            <>
              <ResultCard
                label={t.common.result}
                value={formatDisplayNumber(result, 6)}
                highlight
              />
              {allUnits && (
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {t.unitsPage.allUnitsTitle}
                  </h3>
                  <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
                    {allUnits.map((u) => (
                      <li
                        key={u.id}
                        className="flex items-baseline justify-between gap-3 border-b border-border py-1.5 text-sm"
                      >
                        <span className="text-text-secondary">{u.label}</span>
                        <span className="font-semibold text-text-primary">
                          {formatDisplayNumber(u.value, 6)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Divider>
                <UnitConverterWorkedExamples
                  value={value}
                  fromLabel={units.find((u) => u.id === fromId)?.label ?? fromId}
                  toLabel={units.find((u) => u.id === toId)?.label ?? toId}
                  result={formatDisplayNumber(result, 6)}
                />
              </Divider>
            </>
          )}

          {category === "currency" && (
            <p className="rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              {t.common.note}: {t.units.currencyNote}
            </p>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">{t.unitsPage.description}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.unitsPage.introParagraph} />
      </p>

      <section aria-labelledby="units-basis-heading" className={sectionClass}>
        <h2 id="units-basis-heading" className={headingClass}>
          {t.unitsPage.basisTitle}
        </h2>
        <p className={bodyClass}>{t.unitsPage.basisBody}</p>
        <GuideTable head={t.unitsPage.basisTableHead} rows={t.unitsPage.basisRows} />
      </section>

      <section aria-labelledby="units-examples-heading" className={sectionClass}>
        <h2 id="units-examples-heading" className={headingClass}>
          {t.unitsPage.examplesTitle}
        </h2>
        <GuideTable head={t.unitsPage.examplesTableHead} rows={t.unitsPage.examplesRows} />
      </section>

      <section aria-labelledby="units-tsubo-heading" className={sectionClass}>
        <h2 id="units-tsubo-heading" className={headingClass}>
          {t.unitsPage.tsuboTableTitle}
        </h2>
        <GuideTable head={t.unitsPage.tsuboTableHead} rows={t.unitsPage.tsuboRows} />
      </section>

      <section aria-labelledby="units-apply-heading" className={sectionClass}>
        <h2 id="units-apply-heading" className={headingClass}>
          {t.unitsPage.applyTitle}
        </h2>
        <div className="mt-4 space-y-6">
          {t.unitsPage.applyItems.map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-bold text-text-primary sm:text-lg">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="units-quick-heading" className={sectionClass}>
        <h2 id="units-quick-heading" className={headingClass}>
          {t.unitsPage.guideQuickTitle}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {t.unitsPage.guideQuickItems.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border bg-surface-sunken px-3 py-1.5 text-sm text-text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="units-mistakes-heading" className={sectionClass}>
        <h2 id="units-mistakes-heading" className={headingClass}>
          {t.unitsPage.mistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.unitsPage.mistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={t.unitsPage.howToTitle} steps={t.unitsPage.howToSteps} />

      <CalculatorFaqSection title={t.unitsPage.faqTitle} items={t.unitsPage.faqItems} />
      <RelatedCalculators activeHref="/unit-converter" />
    </>
  );
}
