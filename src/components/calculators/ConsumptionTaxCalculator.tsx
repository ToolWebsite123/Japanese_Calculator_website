"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, SecondaryButton } from "@/components/ui/primitives";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { useHistory } from "@/context/HistoryContext";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { formatYen } from "@/lib/format";
import {
  calcFromTaxExcluded,
  calcFromTaxIncluded,
  type RoundMode,
} from "@/lib/calculators/consumption-tax";

const INTRO =
  "消費税 計算をブラウザ上で行えるツールです。税抜価格から税込価格を求める計算と、税込価格から税抜価格と消費税額を逆算する計算の両方に対応。標準税率10％と軽減税率8％に加えて任意の税率も指定でき、消費税額の端数処理（切り捨て・四捨五入・切り上げ）も選択できます。割引 計算やパーセント計算とあわせて活用してください。";

const HOW_TO = {
  title: "消費税 計算の使い方",
  steps: [
    {
      title: "計算方向を選ぶ",
      body: "「税抜価格 → 税込価格」または「税込価格 → 税抜価格・税額（逆算）」を選びます。",
    },
    {
      title: "金額を入力",
      body: "税抜価格（または税込価格）を円単位で入力します。",
    },
    {
      title: "税率と端数処理を設定",
      body: "標準税率10％、軽減税率8％、または任意の税率を選び、端数は切り捨て・四捨五入・切り上げから選べます。",
    },
    {
      title: "税額と合計を確認する",
      body: "消費税額と税込価格（逆算の場合は税抜価格）がその場で表示されます。",
    },
  ],
};

export const FAQ = {
  title: "消費税の計算に関するよくある質問",
  items: [
    {
      question: "標準税率10％と軽減税率8％の違いは？",
      answer:
        "標準税率は10％です。軽減税率8％は、酒類・外食を除く飲食料品と、定期購読契約に基づく新聞（週2回以上発行）など一部の品目に適用されます。どちらの税率が適用されるかは品目によって決まります。",
    },
    {
      question: "税込価格から税抜価格を逆算できますか？",
      answer:
        "はい。計算方向で「税込価格 → 税抜価格・税額（逆算）」を選んでください。例：税込1,100円（税率10％）なら、税抜価格は1,000円、消費税額は100円です。",
    },
    {
      question: "端数処理はどれを選べばいいですか？",
      answer:
        "消費税額の1円未満の端数をどう処理するかは、法律で一律に決まっているわけではなく、事業者が選んだ方法で計算します。一般的には切り捨てが多く使われます。請求書では、税率ごとに区分した合計金額に対して1回だけ端数処理を行うのが原則です。",
    },
    {
      question: "インボイス制度には対応していますか？",
      answer:
        "本ツールは、1つの金額に対する消費税の簡易計算ツールです。インボイス（適格請求書）の発行に必要な登録番号の記載や、税率ごとの区分計算を自動で行うものではありません。インボイスの作成方法については、国税庁の案内や税理士にご確認ください。",
    },
    {
      question: "税率を自由に設定できますか？",
      answer:
        "はい。税率で「任意の税率」を選ぶと、パーセント単位で自由に入力できます。旧税率での確認や、将来の税率変更時の試算などに使えます。",
    },
    {
      question: "割引後の金額にかかる消費税も計算できますか？",
      answer:
        "割引後の税抜価格を本ツールに入力すれば、その金額にかかる消費税額と税込価格が計算できます。割引率そのものを計算したい場合は、割引 計算のツールが便利です。",
    },
    {
      question: "税込価格から消費税だけを求めるには？",
      answer:
        "税込価格 ÷（1＋税率）で税抜価格を求め、税込価格から引いた金額が消費税額です。税率10%なら「税込価格 × 10 ÷ 110」でも同じ結果になります。例：税込2,728円なら消費税額は248円です。",
    },
    {
      question: "8%と10%が混ざった買い物はどう計算しますか？",
      answer:
        "税率ごとに合計を分けてから、それぞれの税率で計算します。この計算機でも、税率を切り替えて別々に計算してください。レシートでは税率ごとに区分して表示されるのが一般的です。",
    },
  ],
};

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideSubHeadingClass =
  "mt-8 text-base font-semibold text-[#231942] sm:text-lg dark:text-[#d6ccf0]";
