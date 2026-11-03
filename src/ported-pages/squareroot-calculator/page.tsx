import Script from "next/script";
import { rootPage } from "@/lib/i18n/pages/root";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { RootCalculator } from "@/components/calculators/RootCalculator";



export default function RootPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(rootPage.faqItems, rootPage.title);

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
