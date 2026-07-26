import Script from "next/script";
import { FinancialCalculator } from "@/components/calculators/FinancialCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "金融電卓｜金融計算・TVM";
const metaDescription =
  "PV（現在価値）・FV（将来価値）・PMT（支払額）・利率・期間のうち4つを入力し、残る1つを求めるTVM対応の金融電卓。ローン返済額や積立目標の試算に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/financial-calculator",
  keywords: ["金融計算", "金融電卓", "TVM", "時間価値", "現在価値", "将来価値"],
});

export default function FinancialPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.financialPage.faqItems, ja.financialPage.title);

  return (
    <>
      <Script
        id="financial-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FinancialCalculator />
    </>
  );
}
