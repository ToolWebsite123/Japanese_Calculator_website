import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { ScientificCalculator } from "@/components/calculators/ScientificCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "関数電卓オンライン｜三角関数・対数・ルート対応｜電卓.online",
  description:
    "sin・cos・tanなどの三角関数、対数（底の指定も可）、平方根・n乗根、階乗に対応した無料のオンライン関数電卓。順列・組み合わせ（nCr・nPr）や最大公約数・最小公倍数も計算でき、理系の学習や工学計算に役立ちます。登録不要でブラウザですぐ使えます。",
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
    "双曲線関数",
    "順列組み合わせ計算機",
    "nCr計算",
    "nPr計算",
    "最大公約数計算機",
    "最小公倍数計算機",
    "変数保存",
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
