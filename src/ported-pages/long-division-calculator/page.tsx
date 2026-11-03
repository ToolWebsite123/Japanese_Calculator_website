import Script from "next/script";
import { LongDivisionCalculator } from "@/components/calculators/LongDivisionCalculator";
import { longDivisionPage } from "@/lib/i18n/pages/long-division";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function LongDivisionPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    longDivisionPage.faqItems,
    longDivisionPage.title,
  );

  return (
    <>
      <Script
        id="long-division-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LongDivisionCalculator />
    </>
  );
}
