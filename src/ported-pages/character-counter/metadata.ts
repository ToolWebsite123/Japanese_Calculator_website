import { buildPageMetadata } from "@/lib/seo/metadata";

const metaTitle = "文字数計算機｜文字数・単語数・読了時間をリアルタイム集計｜電卓.online";
const metaDescription =
  "入力と同時に文字数（スペースを除く数も表示）・単語数・文章数・段落数・行数・読了時間を自動集計する無料の文字数計算機。ひらがな・カタカナ・漢字の内訳表示、結果のコピー、文字数制限の目安表つき。原稿・レポート・SNS投稿の文字数確認に便利です。";

export const metadata = buildPageMetadata({
  title: metaTitle,
  description: metaDescription,
  path: "/character-counter",
  keywords: ["文字数", "文字数カウント", "文字数計算機", "単語数", "読了時間"],
});
