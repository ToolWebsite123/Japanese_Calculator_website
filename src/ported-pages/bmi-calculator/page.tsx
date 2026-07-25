import Script from "next/script";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "BMIの計算｜BMI計算・体格指数";
const metaDescription =
  "身長と体重からBMIを算出し、日本肥満学会の基準で低体重・普通体重・肥満（1〜4度）を判定。適正体重の目安も同時に表示する無料のBMI計算ツールです。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/bmi-calculator",
  keywords: ["BMI計算", "BMIの計算", "体格指数", "肥満度", "BMI"],
});

export default function BmiPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.bmiPage.faqItems,
    ja.bmiPage.title
  );

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
