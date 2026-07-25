import Script from "next/script";
import { FAQ as FurusatoNozeiCalculatorFaq } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiCalculator } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "ふるさと納税 寄付｜年収別の寄付上限";
const metaDescription =
  "ふるさと納税の控除上限額を、年収・配偶者控除・扶養家族の年齢区分（16歳未満／16〜18歳／19〜22歳の特定扶養／23歳以上／70歳以上）から公式の計算式で正確に算出。競合サイトの家族タイプ別早見表と異なり、1人単位で扶養家族を入力できます。住民税所得割額・所得税率・寄付上限の目安を段階的に表示します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/furusato-nozei-calculation",
  keywords: ["ふるさと納税", "控除上限額", "寄付上限", "住民税", "所得税", "ワンストップ特例"],
});

export default function FurusatoNozeiCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(FurusatoNozeiCalculatorFaq.items, "ふるさと納税 寄付｜年収別の寄付上限");

  return (
    <>
      <Script
        id="furusato-nozei-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FurusatoNozeiCalculator />
    </>
  );
}
