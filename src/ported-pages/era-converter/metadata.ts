import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "和暦・西暦変換ツール｜令和・平成・昭和・大正・明治対応｜電卓.online";
const metaDescription =
  "令和・平成・昭和・大正・明治の和暦と西暦を相互に変換できる無料ツール。生まれた年や書類の日付の確認など、「あの年は西暦何年？」を入力するだけですぐに変換できます。履歴書や公的書類の日付記入にも役立ちます。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/era-converter",
  keywords: ["和暦西暦変換", "和暦計算", "元号", "令和", "平成", "昭和"],
});
