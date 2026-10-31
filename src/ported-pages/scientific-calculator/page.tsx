import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { ScientificCalculator } from "@/components/calculators/ScientificCalculator";



export default function ScientificPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.scientificPage.faqItems, ja.scientificPage.title);

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
