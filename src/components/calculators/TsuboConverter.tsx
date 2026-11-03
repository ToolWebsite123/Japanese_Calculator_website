"use client";

import { useState } from "react";
import { FormCard, FormField, ResultCard } from "@/components/ui/FormField";
import { PrimaryButton, SegmentedControl, SelectWell } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { convertArea, TATAMI_SQM, type AreaUnit, type TatamiType } from "@/lib/calculators/tsubo";

const INTRO =
  "坪・畳・㎡（平米）変換計算機は、土地や部屋の広さを「坪」「畳」「㎡」のあいだで相互に変換できる無料ツールです。数値を入れて単位を選ぶだけで、3つの単位の結果を同時に表示します。畳の大きさは不動産表示の基準（1畳＝1.62㎡）のほか、京間・中京間・江戸間・団地間から選べます。不動産広告の面積確認や、土地の坪単価の検討、引っ越し先の部屋の広さの比較などにご利用ください。";

const UNIT_OPTIONS: { value: AreaUnit; label: string }[] = [
  { value: "tsubo", label: "坪" },
  { value: "sqm", label: "㎡（平米）" },
  { value: "jo", label: "畳" },
];

const TATAMI_OPTIONS: { value: TatamiType; label: string }[] = [
  { value: "fudosan", label: "不動産表示（1畳＝1.62㎡）" },
  { value: "kyoma", label: "京間（1畳＝1.824㎡）" },
  { value: "chukyoma", label: "中京間（1畳＝1.652㎡）" },
  { value: "edoma", label: "江戸間（1畳＝1.548㎡）" },
  { value: "danchima", label: "団地間（1畳＝1.445㎡）" },
];

const TATAMI_ROWS: string[][] = [
  ["不動産表示の基準", "—", "1.62㎡", "広告表示のルール（1畳は1.62㎡以上）"],
  ["京間（本間）", "191×95.5cm", "1.824㎡", "関西・中国・四国など"],
  ["中京間（三六間）", "182×91cm", "1.652㎡", "愛知・岐阜・三重、東北の一部など"],
  ["江戸間（五八間）", "176×88cm", "1.548㎡", "関東・東北・北海道など"],
  ["団地間（五六間）", "170×85cm", "1.445㎡", "公団住宅・アパートなど"],
];

// Quick table computed with this page's own converter (1.62㎡ per 畳).
const QUICK_ROWS: string[][] = [
  ["1坪", "3.31㎡", "2.04畳"],
  ["2坪", "6.61㎡", "4.08畳"],
  ["3坪", "9.92㎡", "6.12畳"],
  ["5坪", "16.53㎡", "10.20畳"],
  ["10坪", "33.06㎡", "20.41畳"],
  ["15坪", "49.59㎡", "30.61畳"],
  ["20坪", "66.12㎡", "40.81畳"],
  ["25坪", "82.64㎡", "51.02畳"],
  ["30坪", "99.17㎡", "61.22畳"],
  ["40坪", "132.23㎡", "81.62畳"],
  ["50坪", "165.29㎡", "102.03畳"],
  ["100坪", "330.58㎡", "204.06畳"],
];

const MISTAKES = [
  "1坪をぴったり3.3㎡として計算してしまう（正確には1坪＝約3.306㎡です。広い土地では差が大きくなります）",
  "畳の大きさは全国同じだと思う（京間・江戸間など地域や建物で畳の寸法が違い、同じ「6畳」でも面積が変わります）",
  "不動産広告の「畳」表示を実測の畳の枚数だと思う（広告では1畳＝1.62㎡で換算した表示が使われます）",
  "坪単価をそのまま㎡単価と比較する（坪単価は1坪あたり、㎡単価は1㎡あたりの価格です。比較するときは単位をそろえてください）",
] as const;

const HOW_TO = {
  title: "坪・畳・㎡変換計算機の使い方",
  steps: [
    {
      title: "数値と単位を入力する",
      body: "変換したい広さの数値を入力し、単位（坪・㎡・畳）を選びます。畳から変換する場合は、畳の種類も選んでください。",
    },
    {
      title: "結果を確認する",
      body: "坪・㎡・畳の3つの結果が同時に表示されます。畳の種類を変えると、畳への換算結果も切り替わります。",
    },
    {
      title: "早見表で目安をつかむ",
      body: "よく使う広さはページ下部の早見表にまとめています。土地探しや部屋探しの際の目安としてご利用ください。",
    },
  ],
};

