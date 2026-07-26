import Script from "next/script";
import { SimultaneousEquationsCalculator } from "@/components/calculators/SimultaneousEquationsCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "2元1次方程式の解を計算";
const metaDescription =
  "連立方程式計算機です。2元1次方程式の係数を入力するだけで、xとyの解をすばやくわかりやすく確認できます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/simultaneous-equations-calculator",
  keywords: ["連立方程式", "連立方程式計算機", "連立方程式の解き方", "クラメーの公式", "2元1次"],
});

export default function SimultaneousEquationsPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.simultaneousEquationsPage.faqItems,
    ja.simultaneousEquationsPage.title,
  );

  return (
    <>
      <Script
        id="simultaneous-equations-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SimultaneousEquationsCalculator />
    </>
  );
}
