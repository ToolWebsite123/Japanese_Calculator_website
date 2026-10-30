"use client";

import { useState } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { PrimaryButton } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { calculateBmi, type BmiCategory, type BmiResult } from "@/lib/calculators/bmi";

// H-09 (WCAG AA): light-mode text shades darkened one step where the -600
// shade failed 4.5:1 on white (sky-600 4.10, emerald-600 3.77, amber-600 3.19,
// orange-600 3.56). -700 shades: sky 5.93, emerald 5.48, amber 5.02, orange 5.18.
// red-600 (4.83) and red-800 (8.31) already pass, so they are unchanged.
// Dark-mode -400/-300 shades all measure >= 6.3:1 on the dark card, unchanged.
const categoryColors: Record<BmiCategory, string> = {
  underweight: "text-sky-700 dark:text-sky-400",
  normal: "text-emerald-700 dark:text-emerald-400",
  obese1: "text-amber-700 dark:text-amber-400",
  obese2: "text-orange-700 dark:text-orange-400",
  obese3: "text-red-600 dark:text-red-400",
  obese4: "text-red-800 dark:text-red-300",
};

const rangeSegments: { key: BmiCategory; from: number; to: number; bar: string }[] = [
  {
    key: "underweight",
    from: 15,
    to: 18.5,
    bar: "bg-sky-400 dark:bg-sky-500",
  },
  {
    key: "normal",
    from: 18.5,
    to: 25,
    bar: "bg-emerald-400 dark:bg-emerald-500",
  },
  {
    key: "obese1",
    from: 25,
    to: 30,
    bar: "bg-amber-400 dark:bg-amber-500",
  },
  {
    key: "obese2",
    from: 30,
    to: 35,
    bar: "bg-orange-400 dark:bg-orange-500",
  },
  {
    key: "obese3",
    from: 35,
    to: 40,
    bar: "bg-red-400 dark:bg-red-500",
  },
  {
    key: "obese4",
    from: 40,
    to: 45,
    bar: "bg-red-700 dark:bg-red-600",
  },
];

const RANGE_MIN = 15;
const RANGE_MAX = 45;

function bmiMarkerPercent(bmi: number): number {
  const clamped = Math.min(RANGE_MAX, Math.max(RANGE_MIN, bmi));
  return ((clamped - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
}

function formatSignedKg(diff: number): string {
  const abs = Math.abs(diff).toFixed(2);
  if (diff > 0) return `+${abs} kg`;
  if (diff < 0) return `-${abs} kg`;
  return `${abs} kg`;
}

export function BmiCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function categoryLabel(cat: BmiCategory): string {
    return t.bmi.categories[cat];
  }

  function handleCalculate() {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (
      !Number.isFinite(h) ||
      !Number.isFinite(w) ||
      height.trim() === "" ||
      weight.trim() === ""
    ) {
      setResult(null);
      setError(t.common.invalidInput);
      return;
    }
    try {
      const res = calculateBmi(h, w);
      setResult(res);
      setError(null);
      addEntry({
        expression: `${height}cm / ${weight}kg`,
        result: `BMI ${res.bmi.toFixed(2)} (${categoryLabel(res.category)})`,
        route: "/bmi-calculator",
      });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : t.common.invalidInput);
    }
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.bmiPage.title}
      </h1>
      <CalculatorCard
        compact
        maxWidthClass="max-w-[480px]"
        actions={result ? <CopyResultButton value={result.bmi.toFixed(2)} /> : undefined}
      >
        <div className="space-y-2.5 sm:space-y-3">
          <FormField
            label={t.bmi.height}
            type="number"
            inputMode="decimal"
            min={1}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <FormField
            label={t.bmi.weight}
            type="number"
            inputMode="decimal"
            min={1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <PrimaryButton onClick={handleCalculate}>{t.common.calculate}</PrimaryButton>

          {error && <ErrorMessage message={error} />}

          {result && (
            <div className="space-y-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label={t.bmi.result} value={result.bmi.toFixed(2)} highlight />
                <div className="rounded-[var(--radius-md)] border border-border bg-surface-sunken p-4">
                  <div className="text-xs font-medium text-text-tertiary">{t.bmi.category}</div>
                  <div
                    className={`mt-1 text-xl font-bold tracking-tight ${categoryColors[result.category]}`}
                  >
                    {categoryLabel(result.category)}
                  </div>
                </div>
                <ResultCard
                  label={t.bmi.idealWeight}
                  value={`${result.idealWeight.toFixed(2)} kg`}
                />
                <ResultCard label={t.bmi.weightDiff} value={formatSignedKg(result.weightDiff)} />
              </div>

              <div className="rounded-[var(--radius-md)] border border-border bg-surface-sunken p-4">
                <div className="text-xs font-medium text-text-tertiary">{t.bmi.rangeLabel}</div>
                <div className="relative mt-3">
                  <div
                    className="flex h-2.5 overflow-hidden rounded-full"
                    role="img"
                    aria-label={`${t.bmi.rangeLabel}: ${result.bmi.toFixed(2)}`}
                  >
                    {rangeSegments.map((seg) => (
                      <div
                        key={seg.key}
                        className={seg.bar}
                        style={{
                          width: `${((seg.to - seg.from) / (RANGE_MAX - RANGE_MIN)) * 100}%`,
                        }}
                        title={categoryLabel(seg.key)}
                      />
                    ))}
                  </div>
                  <div
                    className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-text-primary shadow-sm dark:border-surface-sunken"
                    style={{ left: `${bmiMarkerPercent(result.bmi)}%` }}
                    aria-hidden
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {t.bmi.tips[result.category]}
                </p>
              </div>
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">{t.bmiPage.description}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.bmiPage.introParagraph} />
      </p>

      <p className="mt-4 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        {t.bmiPage.disclaimer}
      </p>

      <CalculatorHowToSection title={t.bmiPage.howToTitle} steps={t.bmiPage.howToSteps} />

      <CalculatorFaqSection title={t.bmiPage.faqTitle} items={t.bmiPage.faqItems} />
      <RelatedCalculators activeHref="/bmi-calculator" />
    </>
  );
}
