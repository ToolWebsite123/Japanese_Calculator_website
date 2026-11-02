import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "パーセント計算｜割合・何%・増減率・逆算をすぐ計算｜電卓.online";
const metaDescription =
  "パーセント計算をまとめて自動計算。「○の○%はいくつ」「○は○の何%」の割合から、増減率、全体の逆算まで対応。公式一覧と早見表、歩合（割・分・厘）の換算表つき。無料・登録不要。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/percentage-calculator",
  keywords: ["パーセント計算", "割合計算", "増減率", "比率", "パーセント"],
});
