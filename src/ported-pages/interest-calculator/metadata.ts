import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "金利・利息計算機｜単利と複利を比較・預金の利息も｜電卓.online";
const metaDescription =
  "同じ元本・金利・期間で、単利と複利の受取利息と元利合計がどれだけ違うかを並べて比較できる無料の金利計算機。期間は年・か月・日（日割り365日換算）で入力でき、源泉徴収税20.315%を差し引いた税引後の利息も表示します。定期預金の利息の目安に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/interest-calculator",
  keywords: ["利息計算", "単利計算", "単利複利比較", "単利", "複利比較"],
});
