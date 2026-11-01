"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { ChipButton, Divider, SegmentedControl, SurfacePanel } from "@/components/ui/primitives";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { useHistory } from "@/context/HistoryContext";
import {
  factorizeExpression,
  primeFactorSteps,
  type FactorizeResult,
} from "@/lib/calculators/factorize";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useLocale } from "@/context/LocaleContext";
import { primeFactorize, type PrimeFactor } from "@/lib/calculators/scientific";
import type { ReactNode } from "react";

const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";
const tableWrapClass = "mt-4 overflow-x-auto";
const tableClass = "w-full border-collapse text-sm sm:text-base";
const thClass = "border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold text-text-primary";
const tdClass = "border-b border-border px-3 py-2.5 text-text-secondary";
const sectionH2Class =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";

function FactorizeSteps({ input, data }: { input: string; data: FactorizeResult }) {
  return (
    <SurfacePanel className="space-y-2">
      <p className="font-semibold text-text-primary">{input.trim()}</p>
      {data.steps.map((line) => (
        <p key={line} className="text-sm text-text-secondary sm:text-base">
          {line}
        </p>
      ))}
      <p className="text-sm text-text-secondary sm:text-base">
        ＝ <strong className="text-text-primary">{data.result}</strong>
      </p>
    </SurfacePanel>
  );
}

