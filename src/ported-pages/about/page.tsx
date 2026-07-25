import Script from "next/script";
import { buildLegalPageJsonLd } from "@/lib/seo/legal-jsonld";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { buildLegalMetadata } from "@/lib/seo/legal";

export const metadata = buildLegalMetadata({
  title: "このサイトについて | オンライン電卓",
  description:
    "オンライン電卓の無料ブラウザ電卓・計算機サービスの概要、特徴、運営方針をご案内します。",
  path: "/about",
});

export default function AboutPage() {
  const jsonLd = buildLegalPageJsonLd({
    type: "WebPage",
    name: "このサイトについて｜電卓.Online",
    description: "電卓.Onlineの無料ブラウザ電卓・計算機サービスの概要、特徴、運営方針をご案内します。",
    path: "/about",
  });

  return (
    <>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <LegalPageLayout
      title="このサイトについて"
      description="電卓.オンラインで提供している各種計算ツールの特徴と、サイト運営に関する基本方針をご案内します。"
    >
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          電卓.オンラインとは
        </h2>
        <p className="mt-3">
          電卓.オンラインは、無料で使えるブラウザベースの計算ツールをまとめた日本語サイトです。基本的な四則演算に使える電卓をはじめ、関数電卓、分数電卓、ルート計算機、文字式計算機、金融電卓、複利計算、BMI計算、単位変換など、日常生活から学習、仕事の試算まで幅広く使える計算機を一つのサイト内で利用できます。アプリのインストールや会員登録は不要で、ページを開いてすぐに使い始められることを重視しています。
        </p>
        <p className="mt-3">
          このサイトの目的は、必要な計算をできるだけ手軽に、分かりやすく、そして安心して行える環境を提供することです。複雑な式を毎回手入力したり、用途ごとに別々のサービスを探したりしなくても、目的に合った計算機へすぐアクセスできる構成を目指しています。スマートフォン、タブレット、PCのいずれでも利用しやすいよう、画面サイズに応じた使いやすさにも配慮しています。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          大切にしていること
        </h2>
        <p className="mt-3">
          電卓.オンラインでは、正確性と使いやすさに加えて、プライバシーへの配慮を大切にしています。多くの計算はブラウザ内で完結する仕組みになっており、入力した数値や式をサーバーへ送信しない設計を基本としています。履歴機能がある場合も、保存先はお使いのブラウザ内に限られます。そのため、登録不要で気軽に使えるだけでなく、個人の計算内容をできるだけ手元で扱える点もこのサイトの特徴です。
        </p>
        <p className="mt-3">
          また、すべてのツールを無料で利用できることも重要な方針の一つです。学習中の確認、買い物や家計の計算、仕事での概算、健康管理の目安など、必要なときにすぐ使える実用的な計算サイトであることを目指しています。
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
          計算ロジックと運営方針
        </h2>
        <p className="mt-3">
          各計算機は、それぞれの目的に応じた一般的な計算式、定義、考え方をもとに実装しています。関数計算、分数処理、ルート計算、金融関連の試算などは、用途ごとに必要なロジックを分けて構成し、実際の利用シーンで使いやすい入力方法や表示方法になるよう調整しています。重要な判断に使う前提の専門システムではありませんが、日常的な確認や比較、学習時の補助として役立つ品質を保てるよう努めています。
        </p>
        <p className="mt-3">
          そのため、公開して終わりではなく、動作確認、表示の見直し、改善を継続しながら運営しています。結果の見やすさ、入力しやすさ、計算の安定性を少しずつ整え、使いやすい無料ツール集として長く利用していただけるよう改善を続けていきます。
        </p>
      </section>
    </LegalPageLayout>
    </>
  );
}
