"use client";

import { useState } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
import { SelectWell, PrimaryButton } from "@/components/ui/primitives";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CompoundInterestWorkedExamples } from "@/components/calculator/CompoundInterestWorkedExamples";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { useLocale } from "@/context/LocaleContext";
import { formatYen } from "@/lib/format";
import {
  calcCompoundInterest,
  type CompoundInterestResult,
} from "@/lib/calculators/compound-interest";

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

export function CompoundInterestCalculator() {
  const { t } = useLocale();
  const [principal, setPrincipal] = useState<string>("1000000");
  const [rate, setRate] = useState<string>("5");
  const [years, setYears] = useState<string>("10");
  const [frequency, setFrequency] = useState<number>(1);
  const [monthlyContribution, setMonthlyContribution] = useState<string>("0");

  const [result, setResult] = useState<{
    error: string | null;
    calc: CompoundInterestResult | null;
    submitted: { p: string; r: string; y: string; f: number; c: string } | null;
  } | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const c = parseFloat(monthlyContribution);

    if (isNaN(p) || isNaN(r) || isNaN(y) || isNaN(c) || p < 0 || y < 0 || c < 0) {
      setResult({
        error: t.common.invalidInput as string | null,
        calc: null,
        submitted: null,
      });
      return;
    }

    const calc = calcCompoundInterest({
      principal: p,
      annualRatePercent: r,
      years: y,
      frequency,
      monthlyContribution: c,
    });

    setResult({
      error: null,
      calc,
      submitted: { p: principal, r: rate, y: years, f: frequency, c: monthlyContribution },
    });
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.compoundInterestPage.title}
      </h1>
      <CalculatorCard
        compact
        maxWidthClass="max-w-[480px]"
      >
        <div className="space-y-2.5 sm:space-y-3">
          <FormField
            label={t.compoundInterest.principal}
            type="number"
            min={0}
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="text-lg"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label={t.compoundInterest.annualRate}
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="text-lg"
            />
            <FormField
              label={t.compoundInterest.years}
              type="number"
              min={0}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="text-lg"
            />
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">
              {t.compoundInterest.compoundFrequency}
            </span>
            <SelectWell
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="text-lg"
            >
              <option value={1}>{t.compoundInterest.freqYearly}</option>
              <option value={12}>{t.compoundInterest.freqMonthly}</option>
              <option value={365}>{t.compoundInterest.freqDaily}</option>
            </SelectWell>
          </label>

          <FormField
            label={t.compoundInterest.monthlyContribution}
            type="number"
            min={0}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            className="text-lg"
          />

          <PrimaryButton onClick={handleCalculate}>{t.common.calculate}</PrimaryButton>

          {result?.error && <ErrorMessage message={result.error} />}

          {!result?.error && result?.calc && result?.submitted && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard
                  label={t.compoundInterest.futureValue}
                  value={formatYen(result.calc.futureValue)}
                  highlight
                />
                <ResultCard
                  label={t.compoundInterest.totalInterest}
                  value={`+${formatYen(result.calc.totalInterest)}`}
                />
              </div>

              {parseFloat(result.submitted.c) > 0 && (
                <div className="space-y-1.5 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t.compoundInterestPage.breakdownPrincipal}</span>
                    <span className="tabular-display font-medium text-text-primary">
                      {formatYen(result.calc.principalFutureValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">
                      {t.compoundInterestPage.breakdownContribution}
                    </span>
                    <span className="tabular-display font-medium text-text-primary">
                      {formatYen(result.calc.contributionFutureValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t.compoundInterestPage.breakdownContributed}</span>
                    <span className="tabular-display font-medium text-text-primary">
                      {formatYen(result.calc.totalContributions)}
                    </span>
                  </div>
                </div>
              )}

              {parseFloat(result.submitted.c) === 0 && (
                <div className="mt-8">
                  <CompoundInterestWorkedExamples
                    principal={result.submitted.p}
                    rate={result.submitted.r}
                    years={result.submitted.y}
                    frequency={result.submitted.f}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </CalculatorCard>

      {!result?.error && result?.calc && result.calc.yearly.length > 0 && (
        <section aria-labelledby="compound-projection-heading" className="mt-12">
          <h2 id="compound-projection-heading" className={guideHeadingClass}>
            {t.compoundInterestPage.projectionTitle}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr>
                  {t.compoundInterestPage.projectionHead.map((cell) => (
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
                {result.calc.yearly.map((row) => (
                  <tr key={row.year}>
                    <td className="border border-border px-3 py-2 font-medium text-text-primary">
                      {row.year}年目
                    </td>
                    <td className="tabular-display border border-border px-3 py-2 text-text-secondary">
                      {formatYen(row.contributed)}
                    </td>
                    <td className="tabular-display border border-border px-3 py-2 text-text-secondary">
                      {formatYen(row.futureValue)}
                    </td>
                    <td className="tabular-display border border-border px-3 py-2 text-text-secondary">
                      +{formatYen(row.interest)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.compoundInterestPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.compoundInterestPage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={t.compoundInterestPage.howToTitle}
        steps={t.compoundInterestPage.howToSteps}
      />

      <section aria-labelledby="compound-72-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="compound-72-heading" className={guideHeadingClass}>
          {t.compoundInterestPage.guide72Title}
        </h2>
        <p className={guideBodyClass}>{t.compoundInterestPage.guide72Body}</p>
      </section>

      <section aria-labelledby="compound-compare-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="compound-compare-heading" className={guideHeadingClass}>
          {t.compoundInterestPage.guideCompareTitle}
        </h2>
        <p className={guideBodyClass}>
          <LinkedText text={t.compoundInterestPage.guideCompareBody} activeHref="/compound-interest-calculator" />
        </p>
      </section>

      <section aria-labelledby="compound-notes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="compound-notes-heading" className={guideHeadingClass}>
          {t.compoundInterestPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.compoundInterestPage.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorFaqSection
        title={t.compoundInterestPage.faqTitle}
        items={t.compoundInterestPage.faqItems}
      />
      <RelatedCalculators activeHref="/compound-interest-calculator" />
    </>
  );
}
