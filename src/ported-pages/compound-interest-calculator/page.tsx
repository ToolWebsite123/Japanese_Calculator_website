import Script from "next/script";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function CompoundInterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.compoundInterestPage.faqItems,
    ja.compoundInterestPage.title,
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
