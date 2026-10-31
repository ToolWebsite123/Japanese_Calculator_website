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
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {page.title}
      </h1>
      <CalculatorCard compact>
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

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {page.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={page.introParagraph} />
      </p>

      <CalculatorHowToSection title={page.howToTitle} steps={page.howToSteps} />

      <section aria-labelledby="interest-compare-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="interest-compare-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {page.guideCompareTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{page.guideCompareIntro}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr>
                {page.guideCompareHead.map((cell) => (
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
              {page.guideCompareRows.map((row) => (
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
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{page.guideCompareNote}</p>
      </section>

      <section aria-labelledby="interest-tax-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="interest-tax-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {page.guideTaxTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{page.guideTaxBody}</p>
      </section>

      <CalculatorFaqSection title={page.faqTitle} items={faqItems} />
      <RelatedCalculators activeHref="/interest-calculator" />
    </>
  );
}
