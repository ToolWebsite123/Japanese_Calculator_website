import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { SocialInsuranceCalculator } from "@/components/calculators/SocialInsuranceCalculator";



export default function SocialInsurancePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.socialInsurancePage.faqItems,
    ja.socialInsurancePage.title,
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
