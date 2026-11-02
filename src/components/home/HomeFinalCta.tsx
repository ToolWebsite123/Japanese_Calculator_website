"use client";

/**
 * Closing call-to-action on the homepage (copy rewritten 2026-11-02 in
 * the homepage overhaul). Destinations: the homepage hero calculator
 * (/) and the /calculators hub. (The dedicated /web-calculator page
 * was retired 2026-11-02 and redirects to /.)
 */
export function HomeFinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 text-center sm:px-6 sm:pb-16">
      <h2 className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]">
        どの計算も、ここから始められます
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
        ちょっとした四則演算なら、このページのWeb電卓でそのまま計算できます。税金・健康・単位変換など専門的な計算は、計算機一覧から目的に合ったツールを選んでください。どれも無料で、登録なしですぐに使えます。
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href="/" className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white">
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
