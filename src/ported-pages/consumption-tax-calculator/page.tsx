import Script from "next/script";
import { FAQ as ConsumptionTaxCalculatorFaq } from "@/components/calculators/ConsumptionTaxCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { ConsumptionTaxCalculator } from "@/components/calculators/ConsumptionTaxCalculator";



export default function ConsumptionTaxCalculatorPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ConsumptionTaxCalculatorFaq.items, "消費税 計算");
  return (
    <>
      <Script
        id="consumption-tax-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ConsumptionTaxCalculator />
    </>
  );
}
