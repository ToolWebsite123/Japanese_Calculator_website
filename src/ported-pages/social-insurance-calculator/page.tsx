import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { SocialInsuranceCalculator } from "@/components/calculators/SocialInsuranceCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "社会保険料計算機｜健康保険・厚生年金・雇用保険の本人負担｜電卓.online";
const metaDescription =
  "2026年度（令和8年度）の料率を使い、月給・年齢・都道府県から健康保険料・介護保険料・厚生年金保険料・雇用保険料の本人負担額を計算する無料ツール。標準報酬月額の等級・上限を反映し、会社負担分との内訳も表示します。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/social-insurance-calculator",
  keywords: ["社会保険料", "計算", "健康保険", "厚生年金", "給与計算"],
});

export default function SocialInsurancePage() {
  const faqJsonLd = buildCalculatorFaqJsonLd(
    ja.socialInsurancePage.faqItems,
    ja.socialInsurancePage.title,
  );

  return (
    <>
      <Script
        id="social-insurance-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SocialInsuranceCalculator />
    </>
  );
}
