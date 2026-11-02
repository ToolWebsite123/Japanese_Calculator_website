import { Link } from "@tanstack/react-router";

// Homepage worked examples (approved draft, HOMEPAGE-SEO-MASTER-REPORT
// §10). Every result was executed against this site's own calculator
// engine before being written here. Note: "3980 − 20%" evaluates to
// 3979.8 in standard mode, so the discount example deliberately uses
// the mathematically correct × 0.8 form and links the discount tool.

const EXAMPLE_ROWS: [string, string, React.ReactNode][] = [
  ["2 + 2 × 2 ＝", "6", "標準モードでは掛け算を先に計算します"],
  ["2 + 2 × 2 ＝（左から順にモード）", "8", "押した順に計算する方式では 2+2＝4、4×2＝8 となります"],
  ["10 − 4 ÷ 2 ＝", "8", "割り算を先に計算するため 4÷2＝2、10−2＝8 です"],
  ["1000 → 税込（10％）", "1,100円", "税込価格がそのまま表示されます"],
  ["1100 → 税抜（10％）", "1,000円", "税抜価格に戻せます"],
  ["529 → √", "23", "平方根は√キーを押すだけです"],
  ["500 × 25 ％", "125", "「500の25％」は％キーで計算できます"],
  [
    "3980 × 0.8 ＝",
    "3,184円",
    <>
      2割引後の価格の目安です（割引専用の計算は
      <Link
        to="/discount-calculation"
        className="font-medium text-brand underline-offset-2 hover:underline"
      >
        割引計算機
      </Link>
      が便利です）
    </>,
  ],
  ["15600 ÷ 4 ＝", "3,900円", "割り勘の1人分です"],
];

const tableHeadClass =
  "border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary";
const tableCellClass = "border border-border px-3 py-2 text-text-secondary";

export function HomeExamples() {
  return (
    <section
      aria-labelledby="home-examples-heading"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"
    >
      <h2
        id="home-examples-heading"
        className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        計算例
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr>
              <th scope="col" className={tableHeadClass}>
                入力
              </th>
              <th scope="col" className={tableHeadClass}>
                結果
              </th>
              <th scope="col" className={tableHeadClass}>
                ポイント
              </th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLE_ROWS.map((row) => (
              <tr key={row[0]}>
                <td className={`${tableCellClass} whitespace-nowrap font-medium text-text-primary`}>
                  {row[0]}
                </td>
                <td
                  className={`${tableCellClass} whitespace-nowrap font-semibold text-text-primary`}
                >
                  {row[1]}
                </td>
                <td className={tableCellClass}>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
