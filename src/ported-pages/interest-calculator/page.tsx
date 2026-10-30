import Script from "next/script";
import { InterestMethodCalculator } from "@/components/calculators/InterestMethodCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "金利・利息計算機｜単利と複利を比較・預金の利息も｜電卓.online";
const metaDescription =
  "同じ元本・金利・期間で、単利と複利の受取利息と元利合計がどれだけ違うかを並べて比較できる無料の金利計算機。定期預金の利息の目安や、単利と複利の仕組みの違いを計算例で分かりやすく解説します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/interest-calculator",
  keywords: ["利息計算", "単利計算", "単利複利比較", "単利", "複利比較"],
});

export default function InterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.interestMethodPage.faqItems,
    ja.interestMethodPage.title,
  );

  return (
    <>
      <Script
        id="interest-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <InterestMethodCalculator />
    </>
  );
}
