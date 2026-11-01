import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "連立方程式計算機｜加減法の途中式・分数の答え・3元にも対応｜電卓.online";
const metaDescription =
  "2元・3元1次連立方程式を解く無料の連立方程式計算機。加減法の途中式を表示し、答えは分数で正確に表示します。解なし・解が無数の場合も正しく判定。中学数学の宿題の答え合わせや解き方の確認に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/simultaneous-equations-calculator",
  keywords: ["連立方程式", "連立方程式計算機", "連立方程式の解き方", "クラメーの公式", "2元1次"],
});
