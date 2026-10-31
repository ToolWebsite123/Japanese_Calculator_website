import Script from "next/script";
import { AlgebraCalculator } from "@/components/calculators/AlgebraCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function AlgebraPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.algebraPage.faqItems, ja.algebraPage.title);

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
