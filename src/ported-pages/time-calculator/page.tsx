import Script from "next/script";
import { TimeCalculator } from "@/components/calculators/TimeCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function TimePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.timePage.faqItems, ja.timePage.title);

  return (
    <>
      <Script
        id="time-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TimeCalculator />
    </>
  );
}