export function FactorizationCalculator() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [mode, setMode] = useState<"poly" | "prime">("poly");
  const [expr, setExpr] = useState("x^2 + 5x + 6");
  const [numberInput, setNumberInput] = useState<string>("360");

  const polyComputed = useMemo((): { data: FactorizeResult | null; error: string | null } => {
    if (mode !== "poly") return { data: null, error: null };
    try {
      return { data: factorizeExpression(expr), error: null };
    } catch (e) {
      return {
        data: null,
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }
  }, [mode, expr, t]);

  // Wave 1B fix (M-05) preserved: prime factorization goes through the lib
  // (cap 1e12, Japanese errors) instead of unbounded trial division in render.
  const primeComputed = useMemo(() => {
    const num = parseInt(numberInput);
    if (isNaN(num) || num < 0) {
      return { num, factorDisplay: null as ReactNode, plain: "", divisors: [] as number[], steps: [] as ReturnType<typeof primeFactorSteps>, isPrime: false, error: t.common.invalidInput as string | null };
    }
    if (num === 0) {
      return { num, factorDisplay: null as ReactNode, plain: "", divisors: [] as number[], steps: [], isPrime: false, error: "0は素因数分解できません" as string | null };
    }
    if (num === 1) {
      return { num, factorDisplay: "1" as ReactNode, plain: "1", divisors: [1], steps: [], isPrime: false, error: null as string | null };
    }
    let factors: PrimeFactor[];
    try {
      factors = primeFactorize(num);
    } catch (e) {
      return { num, factorDisplay: null as ReactNode, plain: "", divisors: [] as number[], steps: [], isPrime: false, error: (e instanceof Error ? e.message : t.common.invalidInput) as string | null };
    }
    const factorDisplay: ReactNode = factors.map((f, idx) => (
      <span key={f.prime}>
        {idx > 0 && " × "}
        {f.prime}
        {f.exponent > 1 && <sup>{f.exponent}</sup>}
      </span>
    ));
    const plain = factors
      .map((f) => (f.exponent > 1 ? `${f.prime}^${f.exponent}` : `${f.prime}`))
      .join(" × ");
    const divisors: number[] = [];
    for (let i = 1; i * i <= num; i++) {
      if (num % i === 0) {
        divisors.push(i);
        if (i * i !== num) divisors.push(num / i);
      }
    }
    divisors.sort((a, b) => a - b);
    let steps: ReturnType<typeof primeFactorSteps> = [];
    try {
      steps = primeFactorSteps(num);
    } catch {
      steps = [];
    }
    const isPrime = factors.length === 1 && factors[0].prime === num && factors[0].exponent === 1;
    return { num, factorDisplay, plain, divisors, steps, isPrime, error: null as string | null };
  }, [numberInput, t]);

  // Log to history once a result settles, not on every keystroke.
  const lastLogged = useRef<string | null>(null);
  useEffect(() => {
    let key: string | null = null;
    let entry: { expression: string; result: string } | null = null;
    if (mode === "poly" && polyComputed.data) {
      key = `poly:${expr}`;
      entry = { expression: expr, result: polyComputed.data.result };
    } else if (mode === "prime" && !primeComputed.error && primeComputed.plain) {
      key = `prime:${primeComputed.num}`;
      entry = { expression: `${primeComputed.num} の素因数分解`, result: primeComputed.plain };
    }
    if (!key || !entry) return;
    const timer = setTimeout(() => {
      if (lastLogged.current !== key) {
        lastLogged.current = key;
        addEntry({ ...entry!, route: "/factorization-calculator" });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [mode, expr, polyComputed, primeComputed, addEntry]);

  const copyValue =
    mode === "poly" ? polyComputed.data?.result : primeComputed.error ? undefined : primeComputed.plain || undefined;

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.factorizationPage.title}
      </h1>
      <CalculatorCard
        compact
        actions={copyValue ? <CopyResultButton value={copyValue} /> : undefined}
      >
        <div className="space-y-6">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: "poly", label: t.factorization.polyMode },
              { value: "prime", label: t.factorization.primeMode },
            ]}
          />

          {mode === "poly" ? (
            <>
              <FormField
                label={t.factorization.expression}
                type="text"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="例: x^2 + 5x + 6"
                className="text-lg"
              />
              {polyComputed.error && <ErrorMessage message={polyComputed.error} />}
              {polyComputed.data && (
                <div className="space-y-6">
                  <Divider>
                    <h3 className="mb-4 text-xl font-semibold text-text-primary">答え</h3>
                    <SurfacePanel className="flex items-center justify-center">
                      <span className="text-xl font-bold text-brand sm:text-2xl">
                        {polyComputed.data.result}
                      </span>
                    </SurfacePanel>
                  </Divider>
                  <Divider>
                    <h3 className="mb-4 text-xl font-semibold text-text-primary">途中式</h3>
                    <FactorizeSteps input={expr} data={polyComputed.data} />
                  </Divider>
                  {polyComputed.data.irreducible && (
                    <p className="text-sm text-text-secondary">
                      ※ 有理数の範囲ではこれ以上因数分解できません。
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <FormField
                label={t.factorization.number}
                type="number"
                min={1}
                step={1}
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="例: 360"
                className="text-lg"
              />

              <SurfacePanel>
                {primeComputed.error && <ErrorMessage message={primeComputed.error} />}
                <div className="mb-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    {t.factorization.primeFactors}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-brand">{primeComputed.factorDisplay ?? "—"}</div>
                </div>

                {primeComputed.steps.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <div className="text-sm font-medium text-text-tertiary">割り算の手順</div>
                    <ul className="mt-2 space-y-1">
                      {primeComputed.steps.map((s) => (
                        <li key={`${s.dividend}-${s.prime}`} className="text-sm text-text-secondary sm:text-base">
                          {s.dividend} ÷ {s.prime} = {s.quotient}
                        </li>
                      ))}
                      <li className="text-sm text-text-secondary sm:text-base">
                        残り {primeComputed.steps[primeComputed.steps.length - 1].quotient}（素数）
                      </li>
                    </ul>
                  </div>
                )}
                {primeComputed.isPrime && (
                  <p className="border-t border-border pt-4 text-sm text-text-secondary">
                    {primeComputed.num} は素数です（これ以上割れません）。
                  </p>
                )}

                <div className="border-t border-border pt-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    {t.factorization.divisors} ({primeComputed.divisors.length}個)
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {primeComputed.divisors.map((d) => (
                      <ChipButton key={d} className="pointer-events-none">
                        {d}
                      </ChipButton>
                    ))}
                  </div>
                </div>
              </SurfacePanel>
            </>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.factorizationPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.factorizationPage.introParagraph} />
      </p>

      <section aria-labelledby="factor-formula-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="factor-formula-heading" className={sectionH2Class}>
          {t.factorizationPage.formulaTitle}
        </h2>
        {t.factorizationPage.formulaLines.map((line) => (
          <p key={line} className={guideBodyClass}>
            {line}
          </p>
        ))}
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>式</th>
                <th scope="col" className={thClass}>因数分解した結果</th>
              </tr>
            </thead>
            <tbody>
              {t.factorizationPage.formulaTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="factor-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="factor-examples-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.factorizationPage.guideExamplesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.factorizationPage.guideExamples.map((ex) => (
            <li key={ex} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {ex}
            </li>
          ))}
        </ul>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>計算</th>
                <th scope="col" className={thClass}>答え</th>
              </tr>
            </thead>
            <tbody>
              {t.factorizationPage.examplesTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="factor-quick-table-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="factor-quick-table-heading" className={sectionH2Class}>
          {t.factorizationPage.quickTableTitle}
        </h2>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>数</th>
                <th scope="col" className={thClass}>素因数分解</th>
              </tr>
            </thead>
            <tbody>
              {t.factorizationPage.quickTableRows.map((row) => (
                <tr key={row[0]}>
                  <td className={tdClass}>{row[0]}</td>
                  <td className={tdClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="factor-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="factor-mistakes-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.factorizationPage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.factorizationPage.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection
        title={t.factorizationPage.howToTitle}
        steps={t.factorizationPage.howToSteps}
      />

      <CalculatorFaqSection
        title={t.factorizationPage.faqTitle}
        items={t.factorizationPage.faqItems}
      />
      <RelatedCalculators activeHref="/factorization-calculator" />
    </>
  );
}
