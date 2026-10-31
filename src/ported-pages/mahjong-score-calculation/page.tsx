import Script from "next/script";
import { FAQ as MahjongCalculatorFaq } from "@/components/calculators/MahjongCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { MahjongCalculator } from "@/components/calculators/MahjongCalculator";



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
