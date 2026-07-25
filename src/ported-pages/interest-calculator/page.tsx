import Script from "next/script";
import { InterestMethodCalculator } from "@/components/calculators/InterestMethodCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "利息計算（単利・複利）";
const metaDescription =
  "単利と複利を並べて比較できる利息計算ツール。同じ元本・金利・期間で受取利息と元利合計がどれだけ差になるかを一覧と差額で確認できます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/interest-calculator",
  keywords: ["利息計算", "単利計算", "単利複利比較", "単利", "複利比較"],
});

export default function InterestPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.interestMethodPage.faqItems,
    ja.interestMethodPage.title
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
