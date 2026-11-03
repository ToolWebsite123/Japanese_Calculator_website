import Script from "next/script";
import { fractionPage } from "@/lib/i18n/pages/fraction";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FractionCalculator } from "@/components/calculators/FractionCalculator";



export default function FractionPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(fractionPage.faqItems, fractionPage.title);

  return (
    <>
      <Script
        id="fraction-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FractionCalculator />
    </>
  );
}
