import Script from "next/script";
import { LongDivisionCalculator } from "@/components/calculators/LongDivisionCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "筆算電卓｜商と余りの計算";
const metaDescription =
  "筆算電卓です。割り算の筆算を確認しながら、割られる数と割る数から商と余りをわかりやすく求められます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/long-division-calculator",
  keywords: ["筆算電卓", "割り算の筆算", "商と余りの計算", "商", "余り"],
});

export default function LongDivisionPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.longDivisionPage.faqItems,
    ja.longDivisionPage.title,
  );

  return (
    <>
      <Script
        id="long-division-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LongDivisionCalculator />
    </>
  );
}
