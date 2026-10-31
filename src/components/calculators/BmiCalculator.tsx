"use client";

import { useState } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { PrimaryButton, SelectWell } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import {
  calculateBmi,
  estimateBodyFatPercent,
  getAgeTargetRange,
  type BmiCategory,
  type BmiResult,
  type BmiSex,
} from "@/lib/calculators/bmi";

type GenderChoice = "unspecified" | BmiSex;

type AgeExtras = {
  target: { min: number; max: number } | null;
  targetMinKg: number;
  targetMaxKg: number;
  bodyFat: number | null;
};

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

function BmiGuideTable({
  head,
  rows,
  dense = false,
}: {
  head: string[];
  rows: string[][];
  dense?: boolean;
}) {
  // dense (the wide height x weight matrix): tighter cells on mobile and a
  // sticky first column, so the table stays usable on phones.
  const cellPad = dense ? "px-1.5 py-1.5 sm:px-2.5 sm:py-2" : "px-3 py-2";
  return (
    <div className="mt-4 overflow-x-auto">
      <table
        className={`w-full border-collapse ${dense ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
      >
        <thead>
          <tr>
            {head.map((cell, i) => (
              <th
                key={cell}
                scope="col"
                className={`border border-border bg-surface-sunken ${cellPad} text-left font-semibold text-text-primary ${
                  dense && i === 0 ? "sticky left-0" : ""
                }`}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td
                  key={cell}
                  className={`border border-border ${cellPad} ${
                    i === 0
                      ? `font-medium text-text-primary ${dense ? "sticky left-0 bg-surface" : ""}`
                      : "text-text-secondary"
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

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideSubHeadingClass =
  "mt-8 text-base font-semibold text-[#231942] sm:text-lg dark:text-[#d6ccf0]";
const guideBodyClass = "mt-3 text-sm leading-relaxed text-text-secondary sm:text-base";

export function BmiCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const [ageStr, setAgeStr] = useState("");
  const [gender, setGender] = useState<GenderChoice>("unspecified");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [extras, setExtras] = useState<AgeExtras | null>(null);
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
      setExtras(null);
      setError(t.common.invalidInput);
      return;
    }
    let ageNum: number | null = null;
    if (ageStr.trim() !== "") {
      ageNum = Number(ageStr);
      if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
        setResult(null);
        setExtras(null);
        setError(t.bmi.ageInvalid);
        return;
      }
    }
    try {
      const res = calculateBmi(h, w);
      setResult(res);
      if (ageNum !== null) {
        const target = getAgeTargetRange(ageNum);
        const heightSq = (h / 100) * (h / 100);
        setExtras({
          target,
          targetMinKg: target ? target.min * heightSq : 0,
          targetMaxKg: target ? target.max * heightSq : 0,
          bodyFat:
            gender !== "unspecified" ? estimateBodyFatPercent(res.bmi, ageNum, gender) : null,
        });
      } else {
        setExtras(null);
      }
      setError(null);
      addEntry({
        expression: `${height}cm / ${weight}kg`,
        result: `BMI ${res.bmi.toFixed(2)} (${categoryLabel(res.category)})`,
        route: "/bmi-calculator",
      });
    } catch (e) {
      setResult(null);
      setExtras(null);
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

          <div className="grid gap-2.5 sm:grid-cols-2">
            <FormField
              label={t.bmi.age}
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
            />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">{t.bmi.gender}</span>
              <SelectWell
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderChoice)}
              >
                <option value="unspecified">{t.bmi.genderUnspecified}</option>
                <option value="male">{t.bmi.male}</option>
                <option value="female">{t.bmi.female}</option>
              </SelectWell>
            </label>
          </div>

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

              <div className="rounded-[var(--radius-md)] border border-border bg-surface-sunken p-4">
                <div className="text-xs font-medium text-text-tertiary">{t.bmi.healthyRange}</div>
                <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                  {result.healthyWeightMin.toFixed(2)} kg 〜 {result.healthyWeightMax.toFixed(2)}{" "}
                  kg
                </div>
                <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-text-secondary">{t.bmi.beautyWeight}</dt>
                    <dd className="tabular-display font-medium text-text-primary">
                      {result.beautyWeight.toFixed(2)} kg（{formatSignedKg(result.beautyDiff)}）
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-text-secondary">{t.bmi.cinderellaWeight}</dt>
                    <dd className="tabular-display font-medium text-text-primary">
                      {result.cinderellaWeight.toFixed(2)} kg（
                      {formatSignedKg(result.cinderellaDiff)}）
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-text-secondary">{t.bmi.modelWeight}</dt>
                    <dd className="tabular-display font-medium text-text-primary">
                      {result.modelWeight.toFixed(2)} kg（{formatSignedKg(result.modelDiff)}）
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-text-tertiary">
                  {t.bmi.variantNote}
                </p>
              </div>

              {extras && (
                <div className="rounded-[var(--radius-md)] border border-border bg-surface-sunken p-4">
                  <div className="text-xs font-medium text-text-tertiary">
                    {t.bmi.agePanelTitle}
                  </div>
                  {extras.target ? (
                    <>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                        {t.bmi.ageTargetLabel}：
                        <span className="font-semibold text-text-primary">
                          {extras.target.min.toFixed(1)} 〜 {extras.target.max.toFixed(1)}
                        </span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {result.bmi < extras.target.min
                          ? t.bmi.ageTargetBelow
                          : result.bmi > extras.target.max
                            ? t.bmi.ageTargetAbove
                            : t.bmi.ageTargetIn}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {t.bmi.ageTargetWeightLabel}：{extras.targetMinKg.toFixed(1)} kg 〜{" "}
                        {extras.targetMaxKg.toFixed(1)} kg
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {t.bmi.under18Note}
                    </p>
                  )}
                  {extras.bodyFat !== null && (
                    <div className="mt-3 border-t border-border pt-3">
                      <div className="text-xs font-medium text-text-tertiary">
                        {t.bmi.bodyFatLabel}
                      </div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {extras.bodyFat.toFixed(1)} %
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-text-tertiary">
                        {t.bmi.bodyFatNote}
                      </p>
                    </div>
                  )}
                </div>
              )}
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

      <section aria-labelledby="bmi-formula-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="bmi-formula-heading" className={guideHeadingClass}>
          {t.bmiPage.guideFormula.title}
        </h2>
        {t.bmiPage.guideFormula.paragraphs.map((paragraph) => (
          <p key={paragraph} className={guideBodyClass}>
            {paragraph}
          </p>
        ))}
        <h3 className={guideSubHeadingClass}>{t.bmiPage.guideFormula.classificationTitle}</h3>
        <BmiGuideTable
          head={t.bmiPage.guideFormula.classificationHead}
          rows={t.bmiPage.guideFormula.classificationRows}
        />
        <h3 className={guideSubHeadingClass}>{t.bmiPage.guideFormula.idealTitle}</h3>
        <BmiGuideTable
          head={t.bmiPage.guideFormula.idealHead}
          rows={t.bmiPage.guideFormula.idealRows}
        />
        <h3 className={guideSubHeadingClass}>{t.bmiPage.guideFormula.whoTitle}</h3>
        <p className={guideBodyClass}>{t.bmiPage.guideFormula.whoIntro}</p>
        <BmiGuideTable
          head={t.bmiPage.guideFormula.whoHead}
          rows={t.bmiPage.guideFormula.whoRows}
        />
      </section>

      <section aria-labelledby="bmi-example-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="bmi-example-heading" className={guideHeadingClass}>
          {t.bmiPage.guideExample.title}
        </h2>
        <p className={guideBodyClass}>{t.bmiPage.guideExample.intro}</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.bmiPage.guideExample.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className={guideBodyClass}>{t.bmiPage.guideExample.uses}</p>
      </section>

      <section aria-labelledby="bmi-matrix-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="bmi-matrix-heading" className={guideHeadingClass}>
          {t.bmiPage.guideMatrix.title}
        </h2>
        <p className={guideBodyClass}>{t.bmiPage.guideMatrix.intro}</p>
        <BmiGuideTable dense head={t.bmiPage.guideMatrix.head} rows={t.bmiPage.guideMatrix.rows} />
        <p className="mt-2 text-xs text-text-tertiary sm:hidden">表は横にスクロールできます</p>
        <p className={guideBodyClass}>{t.bmiPage.guideMatrix.note}</p>
      </section>

      <section aria-labelledby="bmi-age-gender-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="bmi-age-gender-heading" className={guideHeadingClass}>
          {t.bmiPage.guideAgeGender.title}
        </h2>
        {t.bmiPage.guideAgeGender.paragraphs.map((paragraph) => (
          <p key={paragraph} className={guideBodyClass}>
            {paragraph}
          </p>
        ))}
        <h3 className={guideSubHeadingClass}>{t.bmiPage.guideAgeGender.ageTitle}</h3>
        <BmiGuideTable
          head={t.bmiPage.guideAgeGender.ageHead}
          rows={t.bmiPage.guideAgeGender.ageRows}
        />
        <p className={guideBodyClass}>{t.bmiPage.guideAgeGender.sourceNote}</p>
      </section>

      <section aria-labelledby="bmi-variants-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="bmi-variants-heading" className={guideHeadingClass}>
          {t.bmiPage.guideVariants.title}
        </h2>
        {t.bmiPage.guideVariants.paragraphs.map((paragraph) => (
          <p key={paragraph} className={guideBodyClass}>
            {paragraph}
          </p>
        ))}
        <h3 className={guideSubHeadingClass}>{t.bmiPage.guideVariants.tableTitle}</h3>
        <BmiGuideTable
          head={t.bmiPage.guideVariants.tableHead}
          rows={t.bmiPage.guideVariants.tableRows}
        />
        <p className={guideBodyClass}>{t.bmiPage.guideVariants.caution}</p>
      </section>

      <section aria-labelledby="bmi-notes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="bmi-notes-heading" className={guideHeadingClass}>
          {t.bmiPage.guideNotes.title}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.bmiPage.guideNotes.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={t.bmiPage.howToTitle} steps={t.bmiPage.howToSteps} />

      <p className="mt-16 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        {t.bmiPage.disclaimer}
      </p>

      <CalculatorFaqSection title={t.bmiPage.faqTitle} items={t.bmiPage.faqItems} />
      <RelatedCalculators activeHref="/bmi-calculator" />
    </>
  );
}
