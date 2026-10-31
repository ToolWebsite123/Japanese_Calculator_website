import Script from "next/script";
import { SimultaneousEquationsCalculator } from "@/components/calculators/SimultaneousEquationsCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";



export default function SimultaneousEquationsPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.simultaneousEquationsPage.faqItems,
    ja.simultaneousEquationsPage.title,
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
