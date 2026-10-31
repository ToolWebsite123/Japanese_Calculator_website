import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "消費税計算｜税込・税抜・税額を10%・8%で自動計算｜電卓.online";
const metaDescription =
  "税抜価格から税込価格、税込価格から税抜価格と消費税額を自動計算。10%と軽減税率8%に対応し、早見表と端数処理の解説も掲載。無料・登録不要。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/consumption-tax-calculator",
  keywords: ["消費税 計算", "消費税", "税込", "税抜", "税額", "軽減税率", "端数処理", "インボイス"],
});
