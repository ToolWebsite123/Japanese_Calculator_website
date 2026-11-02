"use client";

/**
 * "Why this site" block on the homepage (rewritten 2026-11-02 in the
 * homepage overhaul: four points, count-free wording). Deliberately
 * kept distinct from the trust section (which covers formula basis,
 * periodic checks and the reference-value disclaimer).
 */

const POINTS: { title: string; text: string }[] = [
  {
    title: "すべて無料・登録不要",
    text: "どの計算ツールも無料で使えます。会員登録やアプリのインストールは不要で、ページを開いてすぐに計算を始められます。",
  },
  {
    title: "日本の制度に合わせた計算",
    text: "消費税（軽減税率8%対応）・所得税・社会保険料・ふるさと納税など、日本の暮らしと制度に合わせた計算ツールをそろえています。",
  },
  {
    title: "計算はブラウザの中だけ",
    text: "すべての計算はお使いのブラウザの中で完結します。入力した数値をサーバーへ送ることはないので、給与や税金の試算も安心して使えます。",
  },
  {
    title: "解説つきで仕組みがわかる",
    text: "各ページには計算の仕組み・公式、具体的な計算例、早見表とよくある質問を掲載しています。答えだけでなく、計算の流れまで確認できます。",
  },
];

export function HomeWhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        電卓.onlineが選ばれる理由
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
