import Script from "next/script";
import { WebCalculator } from "@/components/calculators/WebCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "Web電卓（オンライン電卓）｜税込・税抜・GT対応の無料ブラウザ電卓｜電卓.online";
const metaDescription =
  "ブラウザですぐ使える無料のWeb電卓（オンライン電卓）。税込・税抜（10%/8%）、GT、メモリ機能、計算履歴、キーボード入力に対応。アプリのインストールや登録は不要で、入力データは端末内でのみ処理されるので安心して使えます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/web-calculator",
  keywords: ["電卓web", "web電卓", "電卓サイト", "ブラウザ電卓", "オンライン電卓"],
});

export default function WebCalculatorPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.webCalculatorPage.faqItems,
    ja.webCalculatorPage.title,
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
