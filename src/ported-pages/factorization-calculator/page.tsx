import Script from "next/script";
import { FactorizationCalculator } from "@/components/calculators/FactorizationCalculator";
import { factorizationPage } from "@/lib/i18n/pages/factorization";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function FactorizationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    factorizationPage.faqItems,
    factorizationPage.title,
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
