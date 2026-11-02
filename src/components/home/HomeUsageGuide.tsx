// Homepage usage guide (approved draft, HOMEPAGE-SEO-MASTER-REPORT §10):
// 3 steps, the buttons/functions table and the keyboard table. The
// keyboard rows were read from the calculator's actual key handler,
// and the % / √ examples were executed against its engine.

const STEPS: { title: string; text: string }[] = [
  {
    title: "式を入力する",
    text: "画面のキー、またはPCのキーボードから数字と演算子を入力します。",
  },
  {
    title: "「＝」で計算する",
    text: "結果が大きく表示され、入力した式も一緒に残るので、計算の過程を確認できます。",
  },
  {
    title: "結果を使い回す",
    text: "コピーして貼り付ける、履歴から呼び戻す、メモリーに保存する、といった使い回しがそのままできます。",
  },
];

const BUTTON_ROWS: [string, string][] = [
  ["0〜9 ・ .", "数字と小数点の入力"],
  ["＋ − × ÷", "四則演算"],
  ["＝", "式全体を計算して結果を表示"],
  ["AC", "入力中の式と結果をすべて消去"],
  ["⌫", "最後の1文字を削除"],
  ["±", "値の符号（プラス／マイナス）を切り替え"],
  ["（ ）", "計算の優先順位を括弧で指定"],
  ["％", "パーセント計算（例：500 × 25％ ＝ 125）"],
  ["√", "平方根（例：529 → √ ＝ 23）"],
  ["税込・税抜", "税率10％／軽減税率8％で税込・税抜価格に変換"],
  ["GT", "＝で計算した結果の総計を表示"],
  ["MC・MR・M+・M−", "メモリーの消去・呼び出し・加算・減算（M1〜M3の3セル切替）"],
  ["履歴", "過去の計算の一覧。選ぶと式と結果がそのまま戻る"],
  ["コピー", "表示中の結果をクリップボードにコピー"],
];

const KEYBOARD_ROWS: [string, string][] = [
  ["0〜9", "数字の入力"],
  [".", "小数点"],
  ["+ ／ −", "足し算／引き算"],
  ["* または x", "掛け算（×）"],
  ["/", "割り算（÷）"],
  ["Enter または =", "計算（＝）"],
  ["Backspace", "最後の1文字を削除"],
  ["Escape", "すべて消去（AC）"],
];

const tableHeadClass =
  "border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary";
const tableCellClass = "border border-border px-3 py-2 text-text-secondary";

export function HomeUsageGuide() {
  return (
    <section
      aria-labelledby="home-usage-heading"
      className="border-y border-border bg-brand-muted/25"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <h2
          id="home-usage-heading"
          className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
        >
          Web電卓の使い方
        </h2>

        <h3 className="mt-6 text-base font-bold text-text-primary">基本の操作（3ステップ）</h3>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
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

        <h3 className="mt-8 text-base font-bold text-text-primary">ボタンと機能</h3>
        <div className="mt-3 max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr>
                  <th scope="col" className={tableHeadClass}>
                    ボタン・機能
                  </th>
                  <th scope="col" className={tableHeadClass}>
                    役割
                  </th>
                </tr>
              </thead>
              <tbody>
                {BUTTON_ROWS.map((row) => (
                  <tr key={row[0]}>
                    <td
                      className={`${tableCellClass} whitespace-nowrap font-medium text-text-primary`}
                    >
                      {row[0]}
                    </td>
                    <td className={tableCellClass}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="mt-8 text-base font-bold text-text-primary">キーボードでの操作</h3>
        <div className="mt-3 max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr>
                  <th scope="col" className={tableHeadClass}>
                    キー
                  </th>
                  <th scope="col" className={tableHeadClass}>
                    動作
                  </th>
                </tr>
              </thead>
              <tbody>
                {KEYBOARD_ROWS.map((row) => (
                  <tr key={row[0]}>
                    <td
                      className={`${tableCellClass} whitespace-nowrap font-medium text-text-primary`}
                    >
                      {row[0]}
                    </td>
                    <td className={tableCellClass}>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
