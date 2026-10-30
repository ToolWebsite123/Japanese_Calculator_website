import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { RootCalculator } from "@/components/calculators/RootCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "ルート計算・平方根計算機｜√の求め方も解説｜電卓.online",
  description:
    "平方根（ルート）とn乗根を計算できる無料のルート計算機。√2や√3のような近似値もすぐに表示し、ルートの求め方・計算方法もページ内で解説します。会員登録不要で、宿題の検算や学習にスマホからすぐ使えます。",
  path: "/squareroot-calculator",
  keywords: [
    "ルート計算",
    "ルート電卓",
    "ルート計算機",
    "計算機ルート",
    "平方根計算機",
    "平方根電卓",
    "電卓ルート",
    "ルート計算電卓",
  ],
});

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
