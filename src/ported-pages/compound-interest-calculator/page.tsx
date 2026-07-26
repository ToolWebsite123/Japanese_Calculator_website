import Script from "next/script";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "複利計算・将来価値";
const metaDescription =
  "元本・年利・期間・複利頻度（年1回〜毎日）から将来価値と利息総額を試算する複利計算機。積立の有無を切り替えて資産の増え方を年ごとに確認できます。";

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
