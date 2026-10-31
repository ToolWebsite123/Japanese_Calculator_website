import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "わり算の筆算計算機｜途中式と余り・商を解説｜電卓.online";
const metaDescription =
  "割り算の筆算（長除算）を途中式つきで表示する無料計算機。割られる数と割る数を入力するだけで、商と余りを筆算の手順どおりに確認できます。小学生の宿題の答え合わせや、わり算のやり方の復習に役立ちます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/long-division-calculator",
  keywords: ["筆算電卓", "割り算の筆算", "商と余りの計算", "商", "余り"],
});
