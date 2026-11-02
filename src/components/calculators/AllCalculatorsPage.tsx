"use client";

import { CalculatorCard } from "@/components/home/CalculatorCard";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CATEGORY_META, CATEGORY_ORDER, getNavDescription, getNavLabel } from "@/lib/catalog";
import { NAV_ITEMS, type CalculatorCategory } from "@/lib/constants";
import { useLocale } from "@/context/LocaleContext";

const HUB_INTRO =
  "電卓.onlineの計算ツールをすべてまとめました。関数電卓や税金・社会保険のシミュレーション、単位変換、坪・畳・㎡の換算、関数のグラフ描画、麻雀の点数計算まで、全27種類のツールが無料・登録不要で使えます。入力した数値はブラウザの中で処理され、サーバーには送信されません。目的の計算をカテゴリからお選びください。";

const HUB_GUIDE: { title: string; text: string }[] = [
  {
    title: "お金の計算をしたい",
    text: "「金融」カテゴリに、消費税・所得税・社会保険料・ふるさと納税などの税金関係と、複利・利息・ローンなどの資産形成のツールをまとめています。手取りや控除上限額の目安づけにご利用ください。",
  },
  {
    title: "数学・学習の計算をしたい",
    text: "「関数・数学」カテゴリには、関数電卓・分数・文字式・因数分解・連立方程式に加えて、式を入力するとグラフを描くグラフ計算機があります。宿題や受験勉強の答え合わせにも使えます。",
  },
  {
    title: "長さや広さを変換したい",
    text: "「変換」カテゴリの単位変換では、長さ・重さ・体積など11カテゴリをまとめて変換できます。土地や部屋の広さなら、坪・畳・㎡専用の変換計算機が便利です。",
  },
  {
    title: "日常のちょっとした計算をしたい",
    text: "「基本」カテゴリには、パーセント・割引・時間・文字数カウントなど毎日使えるツールがあります。ふだんの四則演算だけなら、トップページのWeb電卓がそのまま使えます。",
  },
];

export const HUB_FAQ = {
  title: "計算ツール一覧のよくある質問",
  items: [
    {
      question: "利用料金はかかりますか？",
      answer: "すべて無料です。会員登録も必要ありません。",
    },
    {
      question: "入力した数値は保存されますか？",
      answer:
        "いいえ。計算はお使いのブラウザ内で処理され、サーバーへ送信されることはありません。",
    },
    {
      question: "スマートフォンでも使えますか？",
      answer: "はい。スマートフォンやタブレットのブラウザでもそのまま使えます。",
    },
    {
      question: "どの計算機を使えばよいか分からないときは？",
      answer:
        "このページの「計算機の選び方」か、カテゴリ名から目的に近いものを探してください。ページ上部の検索に「税金」「グラフ」のような言葉を入れると、該当する計算機を絞り込むこともできます。",
    },
    {
      question: "計算結果は正確ですか？",
      answer:
        "各ツールは公式の計算式や定義に基づいて計算し、各ページに仕組み・計算例・注意点を掲載しています。税金や保険料などの試算は制度の前提による概算のため、最終的な金額は公式の案内や専門家にもご確認ください。",
    },
  ],
};

// Every category is rendered in full, including in the server-rendered HTML.
// The previous version only rendered the interactively selected category,
// which left most calculators unreachable (and unlinked) for crawlers.
const HUB_CATEGORIES: CalculatorCategory[] = CATEGORY_ORDER;

export function AllCalculatorsPage() {
  const { t } = useLocale();

  const groups = HUB_CATEGORIES.map((category) => ({
    category,
    meta: CATEGORY_META[category],
    items: NAV_ITEMS.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]">
        {t.nav.allCalculators}
      </h1>

      <p className="mb-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        {HUB_INTRO}
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav aria-label={t.home.categoriesTitle}>
            <ul className="flex flex-col gap-1">
              {groups.map(({ category, meta, items }) => {
                const name = t.categories[meta.nameKey];
                return (
                  <li key={category}>
                    <a
                      href={`#category-${category}`}
                      className="flex w-full items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-2 text-left text-sm font-semibold text-[#231942] transition-colors hover:bg-brand-muted/50 dark:text-[#d6ccf0]"
                    >
                      <span>{name}</span>
                      <span className="text-xs font-medium text-text-tertiary">{items.length}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-14">
          {groups.map(({ category, meta, items }) => (
            <section
              key={category}
              id={`category-${category}`}
              aria-labelledby={`heading-${category}`}
              className="scroll-mt-24"
            >
              <h2
                id={`heading-${category}`}
                className="mb-4 text-xl font-bold tracking-tight text-[#231942] dark:text-[#d6ccf0]"
              >
                {t.categories[meta.nameKey]}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {items.map((item) => (
                  <CalculatorCard
                    key={item.href}
                    href={item.href}
                    label={getNavLabel(item)}
                    description={getNavDescription(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section aria-labelledby="hub-guide-heading" className="mt-16 border-t border-border pt-12">
        <h2
          id="hub-guide-heading"
          className="mb-4 text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
        >
          計算機の選び方
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {HUB_GUIDE.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-bold text-text-primary">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CalculatorFaqSection title={HUB_FAQ.title} items={HUB_FAQ.items} />
    </div>
  );
}
