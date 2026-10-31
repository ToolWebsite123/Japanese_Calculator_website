import Script from "next/script";
import { FAQ as FurusatoNozeiCalculatorFaq } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiCalculator } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "ふるさと納税 かんたんシミュレーション｜限度額（控除上限額）を年収から計算｜電卓.online";
const metaDescription =
  "ふるさと納税の控除上限額（限度額）を、年収と家族構成から簡単に試算できる無料のかんたんシミュレーション。家族構成別の早見表つきで、今年すでに寄付した額を差し引いた残りも分かります。詳しい控除を入れたい方は詳細版もご用意しています。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/furusato-nozei-calculation",
  keywords: ["ふるさと納税", "控除上限額", "寄付上限", "住民税", "所得税", "ワンストップ特例"],
});

export default function FurusatoNozeiCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    FurusatoNozeiCalculatorFaq.items,
    metaTitle,
  );

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
