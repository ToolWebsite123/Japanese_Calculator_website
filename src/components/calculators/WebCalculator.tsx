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
      <StandardCalculator
        title={t.webCalculatorPage.title}
        description={t.webCalculatorPage.description}
      />


      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
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
