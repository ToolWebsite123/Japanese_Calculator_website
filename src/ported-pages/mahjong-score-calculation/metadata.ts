import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "麻雀の点数計算｜符と翻から点数を自動計算・早見表つき｜電卓.online";
const metaDescription =
  "麻雀の点数計算を、親・子、ロン・ツモ、符と翻数を選ぶだけで自動計算。満貫・跳満・倍満・役満の判定、点数早見表、符計算の基本まで掲載。初心者の点数確認や対局中のチェックに。無料・登録不要。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/mahjong-score-calculation",
  keywords: ["麻雀 点数 計算", "麻雀", "点数計算", "翻", "符", "満貫", "跳満", "倍満", "役満"],
});
