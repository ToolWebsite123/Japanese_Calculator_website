import Script from "next/script";
import { TimeCalculator } from "@/components/calculators/TimeCalculator";
import { timePage } from "@/lib/i18n/pages/time";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function TimePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(timePage.faqItems, timePage.title);

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