const guideBodyClass = "mt-3 text-sm leading-relaxed text-text-secondary sm:text-base";

function TaxGuideTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border border-border bg-surface-sunken px-3 py-2 text-left font-semibold text-text-primary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td
                  key={cell}
                  className={`border border-border px-3 py-2 ${
                    i === 0 ? "font-medium text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TAX_TABLES = {
  title: "消費税の早見表",
  intro:
    "よく使う金額の変換結果をまとめました。端数が出ない金額のみを載せています。実際の計算は上の計算機でどうぞ。",
  excludedToIncluded10Title: "税抜 → 税込（税率10%）",
  excludedToIncluded8Title: "税抜 → 税込（軽減税率8%）",
  includedToExcluded10Title: "税込 → 税抜（税率10%）",
  includedToExcluded8Title: "税込 → 税抜（軽減税率8%）",
  excludedHead: ["税抜価格", "税込価格", "消費税額"],
  includedHead: ["税込価格", "税抜価格", "消費税額"],
  excludedToIncluded10Rows: [
    ["100円", "110円", "10円"],
    ["500円", "550円", "50円"],
    ["1,000円", "1,100円", "100円"],
    ["5,000円", "5,500円", "500円"],
    ["10,000円", "11,000円", "1,000円"],
  ],
  excludedToIncluded8Rows: [
    ["100円", "108円", "8円"],
    ["500円", "540円", "40円"],
    ["1,000円", "1,080円", "80円"],
    ["5,000円", "5,400円", "400円"],
    ["10,000円", "10,800円", "800円"],
  ],
  includedToExcluded10Rows: [
    ["110円", "100円", "10円"],
    ["550円", "500円", "50円"],
    ["1,100円", "1,000円", "100円"],
    ["5,500円", "5,000円", "500円"],
    ["11,000円", "10,000円", "1,000円"],
  ],
  includedToExcluded8Rows: [
    ["108円", "100円", "8円"],
    ["540円", "500円", "40円"],
    ["1,080円", "1,000円", "80円"],
    ["5,400円", "5,000円", "400円"],
    ["10,800円", "10,000円", "800円"],
  ],
};

const TAX_EXAMPLE = {
  title: "消費税の計算例",
  intro: "税抜2,480円の商品（税率10%の対象）の場合で計算してみます。",
  steps: [
    "税率を10%に設定します。",
    "税抜価格2,480円を入力します。",
    "税込価格は 2,480 × 1.10 ＝ 2,728円、消費税額は 248円 です。",
  ],
  reverse:
    "逆に、税込2,728円から税抜価格を出す場合は 2,728 ÷ 1.10 ＝ 2,480円 となり、消費税額は 2,728 − 2,480 ＝ 248円 で一致します。",
};

const TAX_REDUCED = {
  title: "軽減税率（8%）の対象品目",
  intro: "次のものは軽減税率（8%）の対象です。",
  items: [
    "酒類と外食を除く飲食料品（テイクアウトやデリバリーは8%、店内での飲食は10%です）",
    "週2回以上発行され、定期購読契約に基づく新聞",
  ],
  closing: "それ以外のほとんどの商品・サービスは標準税率10%です。",
};

const TAX_ROUNDING = {
  title: "端数処理について",
  body: "消費税の計算では1円未満の端数が出ることがあります。端数の処理方法（切り捨て・四捨五入・切り上げ）は事業者が決めるもので、法律で一律に決まっているわけではありません。この計算機では3つの方法から選べます。請求書を受け取る側・出す側で方法が違うと1円の差が出ることがあるため、取引先との取り決めを確認しましょう。",
};

const TAX_MISTAKES = {
  title: "よくある間違い",
  items: [
    "テイクアウト（8%）と店内飲食（10%）を取り違える。同じ飲食料品でも、食べる場所で税率が変わります。",
    "税込価格にそのまま税率をかけて消費税額を出してしまう。税込価格から税額を出すときは、割り戻す計算（税込価格 × 税率 ÷（1＋税率））が必要です。",
    "割引と消費税の順番を間違える。通常、消費税は割引後の金額にかかります。割引の計算には割引計算のツールもあわせてご利用ください。",
  ],
};

type Mode = "fromExcluded" | "fromIncluded";
type RateChoice = "0.10" | "0.08" | "custom";

function formatRatePercent(rate: number): string {
  return `${parseFloat((rate * 100).toFixed(4))}％`;
}

export function ConsumptionTaxCalculator() {
  const [mode, setMode] = useState<Mode>("fromExcluded");
  const [amount, setAmount] = useState("1000");
  const [rateChoice, setRateChoice] = useState<RateChoice>("0.10");
  const [customRatePercent, setCustomRatePercent] = useState("10");
  const [round, setRound] = useState<RoundMode>("floor");

  const { addEntry } = useHistory();

  const computed = useMemo(() => {
    try {
      const rate =
        rateChoice === "custom" ? parseFloat(customRatePercent) / 100 : parseFloat(rateChoice);
      const input = { amount: parseFloat(amount) || 0, rate, round };
      const r = mode === "fromExcluded" ? calcFromTaxExcluded(input) : calcFromTaxIncluded(input);
      return { result: r, error: null as string | null };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : "計算エラー" };
    }
  }, [mode, amount, rateChoice, customRatePercent, round]);
  const result = computed.result;
  const error = computed.error;
  const resultMode = mode;

  const loggedKeyRef = useRef<string>("");
  useEffect(() => {
    if (!result) return;
    const key = `${mode}|${amount}|${rateChoice}|${customRatePercent}|${round}`;
    if (loggedKeyRef.current === key) return;
    const timer = setTimeout(() => {
      loggedKeyRef.current = key;
      addEntry({
        expression: `消費税 ${amount}円`,
        result: formatYen(mode === "fromExcluded" ? result.totalAmount : result.baseAmount),
        route: "/consumption-tax-calculator",
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [result, mode, amount, rateChoice, customRatePercent, round, addEntry]);

  function handleClear() {
    setMode("fromExcluded");
    setAmount("1000");
    setRateChoice("0.10");
    setCustomRatePercent("10");
    setRound("floor");
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        消費税 計算
      </h1>
      <CalculatorCard
        compact
        maxWidthClass="max-w-[500px]"
        actions={result ? <CopyResultButton value={formatYen(resultMode === "fromExcluded" ? result.totalAmount : result.baseAmount)} /> : undefined}
      >
        <div className="space-y-2.5 sm:space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">計算方向</span>
            <SelectWell
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="text-lg"
            >
              <option value="fromExcluded">税抜価格 → 税込価格</option>
              <option value="fromIncluded">税込価格 → 税抜価格・税額（逆算）</option>
            </SelectWell>
          </label>

          <FormField
            label={mode === "fromExcluded" ? "税抜価格（円）" : "税込価格（円）"}
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">消費税率</span>
              <SelectWell
                value={rateChoice}
                onChange={(e) => setRateChoice(e.target.value as RateChoice)}
                className="text-lg"
              >
                <option value="0.10">10％（標準税率）</option>
                <option value="0.08">8％（軽減税率）</option>
                <option value="custom">任意の税率</option>
              </SelectWell>
            </label>
            {rateChoice === "custom" && (
              <FormField
                label="税率（％）"
                type="number"
                min={0}
                step="0.01"
                value={customRatePercent}
                onChange={(e) => setCustomRatePercent(e.target.value)}
                className="text-lg"
              />
            )}
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">端数処理</span>
            <SelectWell
              value={round}
              onChange={(e) => setRound(e.target.value as RoundMode)}
              className="text-lg"
            >
              <option value="floor">切り捨て（既定）</option>
              <option value="round">四捨五入</option>
              <option value="ceil">切り上げ</option>
            </SelectWell>
          </label>

          <SecondaryButton fullWidth onClick={handleClear}>
            クリア
          </SecondaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result && (
            <div translate="no" className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      {resultMode === "fromExcluded" ? "税抜価格" : "税込価格"}
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(
                        resultMode === "fromExcluded" ? result.baseAmount : result.totalAmount,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      消費税額（{formatRatePercent(result.rate)}）
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.taxAmount)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    {resultMode === "fromExcluded" ? "税込価格" : "税抜価格"}
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(
                      resultMode === "fromExcluded" ? result.totalAmount : result.baseAmount,
                    )}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  {resultMode === "fromExcluded" ? (
                    <>
                      <p>
                        1. 消費税額 = {formatYen(result.baseAmount)} ×{" "}
                        {formatRatePercent(result.rate)} = {formatYen(result.taxAmount)}
                        （端数処理適用後）
                      </p>
                      <p>
                        2. 税込価格 = {formatYen(result.baseAmount)} + {formatYen(result.taxAmount)}{" "}
                        = {formatYen(result.totalAmount)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        1. 税抜価格 = {formatYen(result.totalAmount)} ÷{" "}
                        {`(1 + ${formatRatePercent(result.rate)})`} = {formatYen(result.baseAmount)}
                        （端数処理適用後）
                      </p>
                      <p>
                        2. 消費税額 = {formatYen(result.totalAmount)} −{" "}
                        {formatYen(result.baseAmount)} = {formatYen(result.taxAmount)}
                      </p>
                    </>
                  )}
                </SurfacePanel>
              </Divider>
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          税抜⇔税込の変換と消費税額の計算に対応。10％・8％（軽減税率）、端数処理も選べます。
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/consumption-tax-calculator" />
      </p>

      <Divider>
        <h2 className="mb-4 text-xl font-semibold text-text-primary">消費税の計算式</h2>
        <SurfacePanel className="space-y-2 text-sm text-text-secondary">
          <p>税込価格 = 税抜価格 ×（1 + 税率）</p>
          <p>消費税額 = 税抜価格 × 税率</p>
          <p>税抜価格 = 税込価格 ÷（1 + 税率）</p>
          <p>
            本ツールでは、税抜価格から計算する場合は消費税額に、税込価格から逆算する場合は税抜価格に、選んだ端数処理（切り捨て・四捨五入・切り上げ）を適用します。そのため「税抜価格
            + 消費税額 = 税込価格」が常に一致します。
          </p>
        </SurfacePanel>
        <p className="mt-4 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          本ツールは日常の目安を計算するための簡易ツールです。請求書の発行や税金の申告などの正式な税務処理については、税務署や税理士にご確認ください。
        </p>
      </Divider>

      <section aria-labelledby="tax-example-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-example-heading" className={guideHeadingClass}>
          {TAX_EXAMPLE.title}
        </h2>
        <p className={guideBodyClass}>{TAX_EXAMPLE.intro}</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {TAX_EXAMPLE.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className={guideBodyClass}>{TAX_EXAMPLE.reverse}</p>
      </section>

      <section aria-labelledby="tax-tables-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-tables-heading" className={guideHeadingClass}>
          {TAX_TABLES.title}
        </h2>
        <p className={guideBodyClass}>{TAX_TABLES.intro}</p>
        <h3 className={guideSubHeadingClass}>{TAX_TABLES.excludedToIncluded10Title}</h3>
        <TaxGuideTable head={TAX_TABLES.excludedHead} rows={TAX_TABLES.excludedToIncluded10Rows} />
        <h3 className={guideSubHeadingClass}>{TAX_TABLES.excludedToIncluded8Title}</h3>
        <TaxGuideTable head={TAX_TABLES.excludedHead} rows={TAX_TABLES.excludedToIncluded8Rows} />
        <h3 className={guideSubHeadingClass}>{TAX_TABLES.includedToExcluded10Title}</h3>
        <TaxGuideTable head={TAX_TABLES.includedHead} rows={TAX_TABLES.includedToExcluded10Rows} />
        <h3 className={guideSubHeadingClass}>{TAX_TABLES.includedToExcluded8Title}</h3>
        <TaxGuideTable head={TAX_TABLES.includedHead} rows={TAX_TABLES.includedToExcluded8Rows} />
      </section>

      <section aria-labelledby="tax-reduced-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-reduced-heading" className={guideHeadingClass}>
          {TAX_REDUCED.title}
        </h2>
        <p className={guideBodyClass}>{TAX_REDUCED.intro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {TAX_REDUCED.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={guideBodyClass}>{TAX_REDUCED.closing}</p>
      </section>

      <section aria-labelledby="tax-rounding-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-rounding-heading" className={guideHeadingClass}>
          {TAX_ROUNDING.title}
        </h2>
        <p className={guideBodyClass}>{TAX_ROUNDING.body}</p>
      </section>

      <section aria-labelledby="tax-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-mistakes-heading" className={guideHeadingClass}>
          {TAX_MISTAKES.title}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {TAX_MISTAKES.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

<CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />

      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/consumption-tax-calculator" />
    </>
  );
}
