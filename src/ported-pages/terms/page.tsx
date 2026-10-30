import Script from "next/script";
import { buildLegalPageJsonLd } from "@/lib/seo/legal-jsonld";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { buildLegalMetadata } from "@/lib/seo/legal";

const LAST_UPDATED = "2026年7月8日";

export const metadata = buildLegalMetadata({
  title: "利用規約｜電卓.onlineのご利用条件と禁止事項",
  description:
    "電卓.onlineの計算ツールおよび関連コンテンツをご利用いただく際の条件を定めた利用規約です。禁止事項、知的財産権、免責と責任制限、準拠法など、ご利用前にご確認いただきたい内容をまとめています。",
  path: "/terms",
});

export default function TermsPage() {
  const jsonLd = buildLegalPageJsonLd({
    type: "WebPage",
    name: "利用規約｜電卓.Online",
    description:
      "電卓.Onlineの利用条件、禁止事項、知的財産権、免責、責任制限、準拠法について定めています。",
    path: "/terms",
  });

  return (
    <>
      <Script
        id="terms-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalPageLayout
        title="利用規約"
        description="この利用規約は、電卓.オンラインが提供する各種計算ツールおよび関連情報の利用条件を定めるものです。"
        lastUpdated={LAST_UPDATED}
      >
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            1. 適用
          </h2>
          <p className="mt-3">
            本規約は、電卓.オンラインが提供する無料の計算ツール、関連コンテンツ、その他付随機能の利用に関する条件を定めるものです。利用者は、本サイトを利用した時点で、本規約に同意したものとみなされます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            2. サービス内容
          </h2>
          <p className="mt-3">
            当サイトは、関数計算、分数計算、ルート計算、金融計算、BMI計算、単位変換など、各種の無料計算ツールを提供します。サービス内容は、運営上の必要に応じて、追加、変更、停止される場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            3. 禁止事項
          </h2>
          <p className="mt-3">利用者は、以下の行為を行ってはなりません。</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>法令または公序良俗に反する行為</li>
            <li>当サイトまたは第三者の権利・利益を侵害する行為</li>
            <li>
              当サイトの運営を妨害する行為、不正アクセス、過度な自動取得、スクレイピング、負荷を与える行為
            </li>
            <li>虚偽の情報を用いた問い合わせや、迷惑行為にあたる送信</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            4. 知的財産権
          </h2>
          <p className="mt-3">
            当サイトに掲載される文章、構成、デザイン、プログラム、ロゴその他一切のコンテンツに関する権利は、当サイト運営者または正当な権利者に帰属します。法令で認められる場合を除き、無断で複製、転載、改変、再配布することはできません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            5. 保証の否認
          </h2>
          <p className="mt-3">
            当サイトは、計算結果や掲載情報について、できる限り正確で有用な内容となるよう努めますが、その完全性、正確性、最新性、特定目的への適合性を保証するものではありません。計算結果の取り扱いに関する詳細な注意事項については、
            <Link href="/disclaimer">免責事項</Link>
            もあわせてご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            6. 責任の制限
          </h2>
          <p className="mt-3">
            当サイトの利用または利用不能、計算結果の使用、情報の誤り、サービス変更または中断等により利用者または第三者に生じた損害について、当サイト運営者は責任を負いません。ただし、適用法令により免責が認められない範囲がある場合は、その範囲に限り法令に従います。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            7. 準拠法および管轄
          </h2>
          <p className="mt-3">
            本規約の解釈および適用は、日本法に準拠します。また、本サイトに関して紛争が生じた場合は、日本の裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            8. 規約の変更
          </h2>
          <p className="mt-3">
            当サイトは、必要に応じて本規約を変更することがあります。変更後の規約は、当ページに掲載した時点または当サイト上で別途定めた時点から効力を生じます。重要な変更がある場合は、内容を更新し、最終更新日を表示します。
          </p>
        </section>
      </LegalPageLayout>
    </>
  );
}
