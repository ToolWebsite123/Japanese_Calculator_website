import Script from "next/script";
import { FAQ as DueDateCalculatorFaq } from "@/components/calculators/DueDateCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { DueDateCalculator } from "@/components/calculators/DueDateCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "出産予定日計算｜最終月経・排卵日から妊娠週数も表示｜電卓.online";
const metaDescription =
  "最終月経日・排卵日・受精日などから出産予定日を計算する無料ツール。生理周期の調整にも対応し、現在の妊娠週数や妊娠初期・中期・後期の開始日、正期産の期間までカレンダー形式で表示します。結果は目安としてご利用ください。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/due-date-calculation",
  keywords: [
    "出産予定日 計算",
    "出産予定日",
    "妊娠週数",
    "LMP",
    "排卵日",
    "生理周期",
    "正期産",
    "逆算",
  ],
});

export default function DueDateCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(DueDateCalculatorFaq.items, "出産予定日計算機");

  return (
    <>
      <Script
        id="due-date-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DueDateCalculator />
    </>
  );
}
