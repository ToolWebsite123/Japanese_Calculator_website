import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "出産予定日計算｜最終月経・排卵日・体外受精から妊娠週数も表示｜電卓.online";
const metaDescription =
  "最終月経日・排卵日・体外受精（胚移植日）などから出産予定日を計算する無料ツール。生理周期の調整にも対応し、現在の妊娠週数や予定日までの日数、主なイベントの日付、妊娠初期・中期・後期の開始日、正期産の期間までカレンダー形式で表示します。結果は目安としてご利用ください。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/due-date-calculation",
  keywords: [
    "出産予定日 計算",
    "出産予定日",
    "妊娠週数",
    "LMP",
    "排卵日",
    "生理周期",
    "正期産",
    "逆算",
  ],
});
