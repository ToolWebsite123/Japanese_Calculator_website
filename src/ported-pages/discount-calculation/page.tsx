import Script from "next/script";
import { FAQ as DiscountCalculatorFaq } from "@/components/calculators/DiscountCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { DiscountCalculator } from "@/components/calculators/DiscountCalculator";



export default function DiscountCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(DiscountCalculatorFaq.items, "割引 計算");

  return (
    <>
      <Script
        id="discount-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DiscountCalculator />
    </>
  );
}
