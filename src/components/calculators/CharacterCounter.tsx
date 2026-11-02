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
  "文字数計算機は、入力した文章の文字数・単語数・文章数・段落数・行数と読了時間の目安を、入力と同時にリアルタイムで集計する無料ツールです。ひらがな・カタカナ・漢字・英数字の内訳に加えて、バイト数（UTF-8）と原稿用紙（400字詰め）の枚数換算、文字数制限のチェックも表示します。原稿やレポートの文字数制限の確認、SNS投稿の下書きチェック、ブログ記事の読了時間の目安づくりなどにご利用ください。入力した文章はブラウザ内でのみ集計され、外部に送信されることはありません。";

const RULES = [
  "文字数はUnicodeのコードポイント単位で数えます。絵文字や一部の漢字も1文字として数えるため、見た目の文字数と一致します。",
  "「文字数（スペースを除く）」では、半角・全角のスペース、タブ、改行などの空白類をすべて除いて数えます。",
  "単語数は日本語の語区切り（分かち書きの境界）をもとにした実用的な目安です。文章の内容によって実際の単語の区切りと異なる場合があります。",
  "文章数は「。．.!！?？」で区切られた文の数、段落数は空行で区切られたブロックの数、行数は改行で区切られた行の数です。",
  "読了時間は、空白を除く文字数を日本語の平均的な読書速度（1分あたり500文字）で割って算出した目安です。",
  "バイト数はUTF-8で数えた容量です。日本語の文字は通常1文字3バイト、英数字は1バイトになるため、文字数とは一致しません。",
  "原稿用紙換算は、空白を除く文字数を400字詰め原稿用紙1枚＝400文字として換算した枚数です（200字詰めの場合は約2倍になります）。",
  "「Markdown記法を除外」をオンにすると、見出しの「#」・太字の「**」・リンクのURL部分などの記法を取り除き、表示される本文だけで数えます。「HTMLタグを除外」ではタグとコメントを取り除き、タグの間のテキストだけを数えます。どちらの場合も、すべての集計項目が除外後の文章で計算されます。",
];

const EXAMPLE_TEXT =
  "私は毎朝、近くの公園を散歩します。澄んだ空気の中で深呼吸をすると、一日の始まりが気持ちよくなります。";

const CC_MISTAKES = [
  "「全角は2文字、半角は1文字」と数えてしまう（このツールでは全角・半角のどちらも1文字として数えます）",
  "改行も文字数に含まれることを忘れる（改行を含めたくない場合は「文字数（空白・改行なし）」をご覧ください）",
  "サービスの制限とツールの文字数が一致しない（例：Xでは日本語の文字が2カウントとして扱われるため、このツールの文字数がそのまま投稿できる文字数にはなりません）",
  "絵文字は常に1文字だと思い込む（このツールでは通常の絵文字を1文字と数えますが、結合文字やスキントーン修飾を含む絵文字は、見た目が1つでも複数文字として数えられる場合があります）",
] as const;

const HOW_TO = {
  title: "文字数計算機の使い方",
  steps: [
    {
      title: "文章を入力する",
      body: "入力欄に文章を貼り付けるか、そのまま書き始めます。集計は入力と同時に自動で更新されるため、ボタン操作は不要です。",
    },
    {
      title: "集計結果を確認する",
      body: "文字数（スペースを除く数も併記）・単語数・文章数・段落数・行数・読了時間と、ひらがな・カタカナ・漢字などの内訳が表示されます。バイト数（UTF-8）と原稿用紙（400字詰め）の枚数換算も確認できます。",
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
        "はい。結果欄の「文字数制限チェック」では、代表的な制限（Instagramのキャプション、YouTubeのタイトル）に対する残り文字数をバーで確認でき、任意の上限を入力してチェックすることもできます。また、ページ下部の「文字数制限の目安」では、X（旧Twitter）やInstagramなどの代表的な制限をまとめています。ただし各サービスの仕様は変更されることがあるため、公開前に実際の投稿画面やプレビューでもご確認ください。",
    },
    {
      question: "バイト数（UTF-8）とは何ですか？",
      answer:
        "文章をUTF-8という文字コードで表したときのデータ量です。英数字は1文字1バイト、日本語の文字は通常1文字3バイト、絵文字は4バイトになります。データベースの容量制限や、バイト数で上限が決められた入力欄の確認などに使います。",
    },
    {
      question: "MarkdownやHTMLの文章も数えられますか？",
      answer:
        "はい。入力欄の下にある「Markdown記法を除外」にチェックを入れると、見出し・太字・リンクなどの記法を取り除いた本文の文字数を数えられます。「HTMLタグを除外」では、タグやコメントを除いたテキスト部分だけを集計します。ブログの下書きや、タグを含んだ文章の文字数確認にご利用ください。",
    },
    {
      question: "原稿用紙の枚数はどのように換算していますか？",
      answer:
        "空白を除く文字数を、400字詰め原稿用紙1枚＝400文字として割った枚数です。たとえば空白を除く文字数が2,000文字なら約5枚になります。200字詰め原稿用紙では約2倍の枚数になります。",
    },
  ],
};

