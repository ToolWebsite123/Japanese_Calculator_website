import Script from "next/script";
import { SimultaneousEquationsCalculator } from "@/components/calculators/SimultaneousEquationsCalculator";
import { simultaneousEquationsPage } from "@/lib/i18n/pages/simultaneous-equations";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function SimultaneousEquationsPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    simultaneousEquationsPage.faqItems,
    simultaneousEquationsPage.title,
  );

  return (
    <>
      <Script
        id="simultaneous-equations-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SimultaneousEquationsCalculator />
    </>
  );
}
