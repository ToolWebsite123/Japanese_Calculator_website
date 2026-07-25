import type { ButtonGuideRow } from "./types";

export const ROOT_BUTTON_GUIDE: ButtonGuideRow[] = [
  { button: "平方根", description: "2乗根（√）の計算モードに切り替えます。" },
  { button: "n乗根", description: "任意の次数のルート計算モードに切り替えます。" },
  { button: "被開方数", description: "ルートの中に入る数を入力します。" },
  { button: "次数（n）", description: "n乗根モード時の次数を入力します。" },
  { button: "√2", description: "被開方数2・次数2のプリセットをセットします。" },
  { button: "√3", description: "被開方数3・次数2のプリセットをセットします。" },
  { button: "√5", description: "被開方数5・次数2のプリセットをセットします。" },
  { button: "√π", description: "被開方数π・次数2のプリセットをセットします。" },
  { button: "計算する", description: "ルート計算を実行し、正確な値と近似値を表示します。" },
];
