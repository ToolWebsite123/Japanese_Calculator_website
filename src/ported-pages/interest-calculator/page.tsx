import Script from "next/script";
import { InterestMethodCalculator } from "@/components/calculators/InterestMethodCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function InterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.interestMethodPage.faqItems,
    ja.interestMethodPage.title,
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
