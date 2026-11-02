// Homepage feature documentation (approved draft,
// HOMEPAGE-SEO-MASTER-REPORT §10): the four calculator settings —
// calculation order, memory + GT, history/copy, decimal places.

const FEATURES: { title: string; text: string }[] = [
  {
    title: "計算順序（標準／左から順に）",
    text: "標準モードでは、数学の決まりどおり掛け算・割り算を先に計算します（2+2×2＝6）。「左から順に」モードでは、押した順にひとつずつ計算します（2+2×2＝8）。レジや事務用の電卓の感覚で使いたいときは「左から順に」が向いています。設定は電卓の上部でいつでも切り替えられます。",
  },
  {
    title: "メモリー（M1〜M3）とGT",
    text: "メモリーは3つのセル（M1・M2・M3）を切り替えて使えます。買い物の途中で小計を保持する、複数の計算結果を別々に残す、といった使い分けができます。GTキーを押すと、それまでに「＝」で計算した結果の総計を確認できます。",
  },
  {
    title: "履歴とコピー",
    text: "「履歴」ボタンを押すと、過去の計算式と結果の一覧が表示されます。一覧の項目を選ぶと、その式と結果が電卓に戻るので、似た計算のやり直しや検算に便利です。履歴はお使いのブラウザの中にのみ保存されます。結果はコピーボタンでそのまま貼り付けられます。",
  },
  {
    title: "小数桁の設定",
    text: "結果の小数桁は「自動」のほか、0〜6桁までの固定表示に切り替えられます。金額の計算では0桁、割合の計算では2〜3桁など、用途に合わせて選んでください。",
  },
];

export function HomeFeatures() {
  return (
    <section
      aria-labelledby="home-features-heading"
      className="border-y border-border bg-brand-muted/25"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <h2
          id="home-features-heading"
          className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
        >
          便利な機能と設定
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <h3 className="text-base font-bold text-text-primary">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
