import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "消費税計算｜税込・税抜・税額を10%・8%で自動計算｜電卓.online";
const metaDescription =
  "消費税の税込・税抜計算を、10%と軽減税率8%で自動計算。税額の内訳や端数処理（切り捨て・切り上げ・四捨五入）、早見表、インボイス制度の注意点も掲載。無料・登録不要。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/consumption-tax-calculator",
  keywords: ["消費税 計算", "消費税", "税込", "税抜", "税額", "軽減税率", "端数処理", "インボイス"],
});
