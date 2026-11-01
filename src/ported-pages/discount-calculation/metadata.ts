import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "割引計算｜％オフ・割・元値の逆算・重ねがけまで計算｜電卓.online";
const metaDescription =
  "％オフや「○割引」から割引後の価格を求める無料の割引計算。「さらに○%オフ」の重ねがけ、セール価格から元値を求める逆算、割引率の計算にも対応。消費税8％／10％の税込・税抜と端数処理も選べます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/discount-calculation",
  keywords: ["割引 計算", "割引", "パーセント", "割", "逆算", "消費税", "セール価格"],
});
