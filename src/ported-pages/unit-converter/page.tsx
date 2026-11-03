import Script from "next/script";
import { UnitConverter } from "@/components/calculators/UnitConverter";
import { unitsPage } from "@/lib/i18n/pages/units";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function UnitConverterPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(unitsPage.faqItems, unitsPage.title);

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
