import type { ButtonGuideRow } from "./types";

export const FRACTION_BUTTON_GUIDE: ButtonGuideRow[] = [
  { button: "整数部", description: "帯分数の整数部分を入力します。" },
  { button: "分子", description: "分数の分子（上の数）を入力します。" },
  { button: "分母", description: "分数の分母（下の数）を入力します。0は入力できません。" },
  { button: "+", description: "2つの分数を足し算します。" },
  { button: "−", description: "2つの分数を引き算します。" },
  { button: "×", description: "2つの分数を掛け算します。" },
  { button: "÷", description: "2つの分数を割り算します。" },
  { button: "クリア", description: "入力欄と計算結果をリセットします。" },
  { button: "計算する", description: "分数の計算を実行し、答えと計算過程を表示します。" },
];
