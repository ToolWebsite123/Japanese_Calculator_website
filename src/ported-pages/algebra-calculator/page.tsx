import Script from "next/script";
import { AlgebraCalculator } from "@/components/calculators/AlgebraCalculator";
import { algebraPage } from "@/lib/i18n/pages/algebra";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function AlgebraPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(algebraPage.faqItems, algebraPage.title);

  return (
    <>
      <Script
        id="algebra-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AlgebraCalculator />
    </>
  );
}
