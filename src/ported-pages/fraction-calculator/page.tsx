import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FractionCalculator } from "@/components/calculators/FractionCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "分数電卓 | 分数計算機",
  description:
    "分数の加減乗除・約分・帯分数に対応した無料の分数電卓・分数計算機。電卓分数・計算機分数の計算がすぐにできます。",
  path: "/fraction-calculator",
  keywords: [
    "分数電卓",
    "分数計算機",
    "電卓分数",
    "計算機分数",
    "分数計算",
    "約分",
    "分数の掛け算電卓",
  ],
});

export default function FractionPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.fractionPage.faqItems, ja.fractionPage.title);

  return (
    <>
      <Script
        id="fraction-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FractionCalculator />
    </>
  );
}