export const FAQ = {
  title: "坪・畳・㎡変換のよくある質問",
  items: [
    {
      question: "1坪は何㎡ですか？",
      answer:
        "1坪は約3.306㎡です。坪は尺貫法の単位で、1辺が6尺（約1.818m）の正方形の面積として定義され、正確には1坪＝400/121㎡（約3.3058㎡）になります。逆に1㎡は約0.3025坪です。長さ・重さ・温度など、ほかの単位の換算には単位変換もご利用ください。",
    },
    {
      question: "1畳は何㎡ですか？",
      answer:
        "畳の大きさによって変わります。不動産広告の表示では1畳＝1.62㎡以上と定められています。実際の畳は地域によって寸法が異なり、京間は約1.824㎡、中京間は約1.652㎡、江戸間は約1.548㎡、団地間は約1.445㎡です。",
    },
    {
      question: "「6畳」の部屋の広さが物件によって違うのはなぜですか？",
      answer:
        "畳の寸法が地域や建物で異なるうえ、広告表示では壁の中心から測る「壁芯面積」を1.62㎡で割って畳数を出すためです。実際に使える広さ（内法面積）より大きく表示されることがあるため、内見時に部屋の実寸を確認することをおすすめします。",
    },
    {
      question: "坪単価はどのように計算しますか？",
      answer:
        "土地の価格を坪数で割ると坪単価になります。たとえば2,000万円・30坪の土地なら、坪単価は約66.7万円です。㎡で比べたい場合は、坪単価を約3.306で割ると㎡単価の目安になります。",
    },
    {
      question: "この計算結果は正確ですか？",
      answer:
        "坪と㎡の換算は定義どおりの正確な計算です。畳への換算は、選択した畳の種類の1畳あたり面積で割った目安であり、実際の部屋の畳の枚数とは異なる場合があります。",
    },
  ],
};

