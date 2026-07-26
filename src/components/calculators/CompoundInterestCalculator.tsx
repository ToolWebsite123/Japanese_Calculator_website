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

export function CompoundInterestCalculator() {
  const { t } = useLocale();
  const [principal, setPrincipal] = useState<string>("1000000");
  const [rate, setRate] = useState<string>("5");
  const [years, setYears] = useState<string>("10");
  const [frequency, setFrequency] = useState<number>(1);

  const [result, setResult] = useState<{
    error: string | null;
    futureValue: number | null;
    totalInterest: number | null;
    submitted: { p: string; r: string; y: string; f: number } | null;
  } | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const y = parseFloat(years);
    const n = frequency;

    if (isNaN(p) || isNaN(r) || isNaN(y) || p < 0 || y < 0) {
      setResult({
        error: t.common.invalidInput as string | null,
        futureValue: null,
        totalInterest: null,
        submitted: null,
      });
      return;
    }

    const futureValue = p * Math.pow(1 + r / n, n * y);
    const totalInterest = futureValue - p;

    setResult({
      error: null,
      futureValue,
      totalInterest,
      submitted: { p: principal, r: rate, y: years, f: frequency },
    });
  };

  return (
    <>
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

          <PrimaryButton onClick={handleCalculate}>{t.common.calculate}</PrimaryButton>

          {result?.error && <ErrorMessage message={result.error} />}

          {!result?.error &&
            result?.futureValue !== null &&
            result?.totalInterest !== null &&
            result?.submitted && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultCard
                    label={t.compoundInterest.futureValue}
                    value={formatYen(result.futureValue)}
                    highlight
                  />
                  <ResultCard
                    label={t.compoundInterest.totalInterest}
                    value={`+${formatYen(result.totalInterest)}`}
                  />
                </div>

                <div className="mt-8">
                  <CompoundInterestWorkedExamples
                    principal={result.submitted.p}
                    rate={result.submitted.r}
                    years={result.submitted.y}
                    frequency={result.submitted.f}
                  />
                </div>
              </>
            )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl dark:text-[#d6ccf0]">
          {t.compoundInterestPage.title}
        </h1>
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

      <CalculatorFaqSection
        title={t.compoundInterestPage.faqTitle}
        items={t.compoundInterestPage.faqItems}
      />
      <RelatedCalculators activeHref="/compound-interest-calculator" />
    </>
  );
}
