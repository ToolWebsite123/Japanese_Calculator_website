import Script from "next/script";
import { WebCalculator } from "@/components/calculators/WebCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function WebCalculatorPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.webCalculatorPage.faqItems,
    ja.webCalculatorPage.title,
  );

  return (
    <>
      <Script
        id="web-calculator-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WebCalculator />
    </>
  );
}
