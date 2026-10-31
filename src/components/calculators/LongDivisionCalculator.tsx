"use client";

import { useMemo, useState } from "react";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { LinkedText } from "@/components/calculator/LinkedText";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import {
  Divider,
  InputWell,
  SelectWell,
  SurfacePanel,
} from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import {
  computeLongDivision,
  type LongDivisionComputation,
} from "@/lib/calculators/longDivision";

function fmt(template: string, ...args: string[]): string {
  return args.reduce<string>(
    (str, arg, i) => str.replace(`{${i}}`, arg),
    template,
  );
}

const HREF = "/long-division-calculator";
const PRECISION_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 8, 10];
const GUIDE_HEADING_CLASS =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const GUIDE_BODY_CLASS =
  "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

/**
 * The classic 筆算 layout, rendered on a monospace character grid.
 * Every digit is absolutely positioned by column (1ch per digit), so the
 * quotient, products and remainders align exactly like on paper.
 */
function HissanLayout({ result }: { result: LongDivisionComputation }) {
  const A = String(result.scaledDividend);
  const B = String(result.scaledDivisor);
  const n = A.length;
  const rows = result.rows;
  const prefixCh = B.length + 1;
  const hasDecimal = rows.some((r) => r.isDecimalStep);
  const totalCols = Math.max(
    n,
    rows.length ? rows[rows.length - 1].endColumn + 1 : n,
  );
  const LINE_H = "1.8rem";

  const cellsEndingAt = (value: number, endColumn: number, keyPrefix: string) => {
    const s = String(value);
    return s.split("").map((ch, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="absolute top-0 text-center"
        style={{
          left: `calc(${prefixCh}ch + ${endColumn - (s.length - 1) + i}ch)`,
          width: "1ch",
        }}
      >
        {ch}
      </span>
    ));
  };

  const quotientCells = rows.map((r) => ({
    col: r.endColumn,
    ch: String(r.quotientDigit),
  }));
  if (!rows.some((r) => !r.isDecimalStep)) {
    quotientCells.unshift({ col: n - 1, ch: "0" });
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="font-mono text-lg leading-none text-text-primary sm:text-xl"
        style={{ minWidth: `${prefixCh + totalCols + 1}ch` }}
      >
        {/* Quotient line */}
        <div className="relative" style={{ height: LINE_H }}>
          {quotientCells.map((c, i) => (
            <span
              key={`q-${i}`}
              className="absolute top-0 text-center"
              style={{ left: `calc(${prefixCh}ch + ${c.col}ch)`, width: "1ch" }}
            >
              {c.ch}
            </span>
          ))}
          {hasDecimal && (
            <span
              className="absolute top-0 text-center"
              style={{
                left: `calc(${prefixCh}ch + ${n}ch)`,
                transform: "translateX(-50%)",
                width: "1ch",
              }}
            >
              .
            </span>
          )}
        </div>
        {/* Rule over the dividend (the 筆算 bracket) */}
        <div className="relative" style={{ height: "0.45rem" }}>
          <span
            className="absolute border-t-2 border-text-primary"
            style={{
              left: `calc(${prefixCh}ch - 0.6ch)`,
              width: `calc(${n}ch + 0.6ch)`,
              top: "0.35rem",
            }}
          />
        </div>
        {/* Dividend line: divisor + ） + digits */}
        <div className="relative" style={{ height: LINE_H }}>
          <span
            className="absolute top-0"
            style={{ left: 0, width: `${prefixCh}ch`, textAlign: "right" }}
          >
            {B}）
          </span>
          {A.split("").map((ch, i) => (
            <span
              key={`a-${i}`}
              className="absolute top-0 text-center"
              style={{ left: `calc(${prefixCh}ch + ${i}ch)`, width: "1ch" }}
            >
              {ch}
            </span>
          ))}
        </div>
        {/* One product / rule / next-partial block per step */}
        {rows.map((row, k) => {
          const next = rows[k + 1];
          const belowValue = next ? next.partialDividend : row.remainderAfter;
          const belowEnd = next ? next.endColumn : row.endColumn;
          const prodStr = String(row.product);
          const prodStart = row.endColumn - (prodStr.length - 1);
          return (
            <div key={`row-${k}`}>
              <div className="relative" style={{ height: LINE_H }}>
                {cellsEndingAt(row.product, row.endColumn, `p${k}`)}
              </div>
              <div className="relative" style={{ height: "0.45rem" }}>
                <span
                  className="absolute border-t border-text-secondary"
                  style={{
                    left: `calc(${prefixCh}ch + ${prodStart}ch)`,
                    width: `${prodStr.length}ch`,
                    top: "0.1rem",
                  }}
                />
              </div>
              <div className="relative" style={{ height: LINE_H }}>
                {cellsEndingAt(belowValue, belowEnd, `r${k}`)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildNarration(
  result: LongDivisionComputation,
  page: ReturnType<typeof useLocale>["t"]["longDivisionPage"],
): string[] {
  const B = result.scaledDivisor;
  const A = String(result.scaledDividend);
  const lines: string[] = [];
  if (result.rows.length > 0) {
    lines.push(fmt(page.narrIntro, String(B)));
  }
  result.rows.forEach((row, k) => {
    let text: string;
    if (row.quotientDigit === 0 && row.partialDividend < B) {
      text = fmt(page.narrZeroDigit, String(row.partialDividend), String(B));
    } else {
      text = fmt(
        page.narrRow,
        String(row.partialDividend),
        String(B),
        String(row.quotientDigit),
        String(row.product),
        String(row.remainderAfter),
      );
    }
    const next = result.rows[k + 1];
    if (next) {
      text += next.isDecimalStep
        ? fmt(page.narrBringDownZero, String(next.partialDividend))
        : fmt(page.narrBringDown, A[next.endColumn], String(next.partialDividend));
    }
    lines.push(text);
  });
  return lines;
}

export function LongDivisionCalculator() {
  const { t } = useLocale();
  const page = t.longDivisionPage;
  const [dividendStr, setDividendStr] = useState("1234");
  const [divisorStr, setDivisorStr] = useState("7");
  const [places, setPlaces] = useState(6);

  const computed = useMemo(() => {
    const dividend = Number(dividendStr);
    const divisor = Number(divisorStr);
    if (
      dividendStr.trim() === "" ||
      divisorStr.trim() === "" ||
      !Number.isFinite(dividend) ||
      !Number.isFinite(divisor)
    ) {
      return { result: null as LongDivisionComputation | null, error: true };
    }
    try {
      const result = computeLongDivision(dividend, divisor, places);
      if (
        String(result.scaledDividend).length > 12 ||
        String(result.scaledDivisor).length > 9
      ) {
        return { result: null as LongDivisionComputation | null, error: true };
      }
      return { result, error: false };
    } catch {
      return { result: null as LongDivisionComputation | null, error: true };
    }
  }, [dividendStr, divisorStr, places]);

  const result = computed.result;
  const narration = result ? buildNarration(result, page) : [];
  const dividendNum = Number(dividendStr);
  const divisorNum = Number(divisorStr);
  const hasNegative = dividendNum < 0 || divisorNum < 0;
  const paren = (v: string) => (v.startsWith("-") ? `(${v})` : v);

  return (
    <div>
      <p className="mx-auto max-w-2xl text-center text-base text-text-secondary sm:text-lg">
        <LinkedText text={page.description} activeHref={HREF} />
      </p>
      <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={page.introParagraph} activeHref={HREF} />
      </p>

      <div className="mx-auto mt-10 max-w-2xl">
        <SurfacePanel>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-secondary">
                {t.longDivision.dividend}
              </span>
              <InputWell
                type="number"
                inputMode="decimal"
                step="any"
                value={dividendStr}
                onChange={(e) => setDividendStr(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-secondary">
                {t.longDivision.divisor}
              </span>
              <InputWell
                type="number"
                inputMode="decimal"
                step="any"
                value={divisorStr}
                onChange={(e) => setDivisorStr(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-secondary">
                {page.decimalPlacesLabel}
              </span>
              <SelectWell
                value={places}
                onChange={(e) => setPlaces(Number(e.target.value))}
              >
                {PRECISION_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectWell>
            </label>
          </div>

          {result ? (
            <>
              <div className="mt-6">
                <h2 className="text-sm font-semibold tracking-wide text-text-secondary">
                  {page.answerHeading}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="rounded-[var(--radius-md)] border border-border bg-surface-sunken px-4 py-4 text-center">
                    <div className="text-xs font-medium text-text-secondary">
                      {t.longDivision.quotient}
                    </div>
                    <div className="mt-1 break-all text-3xl font-bold tabular-nums text-text-primary">
                      {result.quotientInteger}
                    </div>
                  </div>
                  <div className="rounded-[var(--radius-md)] border border-border bg-surface-sunken px-4 py-4 text-center">
                    <div className="text-xs font-medium text-text-secondary">
                      {t.longDivision.remainder}
                    </div>
                    <div className="mt-1 break-all text-3xl font-bold tabular-nums text-text-primary">
                      {result.remainder}
                    </div>
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-sm text-text-secondary sm:text-base">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="font-medium">{page.decimalResultLabel}</dt>
                    <dd className="break-all font-mono font-semibold text-text-primary">
                      {result.decimalDisplay}
                    </dd>
                    {result.cycleStart !== null && (
                      <dd className="text-xs sm:text-sm">{page.cycleNote}</dd>
                    )}
                  </div>
                  {!result.terminates && places > 0 && (
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <dt className="font-medium">
                        {fmt(page.roundedLabel, String(places))}
                      </dt>
                      <dd className="font-mono font-semibold text-text-primary">
                        {result.roundedDecimal}
                      </dd>
                    </div>
                  )}
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <dt className="font-medium">{page.checkLabel}</dt>
                    <dd className="font-mono font-semibold text-text-primary">
                      {paren(String(divisorNum))} × {paren(result.quotientInteger)} +{" "}
                      {paren(result.remainder)} = {String(dividendNum)}
                    </dd>
                  </div>
                </dl>
              </div>

              {result.rows.length > 0 && (
                <>
                  <Divider className="my-6" />
                  <h3 className="text-base font-bold text-text-primary sm:text-lg">
                    {page.stepsHeading}
                  </h3>
                  <div className="mt-4">
                    <HissanLayout result={result} />
                  </div>
                  <h4 className="mt-6 text-sm font-semibold text-text-primary sm:text-base">
                    {page.narrationTitle}
                  </h4>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
                    {narration.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                  {result.scale > 0 && (
                    <p className="mt-4 text-xs leading-relaxed text-text-tertiary sm:text-sm">
                      {fmt(
                        page.scaleNote,
                        String(10 ** result.scale),
                        String(result.scaledDividend),
                        String(result.scaledDivisor),
                        result.remainder,
                      )}
                    </p>
                  )}
                  {hasNegative && (
                    <p className="mt-2 text-xs leading-relaxed text-text-tertiary sm:text-sm">
                      {page.negativeNote}
                    </p>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="mt-6 text-sm text-text-secondary">{page.errorNote}</p>
          )}
        </SurfacePanel>
      </div>

      <section
        aria-labelledby="long-division-method-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="long-division-method-heading" className={GUIDE_HEADING_CLASS}>
          {page.methodTitle}
        </h2>
        <p className={GUIDE_BODY_CLASS}>{page.methodIntro}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {page.methodSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-[var(--radius-md)] border border-border bg-surface-sunken px-4 py-4"
            >
              <h3 className="text-base font-semibold text-text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="long-division-examples-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="long-division-examples-heading" className={GUIDE_HEADING_CLASS}>
          {page.guideExamplesTitle}
        </h2>
        <p className={GUIDE_BODY_CLASS}>{page.examplesIntro}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                {page.examplesTable.columns.map((col) => (
                  <th key={col} className="px-3 py-2.5 text-left font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.examplesTable.rows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={
                        i === 0
                          ? "px-3 py-2.5 font-medium text-text-primary"
                          : "px-3 py-2.5 text-text-secondary"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="long-division-decimal-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="long-division-decimal-heading" className={GUIDE_HEADING_CLASS}>
          {page.decimalSectionTitle}
        </h2>
        {page.decimalSectionParagraphs.map((paragraph, i) => (
          <p key={i} className={GUIDE_BODY_CLASS}>
            <LinkedText text={paragraph} activeHref={HREF} />
          </p>
        ))}
      </section>

      <section
        aria-labelledby="long-division-remainder-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="long-division-remainder-heading" className={GUIDE_HEADING_CLASS}>
          {page.remainderSectionTitle}
        </h2>
        {page.remainderSectionParagraphs.map((paragraph, i) => (
          <p key={i} className={GUIDE_BODY_CLASS}>
            <LinkedText text={paragraph} activeHref={HREF} />
          </p>
        ))}
      </section>

      <section
        aria-labelledby="long-division-mistakes-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="long-division-mistakes-heading" className={GUIDE_HEADING_CLASS}>
          {page.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {page.guideMistakes.map((mistake, i) => (
            <li key={i}>{mistake}</li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={page.howToTitle} steps={page.howToSteps} />
      <CalculatorFaqSection title={page.faqTitle} items={page.faqItems} />
      <RelatedCalculators activeHref={HREF} />
    </div>
  );
}
