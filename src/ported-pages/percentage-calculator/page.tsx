import Script from "next/script";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { percentagePage } from "@/lib/i18n/pages/percentage";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function PercentagePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(percentagePage.faqItems, percentagePage.title);

  return (
    <>
      <Script
        id="percentage-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PercentageCalculator />
    </>
  );
}
