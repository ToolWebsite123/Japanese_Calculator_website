import Script from "next/script";
import { FAQ as DueDateCalculatorFaq } from "@/components/calculators/DueDateCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { DueDateCalculator } from "@/components/calculators/DueDateCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "出産予定日計算機｜生理周期対応・妊娠週数カレンダー付き";
const metaDescription =
  "出産予定日計算機は、最終月経日（LMP）・排卵日/性交日・希望日からの逆算の3方向で出産予定日を計算します。生理周期を21〜40日で調整でき、妊娠初期/中期/後期の開始日や正期産（37週0日〜41週6日）までカレンダー形式で表示。結果は目安のため、医師の超音波検査で確定してください。";

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
