import Script from "next/script";
import { UnitConverter } from "@/components/calculators/UnitConverter";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "単位変換ツール｜長さ・重さ・温度・通貨を一括変換｜電卓.online";
const metaDescription =
  "長さ・重さ・温度・通貨を換算できる無料の単位変換ツール。メートルとインチ、キログラムとポンド、摂氏と華氏など、数値を入力するだけで双方向にすぐ変換できます。海外旅行や料理、仕事の換算確認に便利です。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/unit-converter",
  keywords: ["単位変換", "単位換算", "長さ変換", "重さ変換", "温度変換"],
});

export default function UnitConverterPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.unitsPage.faqItems, ja.unitsPage.title);

  return (
    <>
      <Script
        id="unit-converter-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <UnitConverter />
    </>
  );
}
