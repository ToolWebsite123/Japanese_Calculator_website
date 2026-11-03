// Homepage feature documentation (approved draft,
// HOMEPAGE-SEO-MASTER-REPORT §10): the calculator's four core
// behaviours — calculation order, memory + GT, history/copy, decimals.
// (Wording updated 2026-11-03 to match the fixed-behaviour calculator:
// standard order only, one memory cell, tax keys at 10%, auto decimals.)

const FEATURES: { title: string; text: string }[] = [
  {
    title: "計算順序（標準の順序で自動計算）",
    text: "数学の決まりどおり、掛け算・割り算を先に計算する標準の順序で式全体を自動計算します（2+2×2＝6）。モードの切り替えは不要です。先に計算したい部分がある場合は、括弧キーで囲むとその中を優先して計算できます（（2＋2）×2＝8）。",
  },
  {
    title: "メモリーとGT",
    text: "メモリーは1つで、M+／M−キーで表示中の値を加減算して保持し、MRキーで呼び出せます。買い物の途中で小計を保持する、といった使い方ができます。GTキーを押すと、それまでに「＝」で計算した結果の総計を確認できます。",
  },
  {
    title: "履歴とコピー",
    text: "「履歴」ボタンを押すと、過去の計算式と結果の一覧が表示されます。一覧の項目を選ぶと、その式と結果が電卓に戻るので、似た計算のやり直しや検算に便利です。履歴はお使いのブラウザの中にのみ保存されます。結果はコピーボタンでそのまま貼り付けられます。",
  },
  {
    title: "小数の自動表示",
    text: "結果の小数桁は自動で調整され、末尾の不要な0は表示されません。桁数の設定は不要で、割り算の結果なども読みやすい形で表示されます。",
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
          便利な機能
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
