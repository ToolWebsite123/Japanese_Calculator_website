import Script from "next/script";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "BMI計算｜年齢・性別対応で肥満度と適正体重を判定｜電卓.online";
const metaDescription =
  "身長と体重を入れるだけでBMIと肥満度、適正体重を自動計算。年齢・性別に合わせた目標BMIや体脂肪率の推定、美容体重・シンデレラ体重の目安、BMI早見表も掲載。登録不要・無料です。";

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
