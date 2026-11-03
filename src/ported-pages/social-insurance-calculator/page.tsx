import Script from "next/script";
import { socialInsurancePage } from "@/lib/i18n/pages/social-insurance";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { SocialInsuranceCalculator } from "@/components/calculators/SocialInsuranceCalculator";



export default function SocialInsurancePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    socialInsurancePage.faqItems,
    socialInsurancePage.title,
  );

  return (
    <>
      <Script
        id="social-insurance-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SocialInsuranceCalculator />
    </>
  );
}
