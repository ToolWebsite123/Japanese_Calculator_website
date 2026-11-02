import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "利息計算機｜預金の利息・税引後・日割り計算｜電卓.online";
const metaDescription =
  "預金の利息計算に。同じ元本・金利・期間で単利と複利の受取利息を並べて比較でき、期間は年・か月・日（日割り365日換算）で入力可能。源泉徴収税20.315%を差し引いた税引後の利息も表示します。定期預金の利息の目安に。無料・登録不要。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/interest-calculator",
  keywords: ["利息計算", "単利計算", "単利複利比較", "単利", "複利比較"],
});
