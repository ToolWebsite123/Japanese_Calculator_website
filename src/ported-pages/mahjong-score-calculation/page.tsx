import Script from "next/script";
import { FAQ as MahjongCalculatorFaq } from "@/components/calculators/MahjongCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { MahjongCalculator } from "@/components/calculators/MahjongCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "麻雀 点数 計算｜翻・符から自動で得点＆支払い内訳";
const metaDescription =
  "麻雀 点数 計算を、翻（han）と符（fu）、親／子、ロン／ツモを選ぶだけで自動算出。支払いの内訳（放銃者・親／子の支払い）や、満貫・跳満・倍満・三倍満・役満の固定点にも対応。符計算ヘルパー付きで、副底20符・待ち・雀頭・面子（明刻/暗刻/明槓/暗槓）を選ぶだけで符も自動計算できます。";

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
