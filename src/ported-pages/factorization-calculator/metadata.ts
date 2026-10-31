import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "因数分解・素因数分解計算機｜約数一覧と手順つき｜電卓.online";
const metaDescription =
  "正の整数を素因数分解し、指数表記の結果と約数の一覧をまとめて表示する無料計算機。因数分解の手順確認や、最大公約数・最小公倍数を求める前のチェックにも役立ちます。中学・高校数学の学習や検算にご利用ください。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/factorization-calculator",
  keywords: ["因数分解", "素因数分解計算機", "素因数分解", "約数", "因数分解計算"],
});
