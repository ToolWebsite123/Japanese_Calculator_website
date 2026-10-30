"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { UnitConverterWorkedExamples } from "@/components/calculator/UnitConverterWorkedExamples";
import { PrimaryButton, SegmentedControl, SelectWell, Divider } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { convertUnit, getUnits, type UnitCategory } from "@/lib/calculators/units";
import { formatDisplayNumber } from "@/lib/format";

const CATEGORIES: UnitCategory[] = ["length", "weight", "temperature", "currency"];

export function UnitConverter() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("1");
  const [fromId, setFromId] = useState("m");
  const [toId, setToId] = useState("km");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const units = useMemo(() => getUnits(category), [category]);

  function switchCategory(cat: UnitCategory) {
    setCategory(cat);
    const list = getUnits(cat);
    setFromId(list[0].id);
    setToId(list[1]?.id ?? list[0].id);
    setResult(null);
    setError(null);
  }

  const categoryLabel = (cat: UnitCategory) => {
    const map = {
      length: t.units.length,
      weight: t.units.weight,
      temperature: t.units.temperature,
      currency: t.units.currency,
    };
    return map[cat];
  };

  function handleCalculate() {
    const n = parseFloat(value);
    if (!Number.isFinite(n) || value.trim() === "") {
      setResult(null);
      setError(t.common.invalidInput);
      return;
    }
    try {
      const res = convertUnit(category, n, fromId, toId);
      setResult(res);
      setError(null);
      const fromLabel = units.find((u) => u.id === fromId)?.label ?? fromId;
      const toLabel = units.find((u) => u.id === toId)?.label ?? toId;
      addEntry({
        expression: `${value} ${fromLabel} → ${toLabel}`,
        result: formatDisplayNumber(res, 6),
        route: "/unit-converter",
      });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

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
            columns={4}
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
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">{t.units.from}</span>
              <SelectWell value={fromId} onChange={(e) => setFromId(e.target.value)}>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </SelectWell>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">{t.units.to}</span>
              <SelectWell value={toId} onChange={(e) => setToId(e.target.value)}>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </SelectWell>
            </label>
          </div>

          <PrimaryButton onClick={handleCalculate}>{t.common.calculate}</PrimaryButton>

          {error && <ErrorMessage message={error} />}

          {result !== null && (
            <>
              <ResultCard
                label={t.common.result}
                value={formatDisplayNumber(result, 6)}
                highlight
              />
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
        <p className="text-sm text-text-secondary sm:text-base">
          {t.unitsPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.unitsPage.introParagraph} />
      </p>

      <CalculatorHowToSection title={t.unitsPage.howToTitle} steps={t.unitsPage.howToSteps} />

      <CalculatorFaqSection title={t.unitsPage.faqTitle} items={t.unitsPage.faqItems} />
      <RelatedCalculators activeHref="/unit-converter" />
    </>
  );
}
