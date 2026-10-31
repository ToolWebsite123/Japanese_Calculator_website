import Script from "next/script";
import { FAQ as DueDateCalculatorFaq } from "@/components/calculators/DueDateCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { DueDateCalculator } from "@/components/calculators/DueDateCalculator";



export default function DueDateCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(DueDateCalculatorFaq.items, "出産予定日計算機");

  return (
    <>
      <Script
        id="due-date-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DueDateCalculator />
    </>
  );
}
