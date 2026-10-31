import Script from "next/script";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function PercentagePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.percentagePage.faqItems, ja.percentagePage.title);

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
