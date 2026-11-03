import Script from "next/script";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { compoundInterestPage } from "@/lib/i18n/pages/compound-interest";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function CompoundInterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    compoundInterestPage.faqItems,
    compoundInterestPage.title,
  );

  return (
    <>
      <Script
        id="compound-interest-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CompoundInterestCalculator />
    </>
  );
}
