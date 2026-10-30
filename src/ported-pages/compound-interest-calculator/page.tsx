import Script from "next/script";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "複利計算シミュレーション｜積立・NISAの将来額と推移表｜電卓.online";
const metaDescription =
  "元本・年利・期間と毎月の積立額から、複利で増える将来額と利息総額を試算する無料シミュレーター。つみたてNISAなど長期の資産運用の目安を、年ごとの推移表で確認できます。単利との違いもページ内で解説します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/compound-interest-calculator",
  keywords: ["複利計算", "複利計算機", "将来価値", "複利", "資産運用"],
});

export default function CompoundInterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.compoundInterestPage.faqItems,
    ja.compoundInterestPage.title,
  );

  return (
    <>
      <Script
        id="compound-interest-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <CompoundInterestCalculator />
    </>
  );
}