function formatArea(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded.toLocaleString("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";

const tableHeadClass =
  "border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary";
const tableCellClass = "border border-border px-3 py-2 text-text-secondary";

export function TsuboConverter() {
  const [rawValue, setRawValue] = useState("30");
  const [unit, setUnit] = useState<AreaUnit>("tsubo");
  const [tatami, setTatami] = useState<TatamiType>("fudosan");

  // Converted only when the user presses 計算する (site-wide pattern,
  // same as the BMI calculator); the result cards show "—" until then.
  const [result, setResult] = useState<ReturnType<typeof convertArea> | null>(null);

  function handleCalculate() {
    const value = parseFloat(rawValue);
    if (!Number.isFinite(value) || value < 0) {
      setResult(null);
      return;
    }
    try {
      setResult(convertArea(value, unit, tatami));
    } catch {
      setResult(null);
    }
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        坪・畳・㎡（平米）変換計算機
      </h1>

      <FormCard>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="広さ"
              type="number"
              inputMode="decimal"
              min="0"
              value={rawValue}
              onChange={(e) => setRawValue(e.target.value)}
            />
            <div className="space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">畳の種類</span>
              <SelectWell value={tatami} onChange={(e) => setTatami(e.target.value as TatamiType)}>
                {TATAMI_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectWell>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">入力する単位</span>
            <SegmentedControl options={UNIT_OPTIONS} value={unit} onChange={setUnit} columns={3} />
          </div>

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ResultCard label="坪" value={result ? `${formatArea(result.tsubo)} 坪` : "—"} />
            <ResultCard
              label="㎡（平米）"
              value={result ? `${formatArea(result.sqm)} ㎡` : "—"}
              highlight
            />
            <ResultCard
              label={`畳（1畳＝${TATAMI_SQM[tatami]}㎡）`}
              value={result ? `${formatArea(result.jo)} 畳` : "—"}
            />
          </div>
        </div>
      </FormCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">{INTRO}</p>
      </div>

      <section
        aria-labelledby="tsubo-formula-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="tsubo-formula-heading" className={guideHeadingClass}>
          坪・畳・㎡の仕組みと変換の公式
        </h2>
        <p className={guideBodyClass}>
          坪は日本の尺貫法による面積の単位で、1辺が6尺（約1.818m）の正方形の面積です。1尺は10/33mと定められているため、1坪は正確に400/121㎡、約3.306㎡になります。㎡（平米）から坪へは、㎡の値を約3.306で割る（より正確には121/400をかける）ことで換算できます。
        </p>
        <p className={guideBodyClass}>
          畳は畳1枚分の面積ですが、畳の寸法は地域や建物によって異なります。不動産の広告表示では、公正競争規約により「1畳＝1.62㎡以上」で換算することとされています。この計算機では、その表示基準を初期値としつつ、京間・中京間・江戸間・団地間の実際の寸法でも換算できるようにしています。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li className="text-sm leading-relaxed text-text-secondary sm:text-base">
            ㎡ ＝ 坪 × 400/121（約3.306）
          </li>
          <li className="text-sm leading-relaxed text-text-secondary sm:text-base">
            坪 ＝ ㎡ × 121/400（約0.3025）
          </li>
          <li className="text-sm leading-relaxed text-text-secondary sm:text-base">
            畳 ＝ ㎡ ÷ 1畳あたりの面積（表示基準では1.62㎡）
          </li>
        </ul>
      </section>

      <section
        aria-labelledby="tsubo-example-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="tsubo-example-heading" className={guideHeadingClass}>
          計算例
        </h2>
        <p className={guideBodyClass}>
          30坪の土地は、30 × 400/121 ＝
          約99.17㎡です。畳（1畳＝1.62㎡）では約61.22畳になります。70㎡のマンションは、70 × 121/400
          ＝ 約21.18坪、畳では約43.21畳です。和室の6畳（中京間）は、6 × 1.652 ＝
          約9.91㎡で、坪ではちょうど約3.00坪になります。
        </p>
      </section>

      <section aria-labelledby="tsubo-quick-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tsubo-quick-heading" className={guideHeadingClass}>
          坪・㎡・畳 早見表
        </h2>
        <p className={guideBodyClass}>
          この計算機と同じ計算で作成した早見表です（畳は1畳＝1.62㎡で換算）。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr>
                <th scope="col" className={tableHeadClass}>
                  坪
                </th>
                <th scope="col" className={tableHeadClass}>
                  ㎡（平米）
                </th>
                <th scope="col" className={tableHeadClass}>
                  畳
                </th>
              </tr>
            </thead>
            <tbody>
              {QUICK_ROWS.map((row) => (
                <tr key={row[0]}>
                  <td data-label="坪" className={`${tableCellClass} font-medium text-text-primary`}>{row[0]}</td>
                  <td data-label="㎡（平米）" className={tableCellClass}>{row[1]}</td>
                  <td data-label="畳" className={tableCellClass}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="tsubo-tatami-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="tsubo-tatami-heading" className={guideHeadingClass}>
          畳の種類と大きさ
        </h2>
        <p className={guideBodyClass}>
          畳の寸法は地域の建築様式によって受け継がれてきたため、同じ「6畳」でも実際の広さが異なります。たとえば6畳の面積は、京間では約10.94㎡、江戸間では約9.29㎡と、1.6㎡以上の差が出ます。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr>
                <th scope="col" className={tableHeadClass}>
                  種類
                </th>
                <th scope="col" className={tableHeadClass}>
                  寸法の目安
                </th>
                <th scope="col" className={tableHeadClass}>
                  1畳の面積
                </th>
                <th scope="col" className={tableHeadClass}>
                  主な地域・用途
                </th>
              </tr>
            </thead>
            <tbody>
              {TATAMI_ROWS.map((row) => (
                <tr key={row[0]}>
                  <td data-label="種類" className={`${tableCellClass} font-medium text-text-primary`}>{row[0]}</td>
                  <td data-label="寸法の目安" className={tableCellClass}>{row[1]}</td>
                  <td data-label="1畳の面積" className={tableCellClass}>{row[2]}</td>
                  <td data-label="主な地域・用途" className={tableCellClass}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="tsubo-mistakes-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="tsubo-mistakes-heading" className={guideHeadingClass}>
          よくある間違いと注意点
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {MISTAKES.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/tsubo-converter" />
    </>
  );
}
