"use client";

import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { StandardCalculator } from "@/components/calculators/StandardCalculator";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { useLocale } from "@/context/LocaleContext";

export function WebCalculator() {
  const { t } = useLocale();

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.webCalculatorPage.title}
      </h1>
      <StandardCalculator
        title={t.webCalculatorPage.title}
        description={t.webCalculatorPage.description}
      />

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.webCalculatorPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.webCalculatorPage.introParagraph} />
      </p>

      <CalculatorHowToSection
        title={t.webCalculatorPage.howToTitle}
        steps={t.webCalculatorPage.howToSteps}
      />

      <CalculatorFaqSection
        title={t.webCalculatorPage.faqTitle}
        items={t.webCalculatorPage.faqItems}
      />
      <RelatedCalculators activeHref="/web-calculator" />
    </>
  );
}
