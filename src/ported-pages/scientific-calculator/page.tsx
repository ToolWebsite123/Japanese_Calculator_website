import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { ScientificCalculator } from "@/components/calculators/ScientificCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "関数電卓 | 三角関数・対数・平方根",
  description:
    "sin・cos・tan・アークタンジェント・対数・平方根・階乗に対応した無料の関数電卓サイト。関数計算・計算機関数の高度な数学計算ができます。",
  path: "/scientific-calculator",
  keywords: [
    "関数電卓",
    "関数電卓サイト",
    "関数計算",
    "計算機関数",
    "数学計算サイト",
    "アークタンジェント",
    "科学計算機",
    "三角関数",
  ],
});

export default function ScientificPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.scientificPage.faqItems, ja.scientificPage.title);

  return (
    <>
      <Script
        id="scientific-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScientificCalculator />
    </>
  );
}
