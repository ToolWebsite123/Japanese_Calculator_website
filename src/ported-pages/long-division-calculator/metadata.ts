import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "割り算の筆算計算機｜途中式・あまり・小数・循環小数を表示｜電卓.online";
const metaDescription =
  "割り算の筆算（長除算）を途中式つきで表示する無料計算機。商と余り、小数（循環小数）への変換、検算まで桁ごとに確認できます。小数の割り算にも対応。宿題の答え合わせや筆算のやり方の復習に役立ちます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/long-division-calculator",
  keywords: ["筆算電卓", "割り算の筆算", "商と余りの計算", "商", "余り"],
});
