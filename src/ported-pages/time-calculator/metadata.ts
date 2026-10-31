import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "時間計算機｜足し算・引き算・経過時間と何時間後の時刻まで計算｜電卓.online";
const metaDescription =
  "時・分・秒の足し算・引き算に加え、開始時刻から終了時刻までの経過時間（休憩の差し引きつき）や「何時間後」の時刻まで計算できる無料の時間計算機。結果は小数（10進数）でも表示し、勤務時間の集計や給与計算にも便利です。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/time-calculator",
  keywords: ["時間計算", "時間計算機", "時分秒", "勤務時間", "時間の足し算"],
});
