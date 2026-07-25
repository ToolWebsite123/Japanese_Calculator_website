import Script from "next/script";
import { FAQ as DiscountCalculatorFaq } from "@/components/calculators/DiscountCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { DiscountCalculator } from "@/components/calculators/DiscountCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "割引 計算｜％・割・逆算・消費税対応の割引 計算ツール";
const metaDescription =
  "割引 計算を、％や「割（1割＝10％）」・値引き額（円）で行えるツール。定価から割引後の価格を求める通常計算と、セール価格から元の定価を求める逆算の両方に対応。消費税8％／10％や端数処理（切り捨て・四捨五入・切り上げ）も選べます。";

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
