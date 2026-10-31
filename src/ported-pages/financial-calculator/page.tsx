import Script from "next/script";
import { FinancialCalculator } from "@/components/calculators/FinancialCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function FinancialPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.financialPage.faqItems, ja.financialPage.title);

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
