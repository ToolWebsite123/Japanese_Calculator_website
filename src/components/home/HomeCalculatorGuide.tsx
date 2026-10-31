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

const PURPOSE_ROWS: { purpose: string; label: string; href: string; canDo: string }[] = [
  { purpose: "税込・税抜と税額を知りたい", label: "消費税計算機", href: "/consumption-tax-calculator", canDo: "税率10%・8%の変換と税額の内訳" },
  { purpose: "年収から税金と手取りを知りたい", label: "所得税計算", href: "/income-tax-calculation", canDo: "所得税と手取りの目安" },
  { purpose: "積立・運用の増え方を知りたい", label: "複利計算機", href: "/compound-interest-calculator", canDo: "元本・金利・期間から将来価値" },
  { purpose: "割合や割引を計算したい", label: "パーセント計算機", href: "/percentage-calculator", canDo: "割合・増減率・割引後の価格" },
  { purpose: "三角関数や対数を計算したい", label: "関数電卓", href: "/scientific-calculator", canDo: "三角関数・対数・べき乗・階乗" },
  { purpose: "肥満度を確認したい", label: "BMI計算", href: "/bmi-calculator", canDo: "身長・体重からBMIと適正体重" },
];

const TAX_TABLE_HEAD = ["税抜価格", "税込（10%）", "税込（8%）"];
const TAX_TABLE_ROWS: string[][] = [
  ["1,000円", "1,100円", "1,080円"],
  ["3,000円", "3,300円", "3,240円"],
  ["5,000円", "5,500円", "5,400円"],
  ["10,000円", "11,000円", "10,800円"],
];

function GuideTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell) => (
                <td key={cell} className="border border-border px-3 py-2 text-text-secondary">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HomeCalculatorGuide() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        Web電卓の使い方と便利な機能
      </h2>
      <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base">
        このページのWeb電卓は、買い物の合計から消費税の計算まで、その場で済ませられる無料の電卓です。四則演算に加えて、税込・税抜ボタン、GT、メモリー機能など、実物の電卓でよく使う機能をそろえています。登録やインストールは不要で、スマホでもPCでも同じように使えます。
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

      <p className="mt-8 text-sm font-bold text-text-primary sm:text-base">税込・税抜 早見表</p>
      <GuideTable head={TAX_TABLE_HEAD} rows={TAX_TABLE_ROWS} />
      <p className="mt-2 text-xs leading-relaxed text-text-secondary sm:text-sm">
        端数は1円未満を四捨五入しています。税額の内訳まで確認したいときは
        <a href="/consumption-tax-calculator" className="font-bold text-brand underline decoration-brand/40 underline-offset-2">
          消費税計算機
        </a>
        をご利用ください。
      </p>

      <h3 className="mt-10 text-base font-bold text-text-primary sm:text-lg">目的に合った計算機の選び方</h3>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        計算の目的が決まっているときは、専用の計算機を使うほうが速くて正確です。代表的な用途ごとに、おすすめの計算機をまとめました。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr>
              <th scope="col" className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary">
                目的
              </th>
              <th scope="col" className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary">
                おすすめの計算機
              </th>
              <th scope="col" className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary">
                できること
              </th>
            </tr>
          </thead>
          <tbody>
            {PURPOSE_ROWS.map((row) => (
              <tr key={row.href}>
                <td className="border border-border px-3 py-2 text-text-secondary">{row.purpose}</td>
                <td className="border border-border px-3 py-2">
                  <a href={row.href} className="font-bold text-brand underline decoration-brand/40 underline-offset-2">
                    {row.label}
                  </a>
                </td>
                <td className="border border-border px-3 py-2 text-text-secondary">{row.canDo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
