import Script from "next/script";
import { AlgebraCalculator } from "@/components/calculators/AlgebraCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "文字式計算機｜計算式・一次方程式";
const metaDescription =
  "xを含む式に値を代入して計算したり、一次方程式 ax+b=c を解ける文字式計算機。展開・整理の手順も表示するので中学数学の確認学習に使えます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/algebra-calculator",
  keywords: ["文字式計算機", "計算式", "文字式の計算方法", "一次方程式", "代数式", "文字式"],
});

export default function AlgebraPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.algebraPage.faqItems, ja.algebraPage.title);

  return (
    <>
      <Script
        id="algebra-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AlgebraCalculator />
    </>
  );
}
