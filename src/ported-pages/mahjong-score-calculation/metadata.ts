import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "麻雀の点数計算｜符と翻から点数を自動計算・早見表つき｜電卓.online";
const metaDescription =
  "親・子、ロン・ツモ、符と翻数を選ぶだけで麻雀の点数を自動計算。点数早見表と符計算の基本も掲載。初心者の方の点数確認に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/mahjong-score-calculation",
  keywords: ["麻雀 点数 計算", "麻雀", "点数計算", "翻", "符", "満貫", "跳満", "倍満", "役満"],
});
