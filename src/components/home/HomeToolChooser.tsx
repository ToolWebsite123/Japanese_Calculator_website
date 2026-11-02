import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

// "Which calculator for which job" (approved draft,
// HOMEPAGE-SEO-MASTER-REPORT §8/§10). Priority order follows the
// SEMrush keyword volumes; page-specific keywords appear only as
// link anchors here — the content itself stays on the tool pages.

const CHOICES: { need: string; label: string; to: string }[] = [
  {
    need: "文章の量を数えたい",
    label: "文字数カウント（バイト数・原稿用紙換算つき）",
    to: "/character-counter",
  },
  { need: "体格の目安を知りたい", label: "BMI計算", to: "/bmi-calculator" },
  {
    need: "寄付の上限額を知りたい",
    label: "ふるさと納税の限度額シミュレーション",
    to: "/furusato-nozei-calculation",
  },
  {
    need: "税額の内訳まで見たい",
    label: "消費税計算（税込・税抜）",
    to: "/consumption-tax-calculator",
  },
  { need: "関数の計算をしたい", label: "関数電卓", to: "/scientific-calculator" },
  { need: "お金の増え方を試算したい", label: "複利計算", to: "/compound-interest-calculator" },
  { need: "割合を逆算したい", label: "パーセント計算", to: "/percentage-calculator" },
  { need: "長さや重さを換算したい", label: "単位変換", to: "/unit-converter" },
  { need: "土地や部屋の広さを換算したい", label: "坪・畳・㎡変換", to: "/tsubo-converter" },
  { need: "関数のグラフを描きたい", label: "グラフ計算機", to: "/graph-calculator" },
];

export function HomeToolChooser() {
  return (
    <section aria-labelledby="home-chooser-heading">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <h2
          id="home-chooser-heading"
          className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
        >
          目的に合った計算機の選び方
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
          四則演算で足りない計算は、専用の計算機を使うほうが速くて確実です。よく使われる計算機を目的別に紹介します。
        </p>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {CHOICES.map((choice) => (
            <li key={choice.to}>
              <Link
                to={choice.to}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition hover:border-brand"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-text-secondary">{choice.need}</span>
                  <span className="mt-0.5 block truncate text-sm font-bold text-text-primary">
                    {choice.label}
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5 dark:text-[#d6ccf0]"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-text-secondary">
          ほかの計算機も見たい →{" "}
          <Link
            to="/calculators"
            className="font-bold text-brand underline-offset-2 hover:underline dark:text-[#d6ccf0]"
          >
            計算機一覧（全27種）
          </Link>
        </p>
      </div>
    </section>
  );
}
