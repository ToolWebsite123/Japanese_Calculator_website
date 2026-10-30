import Script from "next/script";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "BMI計算｜身長と体重から肥満度と適正体重を判定｜電卓.online";
const metaDescription =
  "身長と体重を入れるだけでBMIと肥満度、適正体重を自動計算。日本肥満学会の判定基準表と身長別の適正体重の目安、計算例も掲載。登録不要・無料です。";

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
