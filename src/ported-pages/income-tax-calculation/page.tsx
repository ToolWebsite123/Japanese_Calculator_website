import Script from "next/script";
import { FAQ as IncomeTaxCalculatorFaq } from "@/components/calculators/IncomeTaxCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { IncomeTaxCalculator } from "@/components/calculators/IncomeTaxCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "所得税 計算｜年収から所得税・復興特別所得税を自動算出";
const metaDescription =
  "所得税 計算を、年収と雇用形態（会社員／個人事業主）から概算できるツール。2025年改正の給与所得控除・基礎控除、所得税の速算表、復興特別所得税（2.1％）に対応。社会保険料控除やその他の所得控除も任意で入力でき、課税所得・所得税・納税額合計を段階的に表示します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/income-tax-calculation",
  keywords: ["所得税 計算", "所得税", "年収", "給与所得控除", "基礎控除", "復興特別所得税", "課税所得"],
});

export default function IncomeTaxCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(IncomeTaxCalculatorFaq.items, "所得税 計算");

  return (
    <>
      <Script
        id="income-tax-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <IncomeTaxCalculator />
    </>
  );
}
