import Script from "next/script";
import { FAQ as GraphFaq } from "@/components/calculators/GraphCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { GraphCalculator } from "@/components/calculators/GraphCalculator";

export default function GraphCalculatorPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(GraphFaq.items, "グラフ計算機");

  return (
    <>
      <Script
        id="graph-calculator-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GraphCalculator />
    </>
  );
}
