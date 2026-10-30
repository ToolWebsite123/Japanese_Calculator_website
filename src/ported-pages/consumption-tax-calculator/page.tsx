import Script from "next/script";
import { FAQ as ConsumptionTaxCalculatorFaq } from "@/components/calculators/ConsumptionTaxCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { ConsumptionTaxCalculator } from "@/components/calculators/ConsumptionTaxCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "消費税計算｜税込・税抜・税額を10%・8%で自動計算｜電卓.online";
const metaDescription =
  "消費税計算を税抜⇔税込の両方向で行える無料ツール。標準税率10％と軽減税率8％、任意の税率に対応し、消費税額と税込・税抜価格を自動計算。端数処理（切り捨て・四捨五入・切り上げ）も選べます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/consumption-tax-calculator",
  keywords: ["消費税 計算", "消費税", "税込", "税抜", "税額", "軽減税率", "端数処理", "インボイス"],
});

export default function ConsumptionTaxCalculatorPage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(ConsumptionTaxCalculatorFaq.items, "消費税 計算");
  return (
    <>
      <Script
        id="consumption-tax-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ConsumptionTaxCalculator />
    </>
  );
}
