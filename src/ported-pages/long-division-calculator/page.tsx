import Script from "next/script";
import { LongDivisionCalculator } from "@/components/calculators/LongDivisionCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function LongDivisionPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.longDivisionPage.faqItems,
    ja.longDivisionPage.title,
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
