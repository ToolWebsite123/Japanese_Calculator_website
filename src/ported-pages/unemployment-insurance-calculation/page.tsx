import Script from "next/script";
import { FAQ as UnemploymentInsuranceCalculatorFaq } from "@/components/calculators/UnemploymentInsuranceCalculator";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { UnemploymentInsuranceCalculator } from "@/components/calculators/UnemploymentInsuranceCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "失業保険 計算｜6ヶ月給与・年齢・被保険者期間から自動算出";
const metaDescription =
  "失業保険 計算を、離職前6ヶ月の賃金合計・年齢・被保険者期間・離職理由から実行し、賃金日額・基本手当日額・所定給付日数・受給総額の目安を即座に確認できるツールです（令和7年8月1日改定対応）。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/unemployment-insurance-calculation",
  keywords: ["失業保険", "計算", "雇用保険", "基本手当", "所定給付日数", "受給総額"],
});

export default function UnemploymentInsurancePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    UnemploymentInsuranceCalculatorFaq.items,
    "失業保険 計算",
  );

  return (
    <>
      <Script
        id="unemployment-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <UnemploymentInsuranceCalculator />
    </>
  );
}
