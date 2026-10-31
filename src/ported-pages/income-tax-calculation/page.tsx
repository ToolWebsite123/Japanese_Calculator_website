import Script from "next/script";
import { FAQ as IncomeTaxCalculatorFaq } from "@/components/calculators/IncomeTaxCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { IncomeTaxCalculator } from "@/components/calculators/IncomeTaxCalculator";



export default function IncomeTaxCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(IncomeTaxCalculatorFaq.items, "所得税 計算");

  return (
    <>
      <Script
        id="income-tax-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <IncomeTaxCalculator />
    </>
  );
}
