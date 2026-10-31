import Script from "next/script";
import { FAQ as FurusatoNozeiCalculatorFaq } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiCalculator } from "@/components/calculators/FurusatoNozeiCalculator";
import { metaTitle } from "@/ported-pages/furusato-nozei-calculation/metadata";



export default function FurusatoNozeiCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    FurusatoNozeiCalculatorFaq.items,
    metaTitle,
  );

  return (
    <>
      <Script
        id="furusato-nozei-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FurusatoNozeiCalculator />
    </>
  );
}
