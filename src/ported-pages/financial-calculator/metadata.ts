import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "ローン返済・TVM金融電卓｜返済額・現在価値・将来価値｜電卓.online";
const metaDescription =
  "PV（現在価値）・FV（将来価値）・PMT（支払額）・利率・期間のうち4つを入力し、残る1つを求めるTVM対応の無料金融電卓。ローンの毎月返済額の試算や、積立目標の到達期間・必要利率の逆算など、お金の時間価値の計算に使えます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/financial-calculator",
  keywords: ["金融計算", "金融電卓", "TVM", "時間価値", "現在価値", "将来価値"],
});
