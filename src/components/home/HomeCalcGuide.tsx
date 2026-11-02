// Fresh guide for the homepage Web calculator (2026-11-02 rewrite).
// Every example below was checked against the site's own calculator
// engine: standard mode applies multiplication/division first
// (2+2×2=6), the tax-included key applies the selected rate
// (1,000 → 1,100 at 10%), √529 = 23, and 500×25% = 125.

const EXAMPLES: { title: string; keys: string; result: string; note: string }[] = [
  {
    title: "掛け算を先に計算",
    keys: "2 + 2 × 2 =",
    result: "6",
    note: "標準モードでは数学の順序どおり、掛け算・割り算を先に計算します。",
  },
  {
    title: "税込価格を出す",
    keys: "1000 → 税込",
    result: "1,100円",
    note: "税率10％の税込価格です。8％（軽減税率）にも切り替えられます。",
  },
  {
    title: "平方根を求める",
    keys: "529 → √",
    result: "23",
    note: "√キーを押すだけで平方根が表示されます。",
  },
  {
    title: "パーセントを計算",
    keys: "500 × 25 %",
    result: "125",
    note: "「500の25％」のような計算は、％キーがそのまま使えます。",
  },
];

const FEATURES: { title: string; text: string }[] = [
  {
    title: "税込・税抜キー",
    text: "金額を入れてキーを押すだけ。税率は10％と8％を切り替えられます。",
  },
  {
    title: "GT（グランドトータル）",
    text: "＝で計算した結果の合計を、GTキーでまとめて確認できます。",
  },
  {
    title: "メモリー M1〜M3",
    text: "3つのメモリーセルを切り替えて使えます。M+／M−で加減、MRで呼び出し、MCで消去します。",
  },
  {
    title: "履歴から再入力",
    text: "「履歴」から過去の計算を開き、項目を選ぶと式と結果がそのまま戻ります。",
  },
  {
    title: "計算順序の切り替え",
    text: "「標準」（掛け算を先に計算）と「左から順に」（押した順に計算）を選べます。",
  },
  {
    title: "小数桁の設定",
    text: "結果の小数桁は「自動」のほか、0〜6桁までの固定表示に切り替えられます。",
  },
];

const STEPS: { title: string; text: string }[] = [
  { title: "式を入力する", text: "画面のキーか、PCのキーボードから入力します。" },
  { title: "＝で計算する", text: "結果が大きく表示され、計算式も一緒に残ります。" },
  { title: "結果を使い回す", text: "コピー、履歴からの再入力、メモリー保存がそのままできます。" },
];

export function HomeCalcGuide() {
  return (
    <section
      aria-labelledby="home-guide-heading"
      className="border-y border-border bg-brand-muted/25"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <h2
          id="home-guide-heading"
          className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
        >
          このWeb電卓の使い方と機能
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
          ページ上部の電卓は、ただの四則演算だけではありません。税金計算や合計の確認、途中の値の保持まで、日常の計算でよく使う機能をひととおり備えています。
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-bold text-text-primary">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {index + 1}
                </span>
                {step.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{step.text}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-8 text-base font-bold text-text-primary">計算例</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((example) => (
            <div key={example.title} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-bold text-text-primary">{example.title}</p>
              <p className="mt-2 font-mono text-sm text-text-secondary">{example.keys}</p>
              <p className="mt-1 text-lg font-bold text-brand dark:text-[#d6ccf0]">
                → {example.result}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-text-tertiary">{example.note}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-base font-bold text-text-primary">主な機能</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-sm font-bold text-text-primary">{feature.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{feature.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-text-secondary">
          キーボードでも操作できます。Enterで「＝」、Backspaceで1文字削除、*で「×」、/で「÷」を入力できます。
        </p>
      </div>
    </section>
  );
}
