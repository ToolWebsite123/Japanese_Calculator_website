import Script from "next/script";
import { AlgebraCalculator } from "@/components/calculators/AlgebraCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "方程式計算機｜文字式・一次方程式を途中式つきで解く｜電卓.online";
const metaDescription =
  "xを含む文字式に値を代入して計算したり、一次方程式 ax+b=c を解ける無料の文字式・方程式計算機。展開・整理の手順もステップ表示するので、中学数学の授業の復習や宿題の答え合わせ、途中式の確認に使えます。";

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
