import { LinkedText } from "@/components/calculator/LinkedText";

// Fresh "about this site" block for the homepage (2026-11-02 rewrite).
// Calculator names in the text are turned into internal links by
// LinkedText, so the copy itself stays plain and readable.
const POINTS: string[] = [
  "完全無料・登録不要",
  "入力データは端末内のみで処理",
  "税率・単位など日本の制度に対応",
];

export function HomeAbout() {
  return (
    <section
      aria-labelledby="home-about-heading"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"
    >
      <h2
        id="home-about-heading"
        className="text-xl font-bold tracking-tight text-[#231942] sm:text-2xl dark:text-[#d6ccf0]"
      >
        電卓.onlineについて
      </h2>
      <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        <p>
          <LinkedText text="電卓.onlineは、ブラウザで開いてすぐ使える計算ツールを集めたサイトです。ふだんの四則演算はこのページのWeb電卓で済みますが、文章の量を数える文字数カウント、税金の試算に使うふるさと納税や複利計算、学習に役立つ関数電卓とグラフ計算機、土地や部屋の広さを見る坪・畳・㎡変換、健康の目安になるBMI計算など、目的に合わせた専用の計算機を全27種そろえています。" />
        </p>
        <p>
          <LinkedText text="どのツールも、計算はお使いのブラウザの中だけで完結します。入力した数値がサーバーへ送られることはないため、家計の試算や仕事の概算にも安心して使えます。各計算機のページには、仕組みや計算例、早見表、よくある質問も掲載しているので、結果の根拠を確認しながら利用できます。" />
        </p>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {POINTS.map((point) => (
          <li
            key={point}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary sm:text-sm"
          >
            <span className="font-bold text-brand" aria-hidden="true">
              ✓
            </span>
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
