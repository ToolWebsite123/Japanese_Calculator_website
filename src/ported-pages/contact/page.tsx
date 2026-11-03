import Script from "next/script";
import { buildLegalPageJsonLd } from "@/lib/seo/legal-jsonld";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

const LAST_UPDATED = "2026年11月3日";
const CONTACT_EMAIL = "japaneselanguagecalculator@gmail.com";

export default function ContactPage() {
  const jsonLd = buildLegalPageJsonLd({
    type: "ContactPage",
    name: "お問い合わせ｜電卓.Online",
    description:
      "電卓.Onlineへのご意見、ご質問、不具合報告のためのお問い合わせページです。メールで受け付けています。",
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
        description="電卓.オンラインへのご意見、ご質問、不具合報告などがありましたら、メールでご連絡ください。"
        lastUpdated={LAST_UPDATED}
      >
        <section>
          <p>
            使い勝手に関するご意見、表示や計算結果に関する気づき、不具合のご報告などを歓迎しています。いただいた内容は、今後の改善の参考として活用します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            メールでのお問い合わせ
          </h2>
          <p className="mt-3">
            お問い合わせは、以下のメールアドレスで受け付けています。
          </p>
          <p className="mt-3">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
          <p className="mt-3">
            件名に、対象の計算ツールの名前を書いていただけると、確認がスムーズです。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            不具合をご報告いただくときのお願い
          </h2>
          <p className="mt-3">
            不具合のご報告の際は、可能な範囲で以下の情報をあわせてお知らせください。
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>使用した計算ツールの名前、またはページのURL</li>
            <li>お使いの端末とブラウザ（例：iPhone・Safari、Windows・Chrome）</li>
            <li>行った操作と、表示された結果・期待した結果</li>
            <li>可能であれば、画面のスクリーンショット</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
            返信について
          </h2>
          <p className="mt-3">
            いただいたメールには順次目を通しますが、すべてのメールへの返信をお約束するものではなく、返信まで数日いただく場合や、内容によって返信できない場合があります。あらかじめご了承ください。
          </p>
        </section>
      </LegalPageLayout>
    </>
  );
}
