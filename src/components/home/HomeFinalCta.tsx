"use client";

/**
 * Closing call-to-action on the homepage (§C-13 of the homepage content
 * proposal, approved 2026-10-31). Both destinations verified live:
 * /web-calculator (the dedicated calculator page) and /calculators (hub).
 */
export function HomeFinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 text-center sm:px-6 sm:pb-16">
      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        まずはWeb電卓で計算してみましょう
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
        日常の計算なら、このページのWeb電卓ですぐに計算できます。もっと専門的な計算をしたいときは、計算機一覧から目的に合ったツールを選んでください。
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="/web-calculator"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white"
        >
          Web電卓を使う
        </a>
        <a
          href="/calculators"
          className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-bold text-text-primary"
        >
          計算機一覧を見る
        </a>
      </div>
    </section>
  );
}
