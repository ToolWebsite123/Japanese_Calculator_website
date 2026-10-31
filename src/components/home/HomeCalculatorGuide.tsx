"use client";

/**
 * Homepage guide section (homepage content step, 2026-10-31): how to use
 * the Web calculator, its features, worked examples, and how to choose
 * the right calculator. Original copy written for this site; every
 * example was checked against the site's own calculator behaviour.
 * The guide lives ONLY here — the /web-calculator page keeps its own
 * separate usage text (no duplication).
 */

const FEATURES: { title: string; text: string }[] = [
  {
    title: "税込・税抜ボタン",
    text: "金額を入力して「税込」を押すだけで、消費税込みの価格に変換できます。税率は10%と軽減税率8%を切り替えられ、「税抜」で税抜き価格に戻すこともできます。",
  },
  {
    title: "GT（グランドトータル）",
    text: "「＝」で計算するたびに結果が自動で合計されます。「GT」を押すと、それまでの計算結果の総計をいつでも呼び出せます（ACでリセット）。",
  },
  {
    title: "メモリー機能（M+ / M− / MR / MC）",
    text: "M+で表示中の数値をメモリーに加算、MRで呼び出し、MCで消去します。買い物の合計など、複数の計算をまとめるときに便利です。",
  },
  {
    title: "√（平方根）と00キー",
    text: "数値を入力して「√」を押すと平方根が表示されます。「00」キーを押せば0を2つまとめて入力でき、大きな金額の入力が速くなります。",
  },
  {
    title: "計算履歴",
    text: "計算した式と結果は履歴に残ります。履歴をタップすると、その計算をそのまま再利用できます。",
  },
  {
    title: "キーボード対応",
    text: "PCではキーボードの数字キーやテンキーから直接入力できます。Enterで計算、Escでリセット、Backspaceで1文字消去します。",
  },
];

const EXAMPLES: { title: string; steps: string; result: string }[] = [
  {
    title: "買い物の合計（メモリー活用）",
    steps: "280 × 3 ＝ → M+ ／ 198 × 2 ＝ → M+ ／ MR",
    result: "合計 1,236円（840円＋396円）",
  },
  {
    title: "消費税込みの価格（税込ボタン）",
    steps: "2,480 を入力 → 「税込」（税率10%）",
    result: "2,728円（うち消費税 248円）",
  },
  {
    title: "割り勘の計算",
    steps: "15,600 ÷ 4 ＝",
    result: "1人あたり 3,900円",
  },
];

const CHOICES: { label: string; href: string; text: string }[] = [
  { label: "消費税計算機", href: "/consumption-tax-calculator", text: "税込・税抜と税額の内訳を詳しく計算したいとき" },
  { label: "所得税計算", href: "/income-tax-calculation", text: "年収から所得税と手取りの目安を知りたいとき" },
  { label: "複利計算機", href: "/compound-interest-calculator", text: "積立や運用でお金がどう増えるか試算したいとき" },
  { label: "関数電卓", href: "/scientific-calculator", text: "三角関数・対数・べき乗など学習や仕事の数学に" },
  { label: "パーセント計算機", href: "/percent-calculator", text: "割合・増減率・割引後の価格を計算したいとき" },
  { label: "BMI計算", href: "/bmi-calculator", text: "身長と体重から肥満度と適正体重を確認したいとき" },
];

export function HomeCalculatorGuide() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        Web電卓の使い方と便利な機能
      </h2>
      <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
        当サイトのWeb電卓は、買い物の合計から税金の計算まで、日常の計算をその場で済ませられる無料の電卓です。アプリのインストールや登録は不要で、スマホでもPCでも同じように使えます。基本の四則演算に加えて、税込・税抜ボタンやメモリー機能など、実物の電卓でよく使う機能をそろえています。
      </p>
      <a
        href="/web-calculator"
        className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white"
      >
        Web電卓を開く
      </a>

      <h3 className="mt-10 text-base font-bold text-text-primary sm:text-lg">基本の使い方</h3>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
        <li>数字ボタン（またはキーボード）で数値を入力します。</li>
        <li>＋・−・×・÷ の演算子を押します。</li>
        <li>次の数値を入力し、「＝」を押すと結果が表示されます。</li>
        <li>計算をやり直すときは「AC」、直前の入力を消すときは「⌫」を押します。</li>
      </ol>

      <h3 className="mt-10 text-base font-bold text-text-primary sm:text-lg">便利な機能</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-bold text-text-primary">{feature.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{feature.text}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-base font-bold text-text-primary sm:text-lg">計算の例</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {EXAMPLES.map((example) => (
          <div key={example.title} className="rounded-xl border border-border bg-surface-sunken/50 p-4">
            <p className="text-sm font-bold text-text-primary">{example.title}</p>
            <p className="mt-2 text-sm text-text-secondary">{example.steps}</p>
            <p className="mt-2 text-sm font-bold text-brand">→ {example.result}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-base font-bold text-text-primary sm:text-lg">目的に合った計算機の選び方</h3>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        計算の目的が決まっているときは、専用の計算機を使うほうが速くて正確です。代表的な用途ごとに、おすすめの計算機をまとめました。
      </p>
      <ul className="mt-4 space-y-2">
        {CHOICES.map((choice) => (
          <li key={choice.href} className="text-sm leading-relaxed text-text-secondary sm:text-base">
            <a href={choice.href} className="font-bold text-brand underline decoration-brand/40 underline-offset-2">
              {choice.label}
            </a>
            <span> — {choice.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
