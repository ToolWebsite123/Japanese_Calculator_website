import { LinkedText } from "@/components/calculator/LinkedText";

// Homepage intro (approved draft, HOMEPAGE-SEO-MASTER-REPORT §10).
// Calculator names in the copy become internal links via LinkedText.
export function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-heading"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"
    >
      <h2
        id="home-intro-heading"
        className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        Web電卓（オンライン電卓）とは
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        <p>
          <LinkedText text="電卓.onlineのWeb電卓は、ブラウザで開いてすぐ使える無料のオンライン電卓です。アプリのインストールや会員登録は必要ありません。買い物の合計、税込価格の確認、仕事の概算、学習の答え合わせまで、日常の計算をその場で済ませられます。" />
        </p>
        <p>
          <LinkedText text="ふつうの電卓としての四則演算に加えて、税込・税抜の計算、合計を保持するGT、メモリー、計算履歴など、実務で役立つ機能を備えています。計算は、割り算・掛け算を先に計算する標準の方式で自動的に行われます。目的に特化した計算をしたいときは、税金・健康・単位変換など全27種の専用計算機も同じサイト内で利用できます。" />
        </p>
      </div>
    </section>
  );
}
