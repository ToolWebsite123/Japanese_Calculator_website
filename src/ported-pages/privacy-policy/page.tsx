import Script from "next/script";
import { buildLegalPageJsonLd } from "@/lib/seo/legal-jsonld";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { buildLegalMetadata } from "@/lib/seo/legal";

const LAST_UPDATED = "2026年7月8日";

export const metadata = buildLegalMetadata({
  title: "プライバシーポリシー | オンライン電卓",
  description:
    "オンライン電卓における個人情報の取り扱い、ブラウザ内処理、ローカル保存、利用者の権利をご案内します。",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const jsonLd = buildLegalPageJsonLd({
    type: "WebPage",
    name: "プライバシーポリシー｜電卓.Online",
    description: "電卓.Onlineにおける個人情報の取り扱い、ブラウザ内処理、ローカル保存、利用者の権利をご案内します。",
    path: "/privacy-policy",
  });

  return (
    <>
      <Script
        id="privacy-policy-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <LegalPageLayout
      title="プライバシーポリシー"
      description="電卓.オンラインでは、入力内容をできるだけ利用者の端末内で処理することを基本方針としています。ここでは、情報の取り扱いについてご説明します。"
      lastUpdated={LAST_UPDATED}
    >
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          1. 基本方針
        </h2>
        <p className="mt-3">
          電卓.オンラインは、利用者のプライバシーを尊重し、必要以上の情報を収集しない方針で運営しています。多くの計算ツールはブラウザ内で動作しており、入力した数値、式、条件などの計算データをサーバーへ送信しない設計を基本としています。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          2. 取得する情報と取得しない情報
        </h2>
        <p className="mt-3">
          当サイトでは、通常の計算利用において、氏名、住所、電話番号、計算内容そのものなどの個人情報を積極的に取得する仕組みは設けていません。計算に入力した数値や式は、原則としてご利用中のブラウザ内で処理されます。
        </p>
        <p className="mt-3">
          一部の機能では、利便性向上のために履歴や設定をブラウザのローカルストレージへ保存する場合があります。この保存先は利用者ご自身の端末内であり、当サイト運営者が外部からその内容を直接取得するものではありません。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          3. Cookie、アクセス解析、第三者サービス
        </h2>
        <p className="mt-3">
          現在、電卓.オンラインでは、利用者行動を追跡するためのアクセス解析ツールや広告配信サービスは導入していません。また、第三者の広告ネットワーク、外部解析サービス、その他の第三者サービスに計算データを送信する運用も行っていません。
        </p>
        <p className="mt-3">
          なお、今後サービス改善や運営上の都合により外部サービスを導入する場合は、その内容と影響を確認のうえ、本ポリシーに反映します。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          4. 利用者の権利
        </h2>
        <p className="mt-3">
          利用者は、ご自身の端末内に保存された履歴や設定を、ブラウザの機能を通じて削除できます。また、当サイトの情報の取り扱いについて疑問や懸念がある場合は、運営者へお問い合わせいただけます。当サイトに個別の会員アカウント機能やサーバー保存型の個人データ管理機能はないため、一般的な会員サービスのようなアカウント単位での照会・訂正機能は提供していません。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          5. お問い合わせ
        </h2>
        <p className="mt-3">
          プライバシーに関するご質問、ご意見、ご不明点がある場合は、
          <Link href="/contact">
            お問い合わせページ
          </Link>
          よりご連絡ください。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          6. 改定について
        </h2>
        <p className="mt-3">
          本ポリシーは、法令の改正、機能追加、運営方針の変更などに応じて見直すことがあります。重要な変更がある場合は、当ページの内容を更新し、最終更新日を明示します。
        </p>
      </section>
    </LegalPageLayout>
    </>
  );
}
