import Script from "next/script";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "BMI計算｜身長・体重から肥満度と標準体重を判定｜電卓.online";
const metaDescription =
  "身長と体重を入力するだけでBMI（体格指数）を自動計算し、日本肥満学会の基準で低体重・普通体重・肥満（1〜4度）を判定する無料ツール。標準体重（適正体重）と現在の体重との差も同時に表示します。登録不要ですぐ使えます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/bmi-calculator",
  keywords: ["BMI計算", "BMIの計算", "体格指数", "肥満度", "BMI"],
});

export default function BmiPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.bmiPage.faqItems, ja.bmiPage.title);

  return (
    <>
      <Script
        id="bmi-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BmiCalculator />
    </>
  );
}
