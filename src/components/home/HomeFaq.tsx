"use client";

import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { useLocale } from "@/context/LocaleContext";

// Fresh homepage FAQ (2026-11-02 rewrite). The items live in ja.ts
// (home.faqItems) because the homepage FAQ JSON-LD is built from the
// same data — what is rendered here is exactly what the schema says.
export function HomeFaq() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <CalculatorFaqSection title={t.home.faqTitle} items={t.home.faqItems} />
    </div>
  );
}
