import Script from "next/script";
import { FAQ as FurusatoNozeiSimulatorFaq } from "@/components/calculators/FurusatoNozeiSimulator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiSimulator } from "@/components/calculators/FurusatoNozeiSimulator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "ふるさと納税 詳細シミュレーション｜控除上限額を正確に計算｜電卓.online";
const metaDescription =
  "源泉徴収票の数値をもとに、ふるさと納税の控除上限額を詳しく試算する無料の詳細シミュレーション。医療費控除・住宅ローン控除・生命保険料控除など全ての所得控除を反映し、自己負担2,000円に収まる上限額をリアルタイムに算出します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/furusato-nozei-simulation-calculation",
  keywords: [
    "ふるさと納税 シミュレーション",
    "ふるさと納税",
    "控除上限額",
    "詳細シミュレーション",
    "住宅ローン控除",
    "医療費控除",
  ],
});

export default function FurusatoNozeiSimulationCalculationPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    FurusatoNozeiSimulatorFaq.items,
    metaTitle,
  );

  return (
    <>
      <Script
        id="furusato-nozei-simulation-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FurusatoNozeiSimulator />
    </>
  );
}
