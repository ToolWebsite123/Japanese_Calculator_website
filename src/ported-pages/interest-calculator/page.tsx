import Script from "next/script";
import { InterestMethodCalculator } from "@/components/calculators/InterestMethodCalculator";
import { interestMethodPage } from "@/lib/i18n/pages/interest";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function InterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    interestMethodPage.faqItems,
    interestMethodPage.title,
  );

  return (
    <>
      <Script
        id="interest-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <InterestMethodCalculator />
    </>
  );
}
