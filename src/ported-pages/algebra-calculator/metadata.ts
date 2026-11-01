import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "文字式計算機｜式の展開・同類項・式の値・一次方程式を途中式つきで｜電卓.online";
const metaDescription =
  "文字式を整理・展開できる無料の文字式計算機。同類項をまとめる、(x+2)(x+3)の展開、分配法則に加え、式の値（代入）と一次方程式にも対応し、途中式をステップ表示します。中学数学の復習や宿題の答え合わせに。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/algebra-calculator",
  keywords: ["文字式計算機", "計算式", "文字式の計算方法", "一次方程式", "代数式", "文字式"],
});
