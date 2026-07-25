import Script from "next/script";
import { EraConverter } from "@/components/calculators/EraConverter";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "和暦西暦変換｜和暦と西暦をすばやく変換";
const metaDescription =
  "和暦西暦変換ツールです。令和・平成・昭和などの和暦と西暦を相互に変換し、日付確認をわかりやすく行えます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/era-converter",
  keywords: [
    "和暦西暦変換",
    "和暦計算",
    "元号",
    "令和",
    "平成",
    "昭和",
  ],
});

export default function EraPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.eraPage.faqItems,
    ja.eraPage.title
  );

  return (
    <>
      <Script
        id="era-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <EraConverter />
    </>
  );
}
