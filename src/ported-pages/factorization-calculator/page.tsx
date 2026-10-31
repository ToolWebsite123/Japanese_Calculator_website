import Script from "next/script";
import { FactorizationCalculator } from "@/components/calculators/FactorizationCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function FactorizationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.factorizationPage.faqItems,
    ja.factorizationPage.title,
  );

  return (
    <>
      <Script
        id="factorization-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FactorizationCalculator />
    </>
  );
}
