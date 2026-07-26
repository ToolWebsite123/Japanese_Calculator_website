import Script from "next/script";
import ja from "@/lib/i18n/ja";
import { buildCalculatorFaqJsonLd } from "@/lib/seo/calculator-jsonld";
import { SocialInsuranceCalculator } from "@/components/calculators/SocialInsuranceCalculator";
import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "社会保険料計算｜給与・年齢・都道府県から自動計算";
const metaDescription =
  "社会保険料計算を、月額給与・年齢・都道府県の情報から実行し、健康保険料・介護保険料・厚生年金保険料・雇用保険料の目安を即座に確認できるツールです。";

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
