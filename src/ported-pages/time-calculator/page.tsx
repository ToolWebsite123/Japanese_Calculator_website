import Script from "next/script";
import { TimeCalculator } from "@/components/calculators/TimeCalculator";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "時間計算機｜時間計算・時分秒";
const metaDescription =
  "時・分・秒の足し算・引き算ができる時間計算機。勤務時間の集計、作業時間の合計、休憩時間の差し引きなど、60進法の繰り上がりも自動で処理します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/time-calculator",
  keywords: ["時間計算", "時間計算機", "時分秒", "勤務時間", "時間の足し算"],
});

export default function TimePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ja.timePage.faqItems, ja.timePage.title);

  return (
    <>
      <Script
        id="time-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TimeCalculator />
    </>
  );
}
