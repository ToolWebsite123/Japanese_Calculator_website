import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "グラフ計算機｜関数のグラフをオンラインで描画｜電卓.online";
const metaDescription =
  "関数の式を入力するだけでグラフを描ける無料のグラフ計算機。x^2やsin(x)、2^x、1/xなどのグラフを拡大・縮小しながら確認でき、xに対するyの値の表も表示します。数学の学習に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/graph-calculator",
  keywords: ["グラフ計算機", "関数 グラフ", "グラフ 描画", "二次関数 グラフ"],
});
