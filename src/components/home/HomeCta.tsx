import Link from "@/compat/next-link";

// Fresh closing banner for the homepage (2026-11-02 rewrite).
export function HomeCta() {
  return (
    <section
      aria-labelledby="home-cta-heading"
      className="mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-6"
    >
      <div className="rounded-3xl bg-gradient-to-br from-brand to-[#3b2a6d] px-6 py-8 text-center sm:px-10 sm:py-10">
        <h2 id="home-cta-heading" className="text-lg font-bold text-white sm:text-xl">
          計算機は全部で28種。目的のツールを探してみてください
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
          税金・お金・健康・変換・学習。このページのWeb電卓で足りない計算は、専用の計算機が揃っています。
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <Link
            href="/calculators"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand-muted"
          >
            計算機一覧を見る
          </Link>
          <Link
            href="/scientific-calculator"
            className="rounded-full border border-white/50 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            関数電卓を使う
          </Link>
        </div>
      </div>
    </section>
  );
}
