import Script from "next/script";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "パーセント計算機｜割合の求め方・○％はいくつ｜電卓.online";
const metaDescription =
  "「Aの○％はいくつか」「AはBの何％か」「増減率は何％か」を1画面で計算できる無料のパーセント計算機。割合・比率・前年比の算出に対応し、消費税や割引の計算など日常の割合計算をステップ解説つきでサポートします。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/percentage-calculator",
  keywords: ["パーセント計算", "割合計算", "増減率", "比率", "パーセント"],
});

export default function PercentagePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.percentagePage.faqItems, ja.percentagePage.title);

  return (
    <>
      <Script
        id="percentage-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PercentageCalculator />
    </>
  );
}
