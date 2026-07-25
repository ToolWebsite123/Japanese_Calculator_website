import Script from "next/script";
import { FactorizationCalculator } from "@/components/calculators/FactorizationCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "因数分解計算機｜素因数分解";
const metaDescription =
  "正の整数を素因数分解し、指数表記の結果と約数一覧をまとめて表示する因数分解計算機。最大公約数・最小公倍数を求める前の確認にも役立ちます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/factorization-calculator",
  keywords: ["因数分解", "素因数分解計算機", "素因数分解", "約数", "因数分解計算"],
});

export default function FactorizationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.factorizationPage.faqItems,
    ja.factorizationPage.title
  );

  return (
    <>
      <Script
        id="factorization-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FactorizationCalculator />
    </>
  );
}