function formatReadingTime(minutes: number): string {
  const seconds = Math.round(minutes * 60);
  if (seconds === 0) return "0秒";
  if (seconds < 60) return `約${seconds}秒`;
  return `約${Math.ceil(minutes)}分`;
}

function formatManuscriptSheets(sheets: number): string {
  if (sheets === 0) return "0枚";
  const rounded = Math.round(sheets * 10) / 10;
  return `約${rounded.toLocaleString()}枚`;
}

function LimitBar({ label, limit, used }: { label: string; limit: number; used: number }) {
  const over = used > limit;
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-text-secondary">
          {label}（{limit.toLocaleString()}字まで）
        </span>
        <span
          className={over ? "font-semibold text-red-600 dark:text-red-400" : "text-text-secondary"}
        >
          {over
            ? `${(used - limit).toLocaleString()}字オーバー`
            : `あと${(limit - used).toLocaleString()}字`}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className={over ? "h-full bg-red-500" : "h-full bg-brand"}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

export function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [customLimit, setCustomLimit] = useState("");
  const [excludeMarkdown, setExcludeMarkdown] = useState(false);
  const [excludeHtml, setExcludeHtml] = useState(false);
  const stats = useMemo(
    () => countCharacters(text, { excludeMarkdown, excludeHtml }),
    [text, excludeMarkdown, excludeHtml],
  );
  const exampleStats = useMemo(() => countCharacters(EXAMPLE_TEXT), []);

  const statTiles = [
    { label: t.stats.charactersWithoutSpaces, value: stats.charactersWithoutSpaces },
    { label: t.stats.wordCount, value: stats.wordCount },
    { label: t.stats.uniqueWordCount, value: stats.uniqueWordCount },
    { label: t.stats.sentenceCount, value: stats.sentenceCount },
    { label: t.stats.paragraphCount, value: stats.paragraphCount },
    { label: "行数", value: stats.lines },
    { label: "バイト数（UTF-8）", value: stats.bytesUtf8 },
    {
      label: "原稿用紙（400字詰め）",
      value: stats.manuscriptSheets,
      display: formatManuscriptSheets(stats.manuscriptSheets),
    },
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
      `バイト数（UTF-8）: ${stats.bytesUtf8}`,
      `原稿用紙（400字詰め）: ${formatManuscriptSheets(stats.manuscriptSheets)}`,
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
              <label className="flex items-center gap-1.5 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={excludeMarkdown}
                  onChange={(e) => setExcludeMarkdown(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                Markdown記法を除外
              </label>
              <label className="flex items-center gap-1.5 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={excludeHtml}
                  onChange={(e) => setExcludeHtml(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                HTMLタグを除外
              </label>
              {(excludeMarkdown || excludeHtml) && (
                <span className="text-xs font-medium text-brand">
                  記法・タグを除外した文章で集計しています
                </span>
              )}
            </div>
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
                  {"display" in tile && tile.display ? tile.display : tile.value.toLocaleString()}
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

          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <div className="text-sm font-medium text-text-secondary">
              文字数制限チェック（空白・改行を除く {stats.charactersWithoutSpaces.toLocaleString()}{" "}
              字で判定）
            </div>
            <div className="mt-3 space-y-3">
              <LimitBar
                label="Instagramのキャプション"
                limit={2200}
                used={stats.charactersWithoutSpaces}
              />
              <LimitBar
                label="YouTubeのタイトル"
                limit={100}
                used={stats.charactersWithoutSpaces}
              />
              {Number(customLimit) > 0 && (
                <LimitBar
                  label="カスタム制限"
                  limit={Number(customLimit)}
                  used={stats.charactersWithoutSpaces}
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label htmlFor="character-custom-limit" className="text-sm text-text-secondary">
                任意の上限（字）
              </label>
              <input
                id="character-custom-limit"
                type="number"
                min={1}
                inputMode="numeric"
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                placeholder="例：800"
                className="w-28 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-tertiary">
              X（旧Twitter）は日本語1文字が2カウントとして扱われる仕様のため、このチェックの単純な文字数とは一致しません。各サービスの仕様は変更されることがあります。
            </p>
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

      <section
        aria-labelledby="character-mistakes-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="character-mistakes-heading" className={guideHeadingClass}>
          よくある間違いと注意点
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {CC_MISTAKES.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/character-counter" />
    </>
  );
}
