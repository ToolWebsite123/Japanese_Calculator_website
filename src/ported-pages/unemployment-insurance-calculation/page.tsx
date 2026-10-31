import Script from "next/script";
import { FAQ as UnemploymentInsuranceCalculatorFaq } from "@/components/calculators/UnemploymentInsuranceCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { UnemploymentInsuranceCalculator } from "@/components/calculators/UnemploymentInsuranceCalculator";



export default function UnemploymentInsurancePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    UnemploymentInsuranceCalculatorFaq.items,
    "失業保険 計算",
  );

  return (
    <>
      <Script
        id="unemployment-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <UnemploymentInsuranceCalculator />
    </>
  );
}
