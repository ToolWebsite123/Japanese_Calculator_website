import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "連立方程式計算機｜解き方のステップ（途中式）つき｜電卓.online";
const metaDescription =
  "2元1次連立方程式の係数を入力するだけで、xとyの解を求める無料の連立方程式計算機。クラメルの公式による計算ステップ（途中式）も表示するので、中学数学の宿題の答え合わせや解き方の確認に役立ちます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/simultaneous-equations-calculator",
  keywords: ["連立方程式", "連立方程式計算機", "連立方程式の解き方", "クラメーの公式", "2元1次"],
});
