"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { PercentageWorkedExamples } from "@/components/calculator/PercentageWorkedExamples";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Divider, InputWell, PrimaryButton } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";

const inlineInputClass =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface-sunken px-3 py-2 text-lg text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 sm:w-28";

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

function PercentGuideTable({ head, rows }: { head: string[]; rows: string[][] }) {
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
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td
                  key={cell}
                  className={`border border-border px-3 py-2 ${
                    i === 0 ? "font-medium text-text-primary" : "text-text-secondary"
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

function ResultInline({ value }: { value: string }) {
  return (
    <div className="tabular-display flex-1 rounded-[var(--radius-sm)] border border-brand/20 bg-brand-muted px-4 py-2 text-right text-xl font-bold text-brand">
      {value}
    </div>
  );
}

export function PercentageCalculator() {
  const { t } = useLocale();

  const [p1X, setP1X] = useState<string>("20");
  const [p1Y, setP1Y] = useState<string>("150");
  const [p2X, setP2X] = useState<string>("30");
  const [p2Y, setP2Y] = useState<string>("150");
  const [p3X, setP3X] = useState<string>("100");
  const [p3Y, setP3Y] = useState<string>("120");

  const calc1 = (xStr: string, yStr: string) => {
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    if (isNaN(x) || isNaN(y)) {
      return { value: "—", error: t.common.invalidInput as string | null };
    }
    return { value: (y * (x / 100)).toString(), error: null };
  };

  const calc2 = (xStr: string, yStr: string) => {
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    if (isNaN(x) || isNaN(y)) {
      return { value: "—", error: t.common.invalidInput as string | null };
    }
    if (y === 0) {
      return { value: "—", error: t.common.invalidInput as string | null };
    }
    return { value: ((x / y) * 100).toFixed(2) + "%", error: null };
  };

  const calc3 = (xStr: string, yStr: string) => {
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);
    if (isNaN(x) || isNaN(y)) {
      return { value: "—", error: t.common.invalidInput as string | null };
    }
    if (x === 0) {
      return { value: "—", error: t.common.invalidInput as string | null };
    }
    const diff = ((y - x) / Math.abs(x)) * 100;
    return {
      value: diff > 0 ? `+${diff.toFixed(2)}%` : `${diff.toFixed(2)}%`,
      error: null,
    };
  };

  const [results, setResults] = useState(() => ({
    result1: calc1("20", "150"),
    result2: calc2("30", "150"),
    result3: calc3("100", "120"),
    submitted: { p1X: "20", p1Y: "150", p2X: "30", p2Y: "150", p3X: "100", p3Y: "120" },
  }));

  const handleCalculate = () => {
    setResults({
      result1: calc1(p1X, p1Y),
      result2: calc2(p2X, p2Y),
      result3: calc3(p3X, p3Y),
      submitted: { p1X, p1Y, p2X, p2Y, p3X, p3Y },
    });
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.percentagePage.title}
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[520px]">
        <div className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:grid-cols-3 sm:items-center w-full">
            <InputWell
              type="number"
              value={p1Y}
              onChange={(e) => setP1Y(e.target.value)}
              className={inlineInputClass}
              aria-label="基準となる数値"
            />
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="text-text-secondary">の</span>
              <InputWell
                type="number"
                value={p1X}
                onChange={(e) => setP1X(e.target.value)}
                className={`${inlineInputClass} sm:w-24`}
                aria-label="パーセント"
              />
              <span className="text-text-secondary">% は</span>
            </div>
            <ResultInline value={results.result1.value} />
          </div>
          {results.result1.error && <ErrorMessage message={results.result1.error} />}

          <Divider className="pt-0" />

          <div className="grid gap-3 sm:grid-cols-3 sm:items-center w-full">
            <InputWell
              type="number"
              value={p2Y}
              onChange={(e) => setP2Y(e.target.value)}
              className={inlineInputClass}
              aria-label="基準となる数値"
            />
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="text-text-secondary">に対する</span>
              <InputWell
                type="number"
                value={p2X}
                onChange={(e) => setP2X(e.target.value)}
                className={`${inlineInputClass} sm:w-24`}
                aria-label="比較する数値"
              />
              <span className="text-text-secondary">の割合は</span>
            </div>
            <ResultInline value={results.result2.value} />
          </div>
          {results.result2.error && <ErrorMessage message={results.result2.error} />}

          <Divider className="pt-0" />

          <div className="grid gap-3 sm:grid-cols-3 sm:items-center w-full">
            <InputWell
              type="number"
              value={p3X}
              onChange={(e) => setP3X(e.target.value)}
              className={inlineInputClass}
              aria-label="変化前の数値"
            />
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="text-text-secondary">から</span>
              <InputWell
                type="number"
                value={p3Y}
                onChange={(e) => setP3Y(e.target.value)}
                className={`${inlineInputClass} sm:w-24`}
                aria-label="変化後の数値"
              />
              <span className="text-text-secondary">への変化は</span>
            </div>
            <ResultInline value={results.result3.value} />
          </div>
          {results.result3.error && <ErrorMessage message={results.result3.error} />}

          <PrimaryButton onClick={handleCalculate} className="mt-4">
            {t.common.calculate}
          </PrimaryButton>

          <Divider>
            <PercentageWorkedExamples
              originalPrice={results.submitted.p1Y}
              discountPercent={results.submitted.p1X}
              proportionPart={results.submitted.p2X}
              proportionWhole={results.submitted.p2Y}
              changeFrom={results.submitted.p3X}
              changeTo={results.submitted.p3Y}
            />
          </Divider>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.percentagePage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.percentagePage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={t.percentagePage.howToTitle}
        steps={t.percentagePage.howToSteps}
      />

      <section aria-labelledby="percent-formulas-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="percent-formulas-heading" className={guideHeadingClass}>
          {t.percentagePage.guideFormulasTitle}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {t.percentagePage.guideFormulas.map((f) => (
            <div
              key={f.title}
              className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-4"
            >
              <h3 className="text-sm font-semibold text-text-primary sm:text-base">{f.title}</h3>
              <p className="mt-2 text-base font-bold text-brand sm:text-lg">{f.formula}</p>
              <p className="mt-2 text-sm text-text-secondary">{f.example}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="percent-buai-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="percent-buai-heading" className={guideHeadingClass}>
          {t.percentagePage.guideBuaiTitle}
        </h2>
        <PercentGuideTable head={t.percentagePage.guideBuaiHead} rows={t.percentagePage.guideBuaiRows} />
        <h3 className="mt-8 text-lg font-semibold text-text-primary">{t.percentagePage.guideCommonTitle}</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {t.percentagePage.guideCommonItems.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border bg-surface-sunken px-3 py-1.5 text-sm text-text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="percent-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="percent-mistakes-heading" className={guideHeadingClass}>
          {t.percentagePage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.percentagePage.guideMistakes.map((m) => (
            <li key={m} className={guideBodyClass.replace("mt-4 ", "")}>
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorFaqSection title={t.percentagePage.faqTitle} items={t.percentagePage.faqItems} />
      <RelatedCalculators activeHref="/percentage-calculator" />
    </>
  );
}
