// Character Counter page strings, split out of the monolithic ja dictionary
// (LCP fix F1) so only pages that need them load them.
export const characterCount = {
  title: "文字数計算機",
  description: "文章の文字数・単語数・段落数・読了時間をリアルタイムで確認できる文字数計算機。",
  inputLabel: "文章を入力",
  placeholder:
    "ここに文章を入力してください。入力と同時に文字数や単語数、読了時間の目安を自動で更新します。",
  liveNote:
    "この計算機は入力と同時に集計結果を更新します。単語数は日本語の語区切りをもとにした実用的な目安です。",
  stats: {
    characters: "文字数",
    charactersWithoutSpaces: "文字数（スペースを除く）",
    wordCount: "単語数",
    uniqueWordCount: "ユニークな単語数",
    sentenceCount: "文章数",
    paragraphCount: "段落数",
    readingTime: "読了時間",
  },
  referenceTitle: "文字数制限の目安",
  referenceItems: [
    {
      label: "X（旧Twitter）投稿",
      value: "日本語ポストは140文字までが目安です。",
    },
    {
      label: "Instagram キャプション",
      value: "最大2,200文字まで入力できます。",
    },
    {
      label: "LINE公式アカウントのテキスト",
      value: "1吹き出しあたり最大500文字です。",
    },
    {
      label: "Google 検索結果のタイトルタグ",
      value: "目安として32文字程度に収めると表示が崩れにくくなります。",
    },
  ],
  referenceNote:
    "各サービスの仕様や表示幅は更新されることがあります。公開前は必ず実際の投稿画面やプレビューでも確認してください。",
};
