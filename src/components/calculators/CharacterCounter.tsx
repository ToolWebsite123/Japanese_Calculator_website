"use client";

import { useMemo, useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { SecondaryButton, SurfacePanel } from "@/components/ui/primitives";
import { Textarea } from "@/components/ui/textarea";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import ja from "@/lib/i18n/ja";
import { countCharacters } from "@/lib/calculators/character-count";

const t = ja.characterCount;

const INTRO =
  "文字数計算機は、入力した文章の文字数・単語数・文章数・段落数・行数と読了時間の目安を、入力と同時にリアルタイムで集計する無料ツールです。ひらがな・カタカナ・漢字・英数字の内訳も表示します。原稿やレポートの文字数制限の確認、SNS投稿の下書きチェック、ブログ記事の読了時間の目安づくりなどにご利用ください。入力した文章はブラウザ内でのみ集計され、外部に送信されることはありません。";

const RULES = [
  "文字数はUnicodeのコードポイント単位で数えます。絵文字や一部の漢字も1文字として数えるため、見た目の文字数と一致します。",
  "「文字数（スペースを除く）」では、半角・全角のスペース、タブ、改行などの空白類をすべて除いて数えます。",
  "単語数は日本語の語区切り（分かち書きの境界）をもとにした実用的な目安です。文章の内容によって実際の単語の区切りと異なる場合があります。",
  "文章数は「。．.!！?？」で区切られた文の数、段落数は空行で区切られたブロックの数、行数は改行で区切られた行の数です。",
  "読了時間は、空白を除く文字数を日本語の平均的な読書速度（1分あたり500文字）で割って算出した目安です。",
];

const EXAMPLE_TEXT =
  "私は毎朝、近くの公園を散歩します。澄んだ空気の中で深呼吸をすると、一日の始まりが気持ちよくなります。";

const HOW_TO = {
  title: "文字数計算機の使い方",
  steps: [
    {
      title: "文章を入力する",
      body: "入力欄に文章を貼り付けるか、そのまま書き始めます。集計は入力と同時に自動で更新されるため、ボタン操作は不要です。",
    },
    {
      title: "集計結果を確認する",
      body: "文字数（スペースを除く数も併記）・単語数・文章数・段落数・行数・読了時間と、ひらがな・カタカナ・漢字などの内訳が表示されます。",
    },
    {
      title: "結果をコピーする・文章を消す",
      body: "「結果をコピー」で集計結果をテキストとしてコピーできます。「クリア」を押すと入力内容がすべて消え、集計もリセットされます。",
    },
  ],
};

export const FAQ = {
  title: "文字数計算機のよくある質問",
  items: [
    {
      question: "文字数はどのように数えていますか？",
      answer:
        "Unicodeのコードポイント単位で数えています。ひらがな・カタカナ・漢字・英数字はもちろん、絵文字も1文字として数えるため、画面に見えている文字数と一致します。改行やスペースも「文字数」には含まれ、「文字数（スペースを除く）」では空白類をすべて除いた数を表示します。",
    },
    {
      question: "「文字数（スペースを除く）」から除かれるのはどの文字ですか？",
      answer:
        "半角スペース、全角スペース、タブ、改行などの空白類すべてが対象です。原稿用紙の文字数や、空白を含めない文字数制限（レポートや応募原稿など）の確認にはこちらをご利用ください。",
    },
    {
      question: "単語数はどのように数えていますか？",
      answer:
        "日本語の語区切りをもとに単語へ分割して数える実用的な目安です。固有名詞や複合語の扱いによって、辞書的な単語の区切りと異なる場合があります。ユニークな単語数は、重複を除いた単語の種類数です（表記の異なる単語は別々に数えます）。",
    },
    {
      question: "読了時間はどのように計算していますか？",
      answer:
        "空白を除く文字数を、日本語の平均的な読書速度とされる1分あたり500文字で割って算出しています。速読・精読など読み方によって実際の時間は変わるため、あくまで目安としてご利用ください。",
    },
    {
      question: "入力した文章が外部に送信されることはありますか？",
      answer:
        "ありません。集計はすべてお使いのブラウザ内で行われ、入力した文章がサーバーへ送信されたり保存されたりすることはありません。",
    },
    {
      question: "文字数制限のある原稿や投稿の確認に使えますか？",
      answer:
        "はい。ページ下部の「文字数制限の目安」では、X（旧Twitter）やInstagramなどの代表的な制限をまとめています。ただし各サービスの仕様は変更されることがあるため、公開前に実際の投稿画面やプレビューでもご確認ください。",
    },
  ],
};

function formatReadingTime(minutes: number): string {
  const seconds = Math.round(minutes * 60);
  if (seconds === 0) return "0秒";
  if (seconds < 60) return `約${seconds}秒`;
  return `約${Math.ceil(minutes)}分`;
}

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

export function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const stats = useMemo(() => countCharacters(text), [text]);
  const exampleStats = useMemo(() => countCharacters(EXAMPLE_TEXT), []);

  const statTiles = [
    { label: t.stats.charactersWithoutSpaces, value: stats.charactersWithoutSpaces },
    { label: t.stats.wordCount, value: stats.wordCount },
    { label: t.stats.uniqueWordCount, value: stats.uniqueWordCount },
    { label: t.stats.sentenceCount, value: stats.sentenceCount },
    { label: t.stats.paragraphCount, value: stats.paragraphCount },
    { label: "行数", value: stats.lines },
  ];

  const breakdownRows = [
    { label: "ひらがな", value: stats.breakdown.hiragana },
    { label: "カタカナ", value: stats.breakdown.katakana },
    { label: "漢字", value: stats.breakdown.kanji },
    { label: "英字", value: stats.breakdown.latin },
    { label: "数字", value: stats.breakdown.digits },
    { label: "記号", value: stats.breakdown.symbols },
    { label: "その他", value: stats.breakdown.other },
  ];

  const exampleRows = [
    { label: t.stats.characters, value: exampleStats.characters },
    { label: t.stats.charactersWithoutSpaces, value: exampleStats.charactersWithoutSpaces },
    { label: t.stats.wordCount, value: exampleStats.wordCount },
    { label: t.stats.sentenceCount, value: exampleStats.sentenceCount },
    { label: "行数", value: exampleStats.lines },
  ];

  const handleCopy = async () => {
    const summary = [
      `${t.stats.characters}: ${stats.characters}`,
      `${t.stats.charactersWithoutSpaces}: ${stats.charactersWithoutSpaces}`,
      `${t.stats.wordCount}: ${stats.wordCount}`,
      `${t.stats.uniqueWordCount}: ${stats.uniqueWordCount}`,
      `${t.stats.sentenceCount}: ${stats.sentenceCount}`,
      `${t.stats.paragraphCount}: ${stats.paragraphCount}`,
      `行数: ${stats.lines}`,
      `${t.stats.readingTime}: ${formatReadingTime(stats.readingTimeMinutes)}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.title}
      </h1>

      <p className="mx-auto mb-6 max-w-3xl text-sm leading-relaxed text-text-secondary sm:text-base">
        {INTRO}
      </p>

      <CalculatorCard>
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label
              htmlFor="character-count-input"
              className="text-sm font-medium text-text-secondary"
            >
              {t.inputLabel}
            </label>
            <Textarea
              id="character-count-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.placeholder}
              rows={8}
              className="min-h-40 text-base leading-relaxed"
            />
            <p className="text-xs leading-relaxed text-text-tertiary">{t.liveNote}</p>
          </div>

          <SurfacePanel className="border-brand/20 bg-brand-muted space-y-3">
            <div>
              <div className="text-sm font-medium text-text-tertiary">{t.stats.characters}</div>
              <div className="tabular-display mt-2 text-2xl font-bold text-brand sm:text-3xl">
                {stats.characters.toLocaleString()}
                <span className="ml-1 text-base font-semibold text-text-secondary">文字</span>
              </div>
            </div>
            <div className="text-sm text-text-secondary">
              {t.stats.readingTime}：{formatReadingTime(stats.readingTimeMinutes)}
            </div>
          </SurfacePanel>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {statTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-lg border border-border bg-surface px-3 py-2"
              >
                <div className="text-xs font-medium text-text-tertiary">{tile.label}</div>
                <div className="tabular-display mt-1 text-lg font-bold text-text-primary">
                  {tile.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-sm font-medium text-text-secondary">文字の内訳（空白を除く）</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {breakdownRows.map((row) => (
                <span
                  key={row.label}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
                >
                  {row.label}：
                  <span className="tabular-display font-semibold text-text-primary">
                    {row.value.toLocaleString()}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <SecondaryButton onClick={handleCopy}>結果をコピー</SecondaryButton>
            <SecondaryButton
              onClick={() => {
                setText("");
                setCopied(false);
              }}
            >
              {ja.common.clear}
            </SecondaryButton>
            {copied && <span className="self-center text-sm text-brand">{ja.common.copied}</span>}
          </div>
        </div>
      </CalculatorCard>

      <section
        aria-labelledby="character-rules-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="character-rules-heading" className={guideHeadingClass}>
          文字数の数え方
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {RULES.map((rule) => (
            <li
              key={rule.slice(0, 12)}
              className="text-sm leading-relaxed text-text-secondary sm:text-base"
            >
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="character-example-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="character-example-heading" className={guideHeadingClass}>
          計算例
        </h2>
        <p className={guideBodyClass}>
          次の文章を入力した場合の集計結果です（このページの計算機で実際に集計しています）。
        </p>
        <SurfacePanel className="mt-4">
          <p className="text-sm leading-relaxed text-text-primary sm:text-base">{EXAMPLE_TEXT}</p>
        </SurfacePanel>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <tbody>
              {exampleRows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <th scope="row" className="px-3 py-2 text-left font-medium text-text-secondary">
                    {row.label}
                  </th>
                  <td className="tabular-display px-3 py-2 text-right font-semibold text-text-primary">
                    {row.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="character-reference-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="character-reference-heading" className={guideHeadingClass}>
          {t.referenceTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <tbody>
              {t.referenceItems.map((item) => (
                <tr key={item.label} className="border-b border-border last:border-0">
                  <th scope="row" className="px-3 py-2 text-left font-medium text-text-secondary">
                    {item.label}
                  </th>
                  <td className="px-3 py-2 text-text-primary">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={guideBodyClass}>{t.referenceNote}</p>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/character-counter" />
    </>
  );
}
