"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard, ResultCard } from "@/components/ui/FormField";
import { FormField } from "@/components/ui/FormField";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Divider, SecondaryButton, SegmentedControl } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { InterestMethodWorkedExamples } from "@/components/calculator/InterestMethodWorkedExamples";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { formatYen } from "@/lib/format";
import {
  calcInterest,
  withholdingTax,
  type InterestPeriodUnit,
} from "@/lib/calculators/interest";

const COMPOUND_CALC_DIFF_QUESTION = "このページは複利計算機と何が違いますか？";

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";

export function InterestMethodCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
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
  const [period, setPeriod] = useState<string>("10");
  const [unit, setUnit] = useState<InterestPeriodUnit>("years");
  const [applyTax, setApplyTax] = useState<"off" | "on">("off");

  const computed = useMemo(() => {
    try {
      const res = calcInterest(parseFloat(principal), parseFloat(rate), parseFloat(period), unit);
      return { result: res, error: null as string | null };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : (t.common.invalidInput as string),
      };
    }
  }, [principal, rate, period, unit, t.common.invalidInput]);
  const result = computed.result;
  const simpleTax = result ? withholdingTax(Math.floor(result.simpleInterest)) : null;
  const compoundTax = result ? withholdingTax(Math.floor(result.compoundInterest)) : null;

  const loggedKeyRef = useRef<string>("");
  useEffect(() => {
    if (!result) return;
    const key = `${principal}|${rate}|${period}|${unit}`;
    if (loggedKeyRef.current === key) return;
    const timer = setTimeout(() => {
      loggedKeyRef.current = key;
      addEntry({
        expression: `利息 ${principal}円 ${rate}% ${period}${unit}`,
        result: formatYen(result.compoundTotal),
        route: "/interest-calculator",
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [result, principal, rate, period, unit, addEntry]);

  function handleClear() {
    setPrincipal("1000000");
    setRate("5");
    setPeriod("10");
    setUnit("years");
    setApplyTax("off");
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {page.title}
      </h1>
      <CalculatorCard
        compact
        actions={result ? <CopyResultButton value={formatYen(result.compoundTotal)} /> : undefined}
      >
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
              label={t.interestMethod.periodValue}
              type="number"
              min={0}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-lg"
            />
          </div>

          <SegmentedControl
            value={unit}
            onChange={setUnit}
            columns={3}
            options={[
              { value: "years" as const, label: t.interestMethod.unitYears },
              { value: "months" as const, label: t.interestMethod.unitMonths },
              { value: "days" as const, label: t.interestMethod.unitDays },
            ]}
          />

          <div>
            <span className="mb-2 block text-sm font-medium text-text-secondary">
              {t.interestMethod.taxLabel}
            </span>
            <SegmentedControl
              value={applyTax}
              onChange={setApplyTax}
              columns={2}
              options={[
                { value: "off" as const, label: t.interestMethod.taxOff },
                { value: "on" as const, label: t.interestMethod.taxOn },
              ]}
            />
          </div>

          <SecondaryButton fullWidth onClick={handleClear}>
            {t.common.clear}
          </SecondaryButton>

          {computed.error && <ErrorMessage message={computed.error} />}

          {result && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard
                  label={t.interestMethod.simpleInterest}
                  value={formatYen(result.simpleTotal)}
                />
                <ResultCard
                  label={t.interestMethod.compoundInterest}
                  value={formatYen(result.compoundTotal)}
                  highlight
                />
                <ResultCard label="差額" value={`+${formatYen(result.difference)}`} />
              </div>

              <div className="space-y-1.5 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">{t.interestMethod.simpleInterestOnly}</span>
                  <span className="tabular-display font-medium text-text-primary">
                    {formatYen(result.simpleInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">{t.interestMethod.compoundInterestOnly}</span>
                  <span className="tabular-display font-medium text-text-primary">
                    {formatYen(result.compoundInterest)}
                  </span>
                </div>
                {applyTax === "on" && simpleTax && compoundTax && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {t.interestMethod.netInterest}（単利）
                      </span>
                      <span className="tabular-display font-medium text-text-primary">
                        {formatYen(simpleTax.net)}（{t.interestMethod.taxAmount} {formatYen(simpleTax.total)}）
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {t.interestMethod.netInterest}（複利）
                      </span>
                      <span className="tabular-display font-medium text-text-primary">
                        {formatYen(compoundTax.net)}（{t.interestMethod.taxAmount} {formatYen(compoundTax.total)}）
                      </span>
                    </div>
                  </>
                )}
              </div>

              {unit === "years" && (
                <Divider>
                  <InterestMethodWorkedExamples
                    principal={principal}
                    rate={rate}
                    years={period}
                  />
                </Divider>
              )}
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

      <section aria-labelledby="interest-compare-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="interest-compare-heading" className={guideHeadingClass}>
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
        <h2 id="interest-tax-heading" className={guideHeadingClass}>
          {page.guideTaxTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{page.guideTaxBody}</p>
      </section>

      <section aria-labelledby="interest-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="interest-examples-heading" className={guideHeadingClass}>
          {page.contentExamplesTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-left">
                <th className="px-3 py-2.5 font-semibold text-text-primary">条件</th>
                <th className="px-3 py-2.5 font-semibold text-text-primary">結果</th>
              </tr>
            </thead>
            <tbody>
              {page.contentExamplesRows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  <td className="px-3 py-2.5 text-text-secondary">{row[0]}</td>
                  <td className="px-3 py-2.5 text-text-primary">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="interest-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="interest-mistakes-heading" className={guideHeadingClass}>
          {page.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {page.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={page.howToTitle} steps={page.howToSteps} />

      <CalculatorFaqSection title={page.faqTitle} items={faqItems} />
      <RelatedCalculators activeHref="/interest-calculator" />
    </>
  );
}
