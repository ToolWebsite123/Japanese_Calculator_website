"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { PercentageWorkedExamples } from "@/components/calculator/PercentageWorkedExamples";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Divider, InputWell } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import {
  changePercent,
  percentOf,
  percentToBuai,
  ratioPercent,
  wholeFromPart,
} from "@/lib/calculators/percentage";
import { formatDisplayNumber } from "@/lib/format";

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
  const [p4Part, setP4Part] = useState<string>("30");
  const [p4Pct, setP4Pct] = useState<string>("20");

  // All four modes compute live on every render (no calculate button).
  const parse = (s: string): number | null => {
    if (s.trim() === "") return null;
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  };
  const invalid = t.common.invalidInput as string;

  const n1x = parse(p1X);
  const n1y = parse(p1Y);
  const v1 = n1x !== null && n1y !== null ? percentOf(n1y, n1x) : null;
  const result1 = {
    value: v1 === null ? "—" : formatDisplayNumber(v1, 8),
    error: v1 === null ? invalid : null,
  };

  const n2x = parse(p2X);
  const n2y = parse(p2Y);
  const v2 = n2x !== null && n2y !== null ? ratioPercent(n2x, n2y) : null;
  const buai2 = v2 !== null ? percentToBuai(v2) : null;
  const result2 = {
    value: v2 === null ? "—" : `${v2.toFixed(2)}%${buai2 ? `（${buai2}）` : ""}`,
    error: v2 === null ? invalid : null,
  };

  const n3x = parse(p3X);
  const n3y = parse(p3Y);
  const v3 = n3x !== null && n3y !== null ? changePercent(n3x, n3y) : null;
  const result3 = {
    value: v3 === null ? "—" : `${v3 > 0 ? "+" : ""}${v3.toFixed(2)}%`,
    error: v3 === null ? invalid : null,
  };

  const n4part = parse(p4Part);
  const n4pct = parse(p4Pct);
  const v4 = n4part !== null && n4pct !== null ? wholeFromPart(n4part, n4pct) : null;
  const result4 = {
    value: v4 === null ? "—" : formatDisplayNumber(v4, 8),
    error: v4 === null ? invalid : null,
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
            <ResultInline value={result1.value} />
          </div>
          {result1.error && <ErrorMessage message={result1.error} />}

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
            <ResultInline value={result2.value} />
          </div>
          {result2.error && <ErrorMessage message={result2.error} />}

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
            <ResultInline value={result3.value} />
          </div>
          {result3.error && <ErrorMessage message={result3.error} />}

          <Divider className="pt-0" />

          <div className="grid gap-3 sm:grid-cols-3 sm:items-center w-full">
            <InputWell
              type="number"
              value={p4Part}
              onChange={(e) => setP4Part(e.target.value)}
              className={inlineInputClass}
              aria-label="部分の数値"
            />
            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span className="text-text-secondary">は</span>
              <InputWell
                type="number"
                value={p4Pct}
                onChange={(e) => setP4Pct(e.target.value)}
                className={`${inlineInputClass} sm:w-24`}
                aria-label="パーセント"
              />
              <span className="text-text-secondary">% のとき全体は</span>
            </div>
            <ResultInline value={result4.value} />
          </div>
          {result4.error && <ErrorMessage message={result4.error} />}

          <Divider>
            <PercentageWorkedExamples
              originalPrice={p1Y}
              discountPercent={p1X}
              proportionPart={p2X}
              proportionWhole={p2Y}
              changeFrom={p3X}
              changeTo={p3Y}
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

      <section aria-labelledby="percent-formulas-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="percent-formulas-heading" className={guideHeadingClass}>
          {t.percentagePage.guideFormulasTitle}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section aria-labelledby="percent-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="percent-examples-heading" className={guideHeadingClass}>
          {t.percentagePage.guideExamplesTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">計算</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">結果</th>
              </tr>
            </thead>
            <tbody>
              {t.percentagePage.examplesTable.map((row) => (
                <tr key={row.calc} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.calc}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <CalculatorHowToSection
        title={t.percentagePage.howToTitle}
        steps={t.percentagePage.howToSteps}
      />

      <CalculatorFaqSection title={t.percentagePage.faqTitle} items={t.percentagePage.faqItems} />
      <RelatedCalculators activeHref="/percentage-calculator" />
    </>
  );
}
