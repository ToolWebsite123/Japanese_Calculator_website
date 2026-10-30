import Script from "next/script";
import { FAQ as MahjongCalculatorFaq } from "@/components/calculators/MahjongCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { MahjongCalculator } from "@/components/calculators/MahjongCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "麻雀点数計算｜符・翻から自動計算・支払い内訳つき｜電卓.online";
const metaDescription =
  "翻（ハン）と符、親／子、ロン／ツモを選ぶだけで麻雀の点数を自動計算する無料ツール。支払いの内訳や満貫・跳満・倍満・三倍満・役満の固定点にも対応し、符計算ヘルパーで副底・待ち・雀頭・面子の符も自動で求められます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/mahjong-score-calculation",
  keywords: ["麻雀 点数 計算", "麻雀", "点数計算", "翻", "符", "満貫", "跳満", "倍満", "役満"],
});

export default function MahjongScoreCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(MahjongCalculatorFaq.items, "麻雀 点数 計算");

  return (
    <>
      <Script
        id="mahjong-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MahjongCalculator />
    </>
  );
}
