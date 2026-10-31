import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FractionCalculator } from "@/components/calculators/FractionCalculator";



export default function FractionPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.fractionPage.faqItems, ja.fractionPage.title);

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
