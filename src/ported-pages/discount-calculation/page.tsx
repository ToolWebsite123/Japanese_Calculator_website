import Script from "next/script";
import { FAQ as DiscountCalculatorFaq } from "@/components/calculators/DiscountCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { DiscountCalculator } from "@/components/calculators/DiscountCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "割引計算機｜％オフ・割引後の価格と税込表示｜電卓.online";
const metaDescription =
  "％オフや「○割引」から割引後の価格を求める無料の割引計算機。セール価格から元の定価を求める逆算にも対応し、消費税8％／10％の税込・税抜表示や端数処理（切り捨て・四捨五入・切り上げ）も選べます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/discount-calculation",
  keywords: ["割引 計算", "割引", "パーセント", "割", "逆算", "消費税", "セール価格"],
});

export default function DiscountCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(DiscountCalculatorFaq.items, "割引 計算");

  return (
    <>
      <Script
        id="discount-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DiscountCalculator />
    </>
  );
}
