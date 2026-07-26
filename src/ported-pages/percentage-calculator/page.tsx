import Script from "next/script";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "パーセント計算機｜割合計算";
const metaDescription =
  "「AはBの何％か」「Aの○％はいくらか」「増減率は何％か」を1画面で計算できるパーセント計算機。割合・比率・前年比の算出に対応しています。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/percentage-calculator",
  keywords: ["パーセント計算", "割合計算", "増減率", "比率", "パーセント"],
});

export default function PercentagePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.percentagePage.faqItems, ja.percentagePage.title);

  return (
    <>
      <Script
        id="percentage-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PercentageCalculator />
    </>
  );
}
