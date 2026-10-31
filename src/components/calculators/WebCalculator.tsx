"use client";

import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { StandardCalculator } from "@/components/calculators/StandardCalculator";
import { ButtonGuideTable } from "@/components/calculator/ButtonGuideTable";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { WEB_BUTTON_GUIDE } from "@/lib/calculator-guides/web";
import { useLocale } from "@/context/LocaleContext";
import { useHistoryForRoute } from "@/context/HistoryContext";

// F1 (owner-approved 2026-10-31): always-visible history list beside the
// calculator on lg screens. Reads the same history store the
// StandardCalculator writes to (it stores entries under route "/").
function VisibleHistory() {
  const { history } = useHistoryForRoute("/");
  const { t } = useLocale();
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-[0_10px_30px_rgba(35,25,66,0.07)]">
        <h2 className="text-sm font-semibold text-text-primary">{t.nav.history}</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-text-tertiary">{t.common.historyEmpty}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.slice(0, 8).map((e) => (
              <li key={e.id} className="rounded-lg bg-surface-sunken px-3 py-2">
                <div className="truncate text-xs text-text-secondary">{e.expression}</div>
                <div className="truncate text-base font-semibold text-text-primary">
                  = {e.result}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

const sectionClass = "mt-16 border-t border-border pt-16";
const headingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const bodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

export function WebCalculator() {
  const { t } = useLocale();

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.webCalculatorPage.title}
      </h1>
      <div className="lg:flex lg:items-start lg:justify-center lg:gap-6">
        <VisibleHistory />
        <div className="min-w-0 flex-1">
          <StandardCalculator
            title={t.webCalculatorPage.title}
            description={t.webCalculatorPage.description}
            maxWidthClass="max-w-2xl lg:max-w-[860px]"
          />
        </div>
      </div>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.webCalculatorPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.webCalculatorPage.introParagraph} />
      </p>

      <section aria-labelledby="webcalc-keystroke-heading" className={sectionClass}>
        <h2 id="webcalc-keystroke-heading" className={headingClass}>
          {t.webCalculatorPage.keystrokeTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">計算</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">入力手順</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">結果</th>
              </tr>
            </thead>
            <tbody>
              {t.webCalculatorPage.keystrokeRows.map((row) => (
                <tr key={row.calc} className="border-b border-border">
                  <td className="px-3 py-2.5 text-text-primary">{row.calc}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.keys}</td>
                  <td className="px-3 py-2.5 text-text-primary">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="webcalc-tax-heading" className={sectionClass}>
        <h2 id="webcalc-tax-heading" className={headingClass}>
          {t.webCalculatorPage.taxTitle}
        </h2>
        <p className={bodyClass}>
          <LinkedText text={t.webCalculatorPage.taxBody} activeHref="/web-calculator" />
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                {t.webCalculatorPage.taxTableHead.map((head) => (
                  <th key={head} className="px-3 py-2.5 text-left font-semibold text-text-primary">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.webCalculatorPage.taxRows.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  {row.map((cell, i) => (
                    <td
                      key={cell}
                      className={i === 0 ? "px-3 py-2.5 text-text-primary" : "px-3 py-2.5 text-text-secondary"}
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

      <section aria-labelledby="webcalc-percent-heading" className={sectionClass}>
        <h2 id="webcalc-percent-heading" className={headingClass}>
          {t.webCalculatorPage.percentTitle}
        </h2>
        <p className={bodyClass}>{t.webCalculatorPage.percentBody}</p>
        <div className="mt-4 space-y-2">
          {t.webCalculatorPage.percentExamples.map((ex) => (
            <p
              key={ex}
              className="rounded-lg border border-border bg-surface-sunken px-4 py-3 text-sm leading-relaxed text-text-primary sm:text-base"
            >
              {ex}
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="webcalc-memory-heading" className={sectionClass}>
        <h2 id="webcalc-memory-heading" className={headingClass}>
          {t.webCalculatorPage.memoryGtTitle}
        </h2>
        <p className={bodyClass}>{t.webCalculatorPage.memoryGtBody}</p>
      </section>

      <section aria-labelledby="webcalc-role-heading" className={sectionClass}>
        <h2 id="webcalc-role-heading" className={headingClass}>
          {t.webCalculatorPage.guideRoleTitle}
        </h2>
        <p className={bodyClass}>
          <LinkedText text={t.webCalculatorPage.guideRoleBody} activeHref="/web-calculator" />
        </p>
      </section>

      <section aria-labelledby="webcalc-mistakes-heading" className={sectionClass}>
        <h2 id="webcalc-mistakes-heading" className={headingClass}>
          {t.webCalculatorPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.webCalculatorPage.guideMistakes.map((mistake) => (
            <li key={mistake} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {mistake}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection
        title={t.webCalculatorPage.howToTitle}
        steps={t.webCalculatorPage.howToSteps}
      />

      <ButtonGuideTable title={t.webCalculatorPage.buttonGuideTitle} rows={WEB_BUTTON_GUIDE} />

      <section aria-labelledby="webcalc-shortcuts-heading" className={sectionClass}>
        <h2 id="webcalc-shortcuts-heading" className={headingClass}>
          {t.webCalculatorPage.shortcutsTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">キー</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">操作</th>
              </tr>
            </thead>
            <tbody>
              {t.webCalculatorPage.shortcutsRows.map((row) => (
                <tr key={row.key} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.key}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CalculatorFaqSection
        title={t.webCalculatorPage.faqTitle}
        items={t.webCalculatorPage.faqItems}
      />
      <RelatedCalculators activeHref="/web-calculator" />
    </>
  );
}
