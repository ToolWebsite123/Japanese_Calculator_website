import Script from "next/script";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import { bmiPage } from "@/lib/i18n/pages/bmi";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function BmiPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(bmiPage.faqItems, bmiPage.title);

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
