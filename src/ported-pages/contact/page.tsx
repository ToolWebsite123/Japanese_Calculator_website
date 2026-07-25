import Script from "next/script";
import { buildLegalPageJsonLd } from "@/lib/seo/legal-jsonld";
import { ContactForm } from "@/components/legal/ContactForm";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { buildLegalMetadata } from "@/lib/seo/legal";

export const metadata = buildLegalMetadata({
  title: "お問い合わせ | オンライン電卓",
  description:
    "オンライン電卓へのご意見、ご質問、不具合報告のためのお問い合わせページです。",
  path: "/contact",
});

export default function ContactPage() {
  const jsonLd = buildLegalPageJsonLd({
    type: "ContactPage",
    name: "お問い合わせ｜電卓.Online",
    description: "電卓.Onlineへのご意見、ご質問、不具合報告のためのお問い合わせページです。",
    path: "/contact",
  });

  return (
    <>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <LegalPageLayout
      title="お問い合わせ"
      description="電卓.オンラインへのご意見、ご質問、不具合報告などがありましたら、以下のフォームをご利用ください。"
    >
      <section>
        <p>
          使い勝手に関するご意見、表示や計算結果に関する気づき、不具合のご報告などを歓迎しています。いただいた内容は、今後の改善の参考として活用します。
        </p>
        <p className="mt-3">
          現在はお問い合わせフォームの見た目と入力体験を先に整えており、メール送信や外部サービスとの連携はまだ設定していません。送信基盤の接続後に、実際の受付機能を追加予定です。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          お問い合わせフォーム
        </h2>
        <div className="mt-4">
          <ContactForm />
        </div>
      </section>
    </LegalPageLayout>
    </>
  );
}
