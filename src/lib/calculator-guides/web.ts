import type { ButtonGuideRow } from "./types";

export const WEB_BUTTON_GUIDE: ButtonGuideRow[] = [
  { button: "MC", description: "メモリをクリアします。" },
  { button: "MR", description: "メモリに保存した値を呼び出します。" },
  { button: "M+", description: "表示中の数値をメモリに加算します。" },
  { button: "M−", description: "表示中の数値をメモリから減算します。" },
  {
    button: "税込",
    description: "表示中の金額を、選択中の税率（10%/8%）で税込価格に変換します（例：1,000 → 1,100）。",
  },
  {
    button: "税抜",
    description: "表示中の金額を、選択中の税率（10%/8%）で税抜価格に戻します（例：1,100 → 1,000）。",
  },
  {
    button: "GT",
    description: "それまでに「=」で出した結果の合計（グランドトータル）を表示します。ACで0に戻ります。",
  },
  { button: "√", description: "表示中の数値の平方根を求めます（例：√144 = 12）。" },
  { button: "AC", description: "表示と式をすべてクリアし、GTも0に戻します（メモリは消えません）。" },
  { button: "⌫", description: "最後の1桁を削除します。" },
  { button: "%", description: "表示中の数を100で割ります（例：50 → 0.5）。" },
  { button: "÷ × − +", description: "四則演算の演算子です。式は演算子の優先順位に従って計算されます。" },
  { button: "( )", description: "計算の順序を指定します。括弧の中が先に計算されます。" },
  { button: "±", description: "表示中の数値の符号（プラスとマイナス）を反転します。" },
  { button: "0〜9", description: "数字を入力します。" },
  { button: "00", description: "0を2つまとめて入力します。大きな金額の入力に便利です。" },
  { button: ".", description: "小数点を入力します。" },
  { button: "=", description: "式を計算して結果を表示します。結果はGTと計算履歴にも記録されます。" },
];
