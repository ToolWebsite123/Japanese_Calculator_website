import Script from "next/script";
import { UnitConverter } from "@/components/calculators/UnitConverter";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function UnitConverterPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.unitsPage.faqItems, ja.unitsPage.title);

  return (
    <>
      <Script
        id="unit-converter-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <UnitConverter />
    </>
  );
}
