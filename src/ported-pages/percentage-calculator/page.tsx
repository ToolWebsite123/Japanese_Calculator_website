import Script from "next/script";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "パーセント計算｜割合・何%・増減率・逆算をすぐ計算｜電卓.online";
const metaDescription =
  "「○の○%はいくつ」「○は○の何%」から増減率・全体の逆算まで、割合の計算をまとめて自動計算。公式一覧と歩合（割・分・厘）の換算表つき。無料・登録不要。";

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
