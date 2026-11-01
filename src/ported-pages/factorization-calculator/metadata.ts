import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "因数分解・素因数分解計算機｜たすき掛け・公式・約数まで途中式つき｜電卓.online";
const metaDescription =
  "x²+5x+6=(x+2)(x+3) のような式の因数分解（共通因数・公式・たすき掛け）と、整数の素因数分解に対応した無料計算機。割り算の手順や約数の一覧も表示し、途中式つきで確認できます。中学数学の学習や検算に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/factorization-calculator",
  keywords: ["因数分解", "素因数分解計算機", "素因数分解", "約数", "因数分解計算"],
});
