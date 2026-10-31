import Script from "next/script";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function BmiPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.bmiPage.faqItems, ja.bmiPage.title);

  return (
    <>
      <Script
        id="bmi-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BmiCalculator />
    </>
  );
}
