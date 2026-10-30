import Script from "next/script";
import { FAQ as FurusatoNozeiCalculatorFaq } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiCalculator } from "@/components/calculators/FurusatoNozeiCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "ふるさと納税 かんたんシミュレーション｜控除上限額｜電卓.online";
const metaDescription =
  "ふるさと納税の控除上限額を、年収と家族構成だけで簡単に試算できる無料のかんたんシミュレーション。年収別の早見表つきで、自己負担2,000円で寄付できる上限額の目安がすぐ分かります。詳しい控除を入れたい方は詳細版もご用意しています。";

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
