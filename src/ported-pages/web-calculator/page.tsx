import Script from "next/script";
import { WebCalculator } from "@/components/calculators/WebCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "Web電卓｜電卓web・電卓サイト";
const metaDescription =
  "インストール不要のweb電卓。ブラウザだけで動く電卓webで、PC・スマホ・タブレットから四則演算・括弧・メモリ計算ができます。入力データは端末内で処理されます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/web-calculator",
  keywords: ["電卓web", "web電卓", "電卓サイト", "ブラウザ電卓", "オンライン電卓"],
});

export default function WebCalculatorPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.webCalculatorPage.faqItems,
    ja.webCalculatorPage.title
  );

  return (
    <>
      <Script
        id="web-calculator-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WebCalculator />
    </>
  );
}
