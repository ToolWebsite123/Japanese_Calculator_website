"use client";

import { useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { ChipButton, SurfacePanel } from "@/components/ui/primitives";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useLocale } from "@/context/LocaleContext";
import { primeFactorize, type PrimeFactor } from "@/lib/calculators/scientific";
import type { ReactNode } from "react";

export function FactorizationCalculator() {
  const { t } = useLocale();

  const [numberInput, setNumberInput] = useState<string>("12");

  // Wave 1B fix (M-05): 以前はレンダリング中に上限なしの試し割りを行っており、
  // 大きな素数を入れるとタブが固まった。lib の primeFactorize（上限 1e12、
  // 超過時は日本語エラー）に統一し、指数は React の <sup> で描画する
  // （dangerouslySetInnerHTML は廃止）。
  const calculate = (): {
    factorDisplay: ReactNode;
    divisors: number[];
    error: string | null;
  } => {
    const num = parseInt(numberInput);
    if (isNaN(num) || num < 0) {
      return { factorDisplay: null, divisors: [], error: t.common.invalidInput };
    }
    if (num === 0) {
      return { factorDisplay: null, divisors: [], error: "0は素因数分解できません" };
    }
    if (num === 1) {
      return { factorDisplay: "1", divisors: [1], error: null };
    }

    let factors: PrimeFactor[];
    try {
      factors = primeFactorize(num);
    } catch (e) {
      return {
        factorDisplay: null,
        divisors: [],
        error: e instanceof Error ? e.message : t.common.invalidInput,
      };
    }

    const factorDisplay: ReactNode = factors.map((f, idx) => (
      <span key={f.prime}>
        {idx > 0 && " × "}
        {f.prime}
        {f.exponent > 1 && <sup>{f.exponent}</sup>}
      </span>
    ));

    const divisors: number[] = [];
    for (let i = 1; i * i <= num; i++) {
      if (num % i === 0) {
        divisors.push(i);
        if (i * i !== num) {
          divisors.push(num / i);
        }
      }
    }
    divisors.sort((a, b) => a - b);

    return { factorDisplay, divisors, error: null };
  };

  const { factorDisplay, divisors, error } = calculate();

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.factorizationPage.title}
      </h1>
      <CalculatorCard compact>
        <div className="space-y-6">
          <FormField
            label={t.factorization.number}
            type="number"
            min={1}
            step={1}
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            placeholder="例: 12"
            className="text-lg"
          />

          <SurfacePanel>
            {error && <ErrorMessage message={error} />}
            <div className="mb-4">
              <div className="text-sm font-medium text-text-tertiary">
                {t.factorization.primeFactors}
              </div>
              <div className="mt-2 text-2xl font-bold text-brand">{factorDisplay ?? "—"}</div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-sm font-medium text-text-tertiary">
                {t.factorization.divisors} ({divisors.length}個)
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {divisors.map((d) => (
                  <ChipButton key={d} className="pointer-events-none">
                    {d}
                  </ChipButton>
                ))}
              </div>
            </div>
          </SurfacePanel>
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

      <CalculatorHowToSection
        title={t.factorizationPage.howToTitle}
        steps={t.factorizationPage.howToSteps}
      />

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

      <CalculatorFaqSection
        title={t.factorizationPage.faqTitle}
        items={t.factorizationPage.faqItems}
      />
      <RelatedCalculators activeHref="/factorization-calculator" />
    </>
  );
}
