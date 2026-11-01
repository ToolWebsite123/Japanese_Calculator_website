import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "金融電卓｜ローン返済シミュレーションとPV・FV・PMT計算｜電卓.online";
const metaDescription =
  "ローン返済シミュレーション（元利均等・元金均等、返済予定表つき）と、PV・FV・PMT・利率・期間を解くTVM金融計算が使える無料の金融電卓。毎月返済額・総利息の試算や、積立目標の到達期間・必要利率の逆算に。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/financial-calculator",
  keywords: ["金融計算", "金融電卓", "TVM", "時間価値", "現在価値", "将来価値"],
});
