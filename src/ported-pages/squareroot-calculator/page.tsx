import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { RootCalculator } from "@/components/calculators/RootCalculator";



export default function RootPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.rootPage.faqItems, ja.rootPage.title);

  return (
    <>
      <Script
        id="root-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <RootCalculator />
    </>
  );
}
