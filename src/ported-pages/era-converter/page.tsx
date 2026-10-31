import Script from "next/script";
import { EraConverter } from "@/components/calculators/EraConverter";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function EraPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.eraPage.faqItems, ja.eraPage.title);

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
