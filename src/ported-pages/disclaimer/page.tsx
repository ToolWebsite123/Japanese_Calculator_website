import Script from "next/script";
import { buildLegalPageJsonLd } from "@/lib/seo/legal-jsonld";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { buildLegalMetadata } from "@/lib/seo/legal";

export const metadata = buildLegalMetadata({
  title: "免責事項 | オンライン電卓",
  description:
    "オンライン電卓の計算結果の取り扱い、医療・金融分野に関する注意点、責任範囲をご案内します。",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  const jsonLd = buildLegalPageJsonLd({
    type: "WebPage",
    name: "免責事項｜電卓.Online",
    description: "電卓.Onlineの計算結果の取り扱い、医療・金融分野に関する注意点、責任範囲をご案内します。",
    path: "/disclaimer",
  });

  return (
    <>
      <Script
        id="disclaimer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <LegalPageLayout
      title="免責事項"
      description="電卓.オンラインで提供する各種計算ツールのご利用にあたって、計算結果の位置づけと責任範囲についてご案内します。"
    >
      <section>
        <p>
          電卓.オンラインで提供している各種計算ツールおよび表示結果は、一般的な参考情報としてご利用いただくためのものです。日常的な計算、学習、概算の比較、条件の整理などに役立つよう設計していますが、特定の契約、申告、診断、審査、投資判断などを直接確定する目的のものではありません。実際の手続きや重要な意思決定に利用する場合は、必ず公式資料、契約書、または専門家による確認をあわせて行ってください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          医療・健康に関する注意
        </h2>
        <p className="mt-3">
          BMI計算機など健康関連のツールは、体格の目安を簡易的に確認するための参考値を示すものです。これらの結果は医師による診断、治療方針、健康状態の評価に代わるものではありません。体調や健康について不安がある場合、または継続的な管理が必要な場合は、必ず医療機関や医療専門職へご相談ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          金融・税務に関する注意
        </h2>
        <p className="mt-3">
          金融電卓、ローン計算、利息計算、複利計算、税額関連の計算結果は、入力条件にもとづく概算または試算です。実際の返済額、適用金利、手数料、税額、契約条件などは、金融機関や公的機関、商品内容、時点ごとの制度変更によって異なる場合があります。投資、借入、返済計画、申告などの重要な判断を行う際は、必ず金融機関の正式資料、契約書面、税務資料、または専門家の助言をご確認ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          正確性と責任範囲
        </h2>
        <p className="mt-3">
          電卓.オンラインでは、一般的な計算式にもとづく実装と定期的な動作確認を通じて、できる限り正確で使いやすいサービスの提供に努めています。しかし、入力ミス、制度変更、端末環境の違い、想定外の利用方法などにより、結果が常に完全無欠であることを保証するものではありません。当サイトの計算結果や掲載情報を利用したこと、または利用できなかったことによって生じたいかなる損害についても、当サイトは責任を負いかねます。あらかじめご了承のうえ、ご自身の判断と責任においてご利用ください。
        </p>
      </section>
    </LegalPageLayout>
    </>
  );
}
