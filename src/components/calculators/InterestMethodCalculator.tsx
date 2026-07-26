"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalculatorCard, ResultCard } from "@/components/ui/FormField";
import { FormField } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { InterestMethodWorkedExamples } from "@/components/calculator/InterestMethodWorkedExamples";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { useLocale } from "@/context/LocaleContext";
import { formatYen } from "@/lib/format";

const COMPOUND_CALC_DIFF_QUESTION = "このページは複利計算機と何が違いますか？";

export function InterestMethodCalculator() {
  const { t } = useLocale();
  const page = t.interestMethodPage;

  const faqItems = useMemo(
    () =>
      page.faqItems.map((item) => {
        if (item.question !== COMPOUND_CALC_DIFF_QUESTION) {
          return item;
        }

        return {
          question: item.question,
          answer: (
            <>
              {page.compoundCalcDiffAnswerBefore}
              <Link
                href="/compound-interest-calculator"
                className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover"
              >
                {page.compoundCalcDiffLinkLabel}
              </Link>
              {page.compoundCalcDiffAnswerAfter}
            </>
          ),
        };
      }),
    [page],
  );

  const [principal, setPrincipal] = useState<string>("1000000");
  const [rate, setRate] = useState<string>("5");
  const [years, setYears] = useState<string>("10");

  const [result, setResult] = useState<{
    error: string | null;
    simple: number | null;
    compound: number | null;
    diff: number | null;
    submitted: { p: string; r: string; y: string } | null;
  } | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const y = parseFloat(years);

    if (isNaN(p) || isNaN(r) || isNaN(y) || p < 0 || y < 0) {
      setResult({
        error: t.common.invalidInput as string | null,
        simple: null,
        compound: null,
        diff: null,
        submitted: null,
      });
      return;
    }

    const simple = p * (1 + r * y);
    const compound = p * Math.pow(1 + r, y);

    setResult({
      error: null,
      simple,
      compound,
      diff: compound - simple,
      submitted: { p: principal, r: rate, y: years },
    });
  };

  return (
    <>
      <CalculatorCard title={page.title} description={page.description}>
        <div className="space-y-5">
          <FormField
            label={t.interestMethod.principal}
            type="number"
            min={0}
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="text-lg"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label={t.interestMethod.rate}
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="text-lg"
            />
            <FormField
              label={t.interestMethod.years}
              type="number"
              min={0}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="text-lg"
            />
          </div>

          <PrimaryButton onClick={handleCalculate}>{t.common.calculate}</PrimaryButton>

          {result?.error && <ErrorMessage message={result.error} />}

          {!result?.error &&
            result?.simple !== null &&
            result?.compound !== null &&
            result?.diff !== null &&
            result?.submitted && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <ResultCard
                    label={t.interestMethod.simpleInterest}
                    value={formatYen(result.simple)}
                  />
                  <ResultCard
                    label={t.interestMethod.compoundInterest}
                    value={formatYen(result.compound)}
                    highlight
                  />
                  <ResultCard label="差額" value={`+${formatYen(result.diff)}`} />
                </div>

                <Divider>
                  <InterestMethodWorkedExamples
                    principal={result.submitted.p}
                    rate={result.submitted.r}
                    years={result.submitted.y}
                  />
                </Divider>
              </>
            )}
        </div>
      </CalculatorCard>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={page.introParagraph} />
      </p>

      <CalculatorHowToSection title={page.howToTitle} steps={page.howToSteps} />

      <CalculatorFaqSection title={page.faqTitle} items={faqItems} />
      <RelatedCalculators activeHref="/interest-calculator" />
    </>
  );
}
