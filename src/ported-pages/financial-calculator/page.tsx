import Script from "next/script";
import { FinancialCalculator } from "@/components/calculators/FinancialCalculator";
import { financialPage } from "@/lib/i18n/pages/financial";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function FinancialPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(financialPage.faqItems, financialPage.title);

  return (
    <>
      <Script
        id="financial-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FinancialCalculator />
    </>
  );
}
