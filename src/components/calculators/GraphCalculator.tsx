"use client";

import { useMemo, useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { InputWell, SecondaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { evaluateFunction, sampleFunction } from "@/lib/calculators/graph";

const INTRO =
  "グラフ計算機は、y＝x²のような関数の式を入力すると、そのグラフをその場で描く無料ツールです。二次関数や三角関数、指数・対数関数などの形を確認でき、拡大・縮小や、xの値に対するyの値の表も表示します。数学の学習や、関数の増減・交点のイメージづかみにご利用ください。角度は弧度法（ラジアン）で計算します。";

const PRESETS: { label: string; expr: string }[] = [
  { label: "y＝x²", expr: "x^2" },
  { label: "y＝x²−2x+1", expr: "x^2-2x+1" },
  { label: "y＝sin(x)", expr: "sin(x)" },
  { label: "y＝2^x", expr: "2^x" },
  { label: "y＝1/x", expr: "1/x" },
  { label: "y＝√x", expr: "sqrt(x)" },
];

const FUNCTION_ROWS: string[][] = [
  ["四則演算", "+ − × ÷（×は * 、÷は / でも入力できます）"],
  ["べき乗", "x^2、2^x のように ^ を使います"],
  ["掛け算の省略", "2x、2(x+1)、(x+1)(x-1) のように × を省けます"],
  ["三角関数", "sin(x)、cos(x)、tan(x)（角度はラジアン）"],
  ["平方根・絶対値", "sqrt(x)、abs(x)"],
  ["対数", "log(x)（常用対数）、ln(x)（自然対数）"],
  ["指数", "exp(x)（e^x）"],
  ["定数", "π（pi）、e"],
];

const MISTAKES = [
  "掛け算記号のつもりで「x」を使う（この計算機の x は変数です。掛け算は * か、2x のように省略して書きます）",
  "sin(x) を度数法（°）のつもりで使う（角度はラジアンで計算します。180°は π ラジアンです）",
  "1/x のグラフが原点で途切れるのを誤りだと思う（x＝0 では定義されないため、グラフはそこで分かれます）",
  "-x^2 と (-x)^2 を混同する（-x^2 は -(x^2) の意味で、x＝2 のとき -4 になります）",
] as const;

const HOW_TO = {
  title: "グラフ計算機の使い方",
  steps: [
    {
      title: "関数の式を入力する",
      body: "「y＝」の右側に、xを使った式を入力します。例として用意したボタンから選ぶこともできます。入力と同時にグラフが描き直されます。",
    },
    {
      title: "表示範囲を調整する",
      body: "「拡大」「縮小」ボタンで表示範囲を変えられます。「リセット」で初期範囲（x・yともに−10〜10）に戻ります。",
    },
    {
      title: "値の表で確認する",
      body: "グラフの下の表で、x＝−5〜5に対するyの値を数値で確認できます。特定のxに対する値は「xの値からyを求める」でも調べられます。",
    },
  ],
};

export const FAQ = {
  title: "グラフ計算機のよくある質問",
  items: [
    {
      question: "どんな関数のグラフが描けますか？",
      answer:
        "xの多項式（x²やx³など）、三角関数 sin・cos・tan、指数関数（2^x、exp(x)）、対数関数 log・ln、平方根 sqrt、絶対値 abs など、四則演算と組み合わせた関数のグラフが描けます。分数式（1/xなど）も扱えます。",
    },
    {
      question: "角度は度数法（°）ですか、弧度法（ラジアン）ですか？",
      answer:
        "弧度法（ラジアン）です。たとえば sin(x) の周期は 2π（約6.28）になります。度数法で考えたい場合は、sin(x×π/180) のように変換して入力してください。",
    },
    {
      question: "グラフが途中で途切れるのはなぜですか？",
      answer:
        "その範囲で関数が定義されていないためです。たとえば 1/x は x＝0、sqrt(x) は x が負の範囲、log(x) は x が0以下では値を持たないため、グラフは描かれません。",
    },
    {
      question: "2つの関数の交点は調べられますか？",
      answer:
        "現在のバージョンでは、同時に描ける関数は1つです。交点の目安は、値の表や拡大表示で近くの値を比べて確認してください。交点の座標を正確に求めたいときは、連立方程式計算機で2つの式を連立させると、解として得られます。",
    },
    {
      question: "入力した式が外部に送信されることはありますか？",
      answer: "ありません。グラフの計算はすべてお使いのブラウザ内で行われます。",
    },
  ],
};

const W = 720;
const H = 480;

function fmtVal(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const rounded = Math.round(v * 10000) / 10000;
  return rounded.toLocaleString("ja-JP", { maximumFractionDigits: 4 });
}

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";
const tableHeadClass =
  "border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary";
const tableCellClass = "border border-border px-3 py-2 text-text-secondary";

export function GraphCalculator() {
  const [expr, setExpr] = useState("x^2");
  const [range, setRange] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [probeX, setProbeX] = useState("2");

  const parsed = useMemo(() => {
    try {
      evaluateFunction(expr, 0);
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, message: e instanceof Error ? e.message : "式が不正です" };
    }
  }, [expr]);

  const path = useMemo(() => {
    if (!parsed.ok) return "";
    const points = sampleFunction(expr, range.xMin, range.xMax, 280);
    const toPx = (x: number) => ((x - range.xMin) / (range.xMax - range.xMin)) * W;
    const toPy = (y: number) => H - ((y - range.yMin) / (range.yMax - range.yMin)) * H;
    const yPad = (range.yMax - range.yMin) * 2;
    let d = "";
    let pen = false;
    for (const p of points) {
      if (p.y === null || p.y < range.yMin - yPad || p.y > range.yMax + yPad) {
        pen = false;
        continue;
      }
      const px = toPx(p.x).toFixed(1);
      const py = toPy(p.y).toFixed(1);
      d += pen ? ` L${px} ${py}` : ` M${px} ${py}`;
      pen = true;
    }
    return d;
  }, [expr, range, parsed.ok]);

  const tableRows = useMemo(() => {
    if (!parsed.ok) return [];
    return [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((x) => {
      try {
        return { x, y: fmtVal(evaluateFunction(expr, x)) };
      } catch {
        return { x, y: "—" };
      }
    });
  }, [expr, parsed.ok]);

  const probe = useMemo(() => {
    if (!parsed.ok) return null;
    const x = parseFloat(probeX);
    if (!Number.isFinite(x)) return null;
    try {
      return fmtVal(evaluateFunction(expr, x));
    } catch {
      return "定義されません";
    }
  }, [expr, probeX, parsed.ok]);

  const grid = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; axis: boolean }[] = [];
    const toPx = (x: number) => ((x - range.xMin) / (range.xMax - range.xMin)) * W;
    const toPy = (y: number) => H - ((y - range.yMin) / (range.yMax - range.yMin)) * H;
    const stepX = range.xMax - range.xMin > 40 ? 5 : 1;
    const stepY = range.yMax - range.yMin > 40 ? 5 : 1;
    for (let x = Math.ceil(range.xMin / stepX) * stepX; x <= range.xMax; x += stepX) {
      lines.push({ x1: toPx(x), y1: 0, x2: toPx(x), y2: H, axis: x === 0 });
    }
    for (let y = Math.ceil(range.yMin / stepY) * stepY; y <= range.yMax; y += stepY) {
      lines.push({ x1: 0, y1: toPy(y), x2: W, y2: toPy(y), axis: y === 0 });
    }
    return lines;
  }, [range]);

  const zoom = (factor: number) =>
    setRange((r) => ({
      xMin: r.xMin * factor,
      xMax: r.xMax * factor,
      yMin: r.yMin * factor,
      yMax: r.yMax * factor,
    }));

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        グラフ計算機
      </h1>

      <CalculatorCard maxWidthClass="max-w-3xl">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-text-primary">y ＝</span>
            <div className="min-w-48 flex-1">
              <InputWell
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                placeholder="x^2 + 2x + 1"
                aria-label="関数の式"
                className="w-full"
              />
            </div>
          </div>

          {!parsed.ok && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">{parsed.message}</p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.expr}
                type="button"
                onClick={() => setExpr(preset.expr)}
                className="rounded-full border border-border bg-surface-sunken px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:text-brand dark:hover:text-[#d6ccf0]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="block h-auto w-full"
              role="img"
              aria-label={`y=${expr} のグラフ`}
            >
              {grid.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="currentColor"
                  strokeWidth={line.axis ? 1.4 : 0.6}
                  className={line.axis ? "text-text-tertiary" : "text-border"}
                />
              ))}
              {path && (
                <path
                  d={path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  className="text-brand dark:text-[#d6ccf0]"
                />
              )}
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SecondaryButton className="min-w-24 px-5" onClick={() => zoom(0.5)}>
              拡大
            </SecondaryButton>
            <SecondaryButton className="min-w-24 px-5" onClick={() => zoom(2)}>
              縮小
            </SecondaryButton>
            <SecondaryButton
              className="min-w-24 px-5"
              onClick={() => setRange({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })}
            >
              リセット
            </SecondaryButton>
            <span className="text-xs text-text-tertiary">
              表示範囲：x は {range.xMin}〜{range.xMax}、y は {range.yMin}〜{range.yMax}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">
              xの値からyを求める： x ＝
            </span>
            <div className="w-28">
              <InputWell
                type="number"
                value={probeX}
                onChange={(e) => setProbeX(e.target.value)}
                aria-label="xの値"
                className="w-full"
              />
            </div>
            <span className="text-sm text-text-primary">
              → y ＝ <span className="font-bold">{probe ?? "—"}</span>
            </span>
          </div>

          {parsed.ok && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th scope="col" className={tableHeadClass}>
                      x
                    </th>
                    {tableRows.map((row) => (
                      <th key={row.x} scope="col" className={tableHeadClass}>
                        {row.x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className={tableHeadClass}>
                      y
                    </th>
                    {tableRows.map((row) => (
                      <td key={row.x} data-label={`x = ${row.x}`} className={tableCellClass}>
                        {row.y}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">{INTRO}</p>
      </div>

      <section aria-labelledby="graph-about-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="graph-about-heading" className={guideHeadingClass}>
          関数のグラフと入力できる式
        </h2>
        <p className={guideBodyClass}>
          関数のグラフは、xの値に対してyの値がどのように変わるかを図で表したものです。たとえば y＝x²
          では、xが0のとき yは0、xが2のとき
          yは4となり、この点の集まりが放物線を描きます。式の形とグラフの形の関係をつかむことは、数学の理解の近道です。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr>
                <th scope="col" className={tableHeadClass}>
                  種類
                </th>
                <th scope="col" className={tableHeadClass}>
                  書き方
                </th>
              </tr>
            </thead>
            <tbody>
              {FUNCTION_ROWS.map((row) => (
                <tr key={row[0]}>
                  <td data-label="種類" className={`${tableCellClass} font-medium text-text-primary`}>{row[0]}</td>
                  <td data-label="書き方" className={tableCellClass}>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="graph-example-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="graph-example-heading" className={guideHeadingClass}>
          計算例
        </h2>
        <p className={guideBodyClass}>
          y＝x²−2x+1 は (x−1)² と同じ式で、x＝1のときに最小値0をとる放物線です。x＝3では
          y＝4、x＝−1では y＝4になります。y＝sin(x)
          は波の形をしており、x＝π/2（約1.57）のとき最大値1、x＝2π（約6.28）で1周期が終わります。y＝2^x
          は右へ進むほど急激に大きくなり、x＝10で y＝1024 になります。
        </p>
      </section>

      <section
        aria-labelledby="graph-mistakes-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2 id="graph-mistakes-heading" className={guideHeadingClass}>
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
      <RelatedCalculators activeHref="/graph-calculator" />
    </>
  );
}
