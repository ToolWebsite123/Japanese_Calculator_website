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

export function FactorizationCalculator() {
  const { t } = useLocale();

  const [numberInput, setNumberInput] = useState<string>("12");

  const calculate = () => {
    const num = parseInt(numberInput);
    if (isNaN(num) || num < 0 || num > Number.MAX_SAFE_INTEGER) {
      return {
        primeFactors: "",
        divisors: [] as number[],
        num: 0,
        error: num === 0 ? "0は素因数分解できません" : t.common.invalidInput,
      };
    }

    let temp = num;
    const factors: Record<number, number> = {};
    for (let i = 2; i * i <= temp; i++) {
      while (temp % i === 0) {
        factors[i] = (factors[i] || 0) + 1;
        temp /= i;
      }
    }
    if (temp > 1) {
      factors[temp] = (factors[temp] || 0) + 1;
    }

    const primeFactorsStr = Object.entries(factors)
      .map(([base, exp]) => {
        if (exp === 1) return base;
        return `${base}<sup>${exp}</sup>`;
      })
      .join(" &times; ");

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

    return { primeFactors: primeFactorsStr || num.toString(), divisors, num, error: null };
  };

  const { primeFactors, divisors, error } = calculate();

  return (
    <>
      <CalculatorCard
        title={t.factorizationPage.title}
        description={t.factorizationPage.description}
      >
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
              <div
                className="mt-2 text-2xl font-bold text-brand"
                dangerouslySetInnerHTML={{ __html: primeFactors || "—" }}
              />
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


      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.factorizationPage.introParagraph} />
      </p>

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
