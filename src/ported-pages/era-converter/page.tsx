import Script from "next/script";
import { EraConverter } from "@/components/calculators/EraConverter";
import { eraPage } from "@/lib/i18n/pages/era";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function EraPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(eraPage.faqItems, eraPage.title);

  return (
    <>
      <Script
        id="era-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <EraConverter />
    </>
  );
}
