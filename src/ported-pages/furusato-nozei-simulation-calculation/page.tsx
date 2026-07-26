import Script from "next/script";
import { FAQ as FurusatoNozeiSimulatorFaq } from "@/components/calculators/FurusatoNozeiSimulator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { FurusatoNozeiSimulator } from "@/components/calculators/FurusatoNozeiSimulator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "ふるさと納税 シミュレーション｜詳細版 控除上限額";
const metaDescription =
  "ふるさと納税 シミュレーションの詳細版。生命保険料控除・地震保険料控除・医療費控除・障害者控除・ひとり親控除・住宅ローン控除まで全ての所得控除を反映して控除上限額をリアルタイムに算出。furusato-tax.jp のExcelシートと同じ精度の計算を、ダウンロード不要のブラウザ完結型で提供します。";

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
    "ふるさと納税 シミュレーション｜詳細版 控除上限額",
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
