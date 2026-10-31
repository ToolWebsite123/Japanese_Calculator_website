"use client";

/**
 * "Why this site" block on the homepage (§C-10 of the homepage content
 * proposal, approved 2026-10-31). Three points only, deliberately kept
 * distinct from the trust section (which covers formula basis, periodic
 * checks and the reference-value disclaimer).
 */

const POINTS: { title: string; text: string }[] = [
  {
    title: "全25種が無料・登録不要",
    text: "すべての計算ツールを無料で使えます。会員登録やアプリのインストールは不要で、ページを開いてすぐに計算を始められます。",
  },
  {
    title: "日本の暮らしに合った計算",
    text: "消費税（軽減税率8%対応）・所得税・ふるさと納税など、日本の制度に合わせた計算ツールをそろえています。",
  },
  {
    title: "入力データは外部に送信されません",
    text: "すべての計算はお使いのブラウザの中で完結します。入力した数値をサーバーへ送ることはありません。",
  },
];

export function HomeWhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        選ばれる3つの理由
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {POINTS.map((point) => (
          <div key={point.title} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-bold text-text-primary">{point.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
