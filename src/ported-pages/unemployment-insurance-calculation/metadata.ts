import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "失業保険（雇用保険）受給額シミュレーション｜給付日数・月額｜電卓.online";
const metaDescription =
  "令和8年8月1日改定の基準で、離職前6ヶ月の賃金・年齢・被保険者期間・離職理由から失業保険（雇用保険の基本手当）の賃金日額・基本手当日額・所定給付日数・受給総額の目安を計算する無料シミュレーションです。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/unemployment-insurance-calculation",
  keywords: ["失業保険", "計算", "雇用保険", "基本手当", "所定給付日数", "受給総額"],
});
