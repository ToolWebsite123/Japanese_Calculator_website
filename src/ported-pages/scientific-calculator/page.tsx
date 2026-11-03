import Script from "next/script";
import { scientificPage } from "@/lib/i18n/pages/scientific";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { ScientificCalculator } from "@/components/calculators/ScientificCalculator";



export default function ScientificPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(scientificPage.faqItems, scientificPage.title);

  return (
    <>
      <Script
        id="scientific-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScientificCalculator />
    </>
  );
}
