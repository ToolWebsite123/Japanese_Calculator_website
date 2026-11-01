"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { UnitListbox } from "@/components/calculators/UnitListbox";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { formatYen } from "@/lib/format";
import {
  calcForward,
  calcRateFromPrices,
  calcReverse,
  type DiscountUnit,
  type RoundMode,
  type TaxMode,
} from "@/lib/calculators/discount-calc";

const DESCRIPTION =
  "定価からの割引、割引後の価格からの逆算、割引率の計算に対応。重ねがけ割引や消費税、端数処理も選べます。";

const INTRO =
  "割引計算をブラウザ上で行える無料ツールです。%オフや「○割引」から割引後の価格を求める計算、セール価格から元の定価を求める逆算、元の価格と割引後の価格から割引率を求める計算の、3種類に対応しています。「さらに○%オフ」の重ねがけ割引も計算でき、合計の割引率も表示します。消費税8％／10％を含む・含まないの切り替えや、端数の切り捨て・四捨五入・切り上げも選択できます。金額を入力すると結果はその場で表示されます。単位変換やパーセント計算とあわせて活用してください。計算はすべてブラウザ内で行われ、入力した金額がサーバーへ送信されることはありません。";

const HOW_TO = {
  title: "割引計算の使い方",
  steps: [
    {
      title: "計算の種類を選ぶ",
      body: "「定価から割引後の価格を計算」「割引後の価格から元の定価を逆算」「元の価格と割引後の価格から割引率を求める」の3種類から選びます。",
    },
    {
      title: "金額と割引を入力",
      body: "金額と割引の値を入力し、単位（％・割・円）を選びます。1割＝10％、3割＝30％です。「さらに○%オフ」がある場合は「重ねがけ」をオンにして2回目の割引も入力します。",
    },
    {
      title: "税と端数を設定",
      body: "税抜価格を入力した場合は消費税率（8％または10％）を選択。端数は切り捨て・四捨五入・切り上げから選べます。",
    },
    {
      title: "結果を確認する",
      body: "入力すると、割引額・割引後価格・（税抜時は）消費税・支払総額がその場で表示されます。「計算の内訳」で途中式も確認できます。",
    },
  ],
};

export const FAQ = {
  title: "割引価格の計算に関するよくある質問",
  items: [
    {
      question: "「割」と「％」の違いは？",
      answer:
        "「割（わり）」は日本独自の割合単位で、1割＝10％、3割＝30％、5割＝50％です。本ツールではどちらの単位で入力しても同じ結果になります。",
    },
    {
      question: "税抜と税込の違いは？",
      answer:
        "「税抜価格を入力」の場合、まず割引を適用してから消費税を加算し支払総額を算出します。「税込価格を入力」の場合はその金額に直接割引を適用します。",
    },
    {
      question: "逆算とは何ですか？",
      answer:
        "セール後の価格と割引率から元の定価を求める計算です。例：セール価格700円で30％割引の商品なら、定価は700÷（1−0.3）＝1,000円です。",
    },
    {
      question: "割引率はどうやって求めますか？",
      answer:
        "割引率（％）＝割引額÷元の価格×100です。例：定価12,800円が9,600円なら割引額は3,200円で、3,200÷12,800×100＝25％オフ（2.5割引）です。本ツールの「割引率を求める」で、元の価格と割引後の価格を入れるだけで計算できます。",
    },
    {
      question: "端数はどう処理されますか？",
      answer:
        "日本の小売の慣例に合わせ、既定は切り捨て（1円未満を切り捨て）です。必要に応じて四捨五入・切り上げに変更できます。",
    },
    {
      question: "円単位の値引きも計算できますか？",
      answer:
        "通常計算では単位を「円」に切り替えると「500円引き」のような固定額の値引きも計算できます。",
    },
    {
      question: "「20%オフ＋さらに10%オフ」は合計30%オフですか？",
      answer:
        "いいえ、28%オフになります。割引は続けて適用されるため、元の価格×0.8×0.9＝元の価格×0.72となり、割引率は28%です。2回目の割引は、1回目で値引きされた後の価格にかかるためです。",
    },
    {
      question: "重ねがけの割引はこのツールで計算できますか？",
      answer:
        "できます。「定価から割引後の価格を計算」で「さらに割引を追加（重ねがけ）」をオンにすると、2回目の割引（％または割）も入力でき、1回目・2回目の割引額と合計の割引率が表示されます。",
    },
    {
      question: "「半額」とは何%オフですか？",
      answer:
        "半額は50%オフ、つまり5割引と同じです。価格がちょうど半分になります。ちなみに「2割引」は20%オフで、価格は元の8割（80%）になります。",
    },
  ],
};

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideBodyClass = "mt-4 text-sm leading-relaxed text-text-secondary sm:text-base";
const tableWrapClass = "mt-4 overflow-x-auto";
const tableClass = "w-full border-collapse text-sm sm:text-base";
const thClass = "border-b border-border bg-surface-sunken px-3 py-2.5 text-left font-semibold text-text-primary";
const tdClass = "border-b border-border px-3 py-2.5 text-text-secondary";

type Mode = "forward" | "reverse" | "rate";

/** Rate (0-1) as a trimmed percent string: 0.28 -> "28％", 0.2857 -> "28.57％". */
function fmtRatePercent(rate: number): string {
  const v = Math.round(rate * 10000) / 100;
  return `${v}％`;
}

/** One-decimal number without a trailing .0: 30 -> "30", 2.5 -> "2.5". */
function fmtTenth(v: number): string {
  return Number.isInteger(v) ? `${v}` : v.toFixed(1);
}

type Calc<T> = { value: T | null; error: string | null };

function tryCalc<T>(fn: () => T): Calc<T> {
  try {
    return { value: fn(), error: null };
  } catch (e) {
    return { value: null, error: e instanceof Error ? e.message : "計算エラー" };
  }
}

export function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>("forward");
  const [round, setRound] = useState<RoundMode>("floor");

  // forward inputs
  const [original, setOriginal] = useState("10000");
  const [fwdDiscount, setFwdDiscount] = useState("30");
  const [fwdUnit, setFwdUnit] = useState<DiscountUnit>("percent");
  const [stacked, setStacked] = useState(false);
  const [secondDiscount, setSecondDiscount] = useState("10");
  const [secondUnit, setSecondUnit] = useState<"percent" | "wari">("percent");
  const [taxMode, setTaxMode] = useState<TaxMode>("excluded");
  const [taxRate, setTaxRate] = useState("0.10");

  // reverse inputs
  const [discounted, setDiscounted] = useState("7000");
  const [revDiscount, setRevDiscount] = useState("30");
  const [revUnit, setRevUnit] = useState<"percent" | "wari">("percent");

  // rate inputs
  const [rateOriginal, setRateOriginal] = useState("12800");
  const [rateSale, setRateSale] = useState("9600");

  const fwd = useMemo(
    () =>
      tryCalc(() =>
        calcForward({
          original: parseFloat(original) || 0,
          discountValue: parseFloat(fwdDiscount) || 0,
          discountUnit: fwdUnit,
          taxMode,
          taxRate: parseFloat(taxRate) || 0,
          round,
          ...(stacked
            ? {
                secondValue: parseFloat(secondDiscount) || 0,
                secondUnit,
              }
            : {}),
        }),
      ),
    [original, fwdDiscount, fwdUnit, taxMode, taxRate, round, stacked, secondDiscount, secondUnit],
  );

  const rev = useMemo(
    () =>
      tryCalc(() =>
        calcReverse({
          discountedPrice: parseFloat(discounted) || 0,
          discountValue: parseFloat(revDiscount) || 0,
          discountUnit: revUnit,
          round,
        }),
      ),
    [discounted, revDiscount, revUnit, round],
  );

  const rate = useMemo(
    () =>
      tryCalc(() =>
        calcRateFromPrices(parseFloat(rateOriginal) || 0, parseFloat(rateSale) || 0),
      ),
    [rateOriginal, rateSale],
  );

  const wariNote = useMemo(() => {
    if (mode === "forward" && fwdUnit === "wari")
      return `${fwdDiscount}割 = ${(parseFloat(fwdDiscount) || 0) * 10}％`;
    if (mode === "reverse" && revUnit === "wari")
      return `${revDiscount}割 = ${(parseFloat(revDiscount) || 0) * 10}％`;
    return null;
  }, [mode, fwdUnit, revUnit, fwdDiscount, revDiscount]);

  const activeError =
    mode === "forward" ? fwd.error : mode === "reverse" ? rev.error : rate.error;
  const fwdResult = fwd.value;
  const revResult = rev.value;
  const rateResult = rate.value;

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        割引計算機
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[500px]">
        <div className="space-y-2.5 sm:space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">計算の種類</span>
            <SelectWell
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="text-lg"
            >
              <option value="forward">定価 → 割引後の価格</option>
              <option value="reverse">割引後の価格 → 元の定価（逆算）</option>
              <option value="rate">元の価格と割引後の価格 → 割引率</option>
            </SelectWell>
          </label>

          {mode === "forward" && (
            <>
              <FormField
                label="定価（円）"
                type="number"
                min={0}
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                className="text-lg"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="割引の値"
                  type="number"
                  min={0}
                  step="0.01"
                  value={fwdDiscount}
                  onChange={(e) => setFwdDiscount(e.target.value)}
                  className="text-lg"
                />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-text-secondary">単位</span>
                  <UnitListbox
                    value={fwdUnit}
                    onChange={(v) => setFwdUnit(v as DiscountUnit)}
                    ariaLabel="単位"
                    options={[
                      { value: "percent", label: "Percent (%)" },
                      { value: "wari", label: "Wari (1 wari = 10%)" },
                      { value: "yen", label: "Yen (fixed amount off)" },
                    ]}
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 pt-1 text-sm font-medium text-text-secondary">
                <input
                  type="checkbox"
                  checked={stacked}
                  onChange={(e) => setStacked(e.target.checked)}
                  className="h-4 w-4 accent-[#5b4bc4]"
                />
                さらに割引を追加（重ねがけ）
              </label>
              {stacked && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="2回目の割引"
                    type="number"
                    min={0}
                    step="0.01"
                    value={secondDiscount}
                    onChange={(e) => setSecondDiscount(e.target.value)}
                    className="text-lg"
                  />
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-text-secondary">単位</span>
                    <UnitListbox
                      value={secondUnit}
                      onChange={(v) => setSecondUnit(v as "percent" | "wari")}
                      ariaLabel="2回目の割引の単位"
                      options={[
                        { value: "percent", label: "Percent (%)" },
                        { value: "wari", label: "Wari (1 wari = 10%)" },
                      ]}
                    />
                  </label>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-text-secondary">税の扱い</span>
                  <SelectWell
                    value={taxMode}
                    onChange={(e) => setTaxMode(e.target.value as TaxMode)}
                    className="text-lg"
                  >
                    <option value="excluded">税抜価格を入力（税を加算）</option>
                    <option value="included">税込価格を入力</option>
                    <option value="none">税を計算しない</option>
                  </SelectWell>
                </label>
                {taxMode === "excluded" && (
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-text-secondary">消費税率</span>
                    <SelectWell
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="text-lg"
                    >
                      <option value="0.10">10％</option>
                      <option value="0.08">8％（軽減税率）</option>
                    </SelectWell>
                  </label>
                )}
              </div>
            </>
          )}

          {mode === "reverse" && (
            <>
              <FormField
                label="割引後の価格（円）"
                type="number"
                min={0}
                value={discounted}
                onChange={(e) => setDiscounted(e.target.value)}
                className="text-lg"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="割引の値"
                  type="number"
                  min={0}
                  step="0.01"
                  value={revDiscount}
                  onChange={(e) => setRevDiscount(e.target.value)}
                  className="text-lg"
                />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-text-secondary">単位</span>
                  <UnitListbox
                    value={revUnit}
                    onChange={(v) => setRevUnit(v as "percent" | "wari")}
                    ariaLabel="単位"
                    options={[
                      { value: "percent", label: "Percent (%)" },
                      { value: "wari", label: "Wari (1 wari = 10%)" },
                    ]}
                  />
                </label>
              </div>
            </>
          )}

          {mode === "rate" && (
            <>
              <FormField
                label="元の価格（円）"
                type="number"
                min={0}
                value={rateOriginal}
                onChange={(e) => setRateOriginal(e.target.value)}
                className="text-lg"
              />
              <FormField
                label="割引後の価格（円）"
                type="number"
                min={0}
                value={rateSale}
                onChange={(e) => setRateSale(e.target.value)}
                className="text-lg"
              />
            </>
          )}

          {mode !== "rate" && (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">端数処理</span>
              <SelectWell
                value={round}
                onChange={(e) => setRound(e.target.value as RoundMode)}
                className="text-lg"
              >
                <option value="floor">切り捨て（既定・日本の小売慣例）</option>
                <option value="round">四捨五入</option>
                <option value="ceil">切り上げ</option>
              </SelectWell>
            </label>
          )}

          {wariNote && <p className="text-xs text-text-tertiary">{wariNote}</p>}
          {activeError && <p className="text-sm text-red-600">{activeError}</p>}

          {mode === "forward" && fwdResult && (
            <div translate="no" className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">割引額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(fwdResult.discountAmount)}
                    </div>
                  </div>
                  {fwdResult.secondDiscountAmount > 0 && (
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">2回目の割引額</div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {formatYen(fwdResult.secondDiscountAmount)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      {taxMode === "excluded" ? "割引後（税抜）" : "割引後価格"}
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(fwdResult.discountedBase)}
                    </div>
                  </div>
                  {fwdResult.secondDiscountAmount > 0 && (
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">合計の割引率</div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {fmtRatePercent(fwdResult.effectiveRate)}オフ
                      </div>
                    </div>
                  )}
                  {taxMode === "excluded" && (
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">消費税</div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {formatYen(fwdResult.taxAmount)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    {taxMode === "excluded" ? "支払総額（税込）" : "割引後価格"}
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(fwdResult.finalPrice)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  <p>
                    1. 割引額 = {formatYen(fwdResult.original)} ×{" "}
                    {fmtRatePercent(fwdResult.discountRate)} ={" "}
                    {formatYen(fwdResult.discountAmount)}
                  </p>
                  {fwdResult.secondDiscountAmount > 0 && (
                    <p>
                      2. 2回目の割引額 ={" "}
                      {formatYen(fwdResult.original - fwdResult.discountAmount)} ×{" "}
                      {fmtRatePercent(
                        fwdResult.original - fwdResult.discountAmount > 0
                          ? fwdResult.secondDiscountAmount /
                              (fwdResult.original - fwdResult.discountAmount)
                          : 0,
                      )}{" "}
                      = {formatYen(fwdResult.secondDiscountAmount)}
                    </p>
                  )}
                  <p>
                    {fwdResult.secondDiscountAmount > 0 ? "3" : "2"}. 割引後の価格 ={" "}
                    {formatYen(fwdResult.original)} −{" "}
                    {formatYen(
                      fwdResult.discountAmount + fwdResult.secondDiscountAmount,
                    )}{" "}
                    = {formatYen(fwdResult.discountedBase)}
                  </p>
                  {taxMode === "excluded" && (
                    <>
                      <p>
                        {fwdResult.secondDiscountAmount > 0 ? "4" : "3"}. 消費税 ={" "}
                        {formatYen(fwdResult.discountedBase)} ×{" "}
                        {(parseFloat(taxRate) * 100).toFixed(0)}％ ={" "}
                        {formatYen(fwdResult.taxAmount)}
                      </p>
                      <p>
                        {fwdResult.secondDiscountAmount > 0 ? "5" : "4"}. 支払総額 ={" "}
                        {formatYen(fwdResult.discountedBase)} +{" "}
                        {formatYen(fwdResult.taxAmount)} = {formatYen(fwdResult.finalPrice)}
                      </p>
                    </>
                  )}
                </SurfacePanel>
              </Divider>
            </div>
          )}

          {mode === "reverse" && revResult && (
            <div translate="no" className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">割引率</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {`${fmtRatePercent(revResult.discountRate)}（${fmtTenth(revResult.wariEquivalent)}割）`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">割引額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(revResult.discountAmount)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">元の定価</div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(revResult.originalPrice)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  <p>1. 定価 = 割引後価格 ÷ (1 − 割引率）</p>
                  <p>
                    2. {formatYen(revResult.discountedPrice)} ÷ (1 −{" "}
                    {fmtRatePercent(revResult.discountRate)}) ={" "}
                    {formatYen(revResult.originalPrice)}
                  </p>
                  <p>
                    3. 割引額 = {formatYen(revResult.originalPrice)} −{" "}
                    {formatYen(revResult.discountedPrice)} ={" "}
                    {formatYen(revResult.discountAmount)}
                  </p>
                </SurfacePanel>
              </Divider>
            </div>
          )}

          {mode === "rate" && rateResult && (
            <div translate="no" className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">割引額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(rateResult.discountAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">割引後の価格</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(rateResult.salePrice)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">割引率</div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {fmtTenth(rateResult.ratePercent)}％オフ（{fmtTenth(rateResult.rateWari)}割引）
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  <p>
                    1. 割引額 = {formatYen(rateResult.originalPrice)} −{" "}
                    {formatYen(rateResult.salePrice)} = {formatYen(rateResult.discountAmount)}
                  </p>
                  <p>
                    2. 割引率 = {formatYen(rateResult.discountAmount)} ÷{" "}
                    {formatYen(rateResult.originalPrice)} × 100 ={" "}
                    {fmtTenth(rateResult.ratePercent)}％
                  </p>
                </SurfacePanel>
              </Divider>
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">{DESCRIPTION}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/discount-calculation" />
      </p>

      <section aria-labelledby="discount-formula-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="discount-formula-heading" className={guideHeadingClass}>
          割引の計算式
        </h2>
        <p className={guideBodyClass}>
          割引後の価格 ＝ 元の価格 ×（1 − 割引率）
        </p>
        <p className={guideBodyClass}>
          割引額 ＝ 元の価格 × 割引率
        </p>
        <p className={guideBodyClass}>
          元の価格（逆算） ＝ 割引後の価格 ÷（1 − 割引率）
        </p>
        <p className={guideBodyClass}>
          割引率（％） ＝ 割引額 ÷ 元の価格 × 100
        </p>
        <p className={guideBodyClass}>
          「割」は日本の割合の単位で、1割＝10％、2割＝20％、3割＝30％です。「3割引」と「30%オフ」は同じ意味で、支払う価格は元の価格の7割（70%）になります。
        </p>
      </section>

      <section aria-labelledby="discount-example-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="discount-example-heading" className={guideHeadingClass}>
          割引の計算例
        </h2>
        <p className={guideBodyClass}>
          例）3,980円の30%オフ ＝ 3,980 × 0.7 ＝{" "}
          <strong className="text-text-primary">2,786円</strong>（割引額は1,194円）です。
        </p>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>計算</th>
                <th scope="col" className={thClass}>割引額</th>
                <th scope="col" className={thClass}>結果</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>3,980円の30%オフ</td>
                <td className={tdClass}>1,194円</td>
                <td className={tdClass}>2,786円</td>
              </tr>
              <tr>
                <td className={tdClass}>1,080円の10%オフ</td>
                <td className={tdClass}>108円</td>
                <td className={tdClass}>972円</td>
              </tr>
              <tr>
                <td className={tdClass}>10,000円の20%オフ → さらに10%オフ</td>
                <td className={tdClass}>2,000円＋800円（合計28%オフ）</td>
                <td className={tdClass}>7,200円</td>
              </tr>
              <tr>
                <td className={tdClass}>5,000円の20%オフ（税抜・消費税10%）</td>
                <td className={tdClass}>1,000円</td>
                <td className={tdClass}>税込4,400円</td>
              </tr>
              <tr>
                <td className={tdClass}>700円は30%オフ後の価格（逆算）</td>
                <td className={tdClass}>300円</td>
                <td className={tdClass}>元の定価1,000円</td>
              </tr>
              <tr>
                <td className={tdClass}>12,800円 → 9,600円（割引率を求める）</td>
                <td className={tdClass}>3,200円</td>
                <td className={tdClass}>25%オフ（2.5割引）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="discount-quick-table-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="discount-quick-table-heading" className={guideHeadingClass}>
          割引後の価格 早見表
        </h2>
        <p className={guideBodyClass}>
          よくある価格と割引率の組み合わせで、割引後の価格をまとめました（税は含みません）。
        </p>
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th scope="col" className={thClass}>元の価格</th>
                <th scope="col" className={thClass}>10%オフ</th>
                <th scope="col" className={thClass}>20%オフ</th>
                <th scope="col" className={thClass}>30%オフ</th>
                <th scope="col" className={thClass}>40%オフ</th>
                <th scope="col" className={thClass}>50%オフ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>1,000円</td>
                <td className={tdClass}>900円</td>
                <td className={tdClass}>800円</td>
                <td className={tdClass}>700円</td>
                <td className={tdClass}>600円</td>
                <td className={tdClass}>500円</td>
              </tr>
              <tr>
                <td className={tdClass}>3,000円</td>
                <td className={tdClass}>2,700円</td>
                <td className={tdClass}>2,400円</td>
                <td className={tdClass}>2,100円</td>
                <td className={tdClass}>1,800円</td>
                <td className={tdClass}>1,500円</td>
              </tr>
              <tr>
                <td className={tdClass}>5,000円</td>
                <td className={tdClass}>4,500円</td>
                <td className={tdClass}>4,000円</td>
                <td className={tdClass}>3,500円</td>
                <td className={tdClass}>3,000円</td>
                <td className={tdClass}>2,500円</td>
              </tr>
              <tr>
                <td className={tdClass}>10,000円</td>
                <td className={tdClass}>9,000円</td>
                <td className={tdClass}>8,000円</td>
                <td className={tdClass}>7,000円</td>
                <td className={tdClass}>6,000円</td>
                <td className={tdClass}>5,000円</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="discount-tax-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="discount-tax-heading" className={guideHeadingClass}>
          割引と消費税の順番
        </h2>
        <p className={guideBodyClass}>
          通常、消費税は割引後の金額にかかります。例）5,000円の20%オフ → 4,000円 → 税込（10%）で{" "}
          <strong className="text-text-primary">4,400円</strong> です。
        </p>
        <p className={guideBodyClass}>
          「税込価格から割引」なのか「税抜価格から割引」なのかで結果が変わるため、お店の表示を確認しましょう。この計算機では「税抜価格を入力」「税込価格を入力」の両方に対応しています。
        </p>
      </section>

      <section aria-labelledby="discount-stacked-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="discount-stacked-heading" className={guideHeadingClass}>
          重ねがけ割引（さらに○%オフ）の計算
        </h2>
        <p className={guideBodyClass}>
          セールの「30%オフから、さらに20%オフ」のような重ねがけ割引は、割引率を単純に足し算できません。2回目の割引は、1回目で値引きされた後の価格にかかるからです。合計の割引率は「1 −（1 − 1回目の割引率）×（1 − 2回目の割引率）」で求めます。
        </p>
        <p className={guideBodyClass}>
          例）10,000円の30%オフ → 7,000円、さらに20%オフ →{" "}
          <strong className="text-text-primary">5,600円</strong>。合計の割引率は50%ではなく{" "}
          <strong className="text-text-primary">44%オフ</strong> です。この計算機では、計算の種類で「定価から割引後の価格を計算」を選び、「さらに割引を追加（重ねがけ）」をオンにすると、重ねがけの結果と合計の割引率が表示されます。
        </p>
      </section>

      <section aria-labelledby="discount-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="discount-mistakes-heading" className={guideHeadingClass}>
          よくある間違い
        </h2>
        <p className={guideBodyClass}>
          <strong className="text-text-primary">1. 重ねがけを足し算してしまう</strong>
          ──「30%オフ＋さらに20%オフ」は50%オフではなく44%オフです（上の例を参照）。
        </p>
        <p className={guideBodyClass}>
          <strong className="text-text-primary">2. 税込価格に、もう一度税を足してしまう</strong>
          ──税込表示の価格にはすでに消費税が含まれています。税込価格を入力するときは「税込価格を入力」を選んでください。
        </p>
        <p className={guideBodyClass}>
          <strong className="text-text-primary">3. 「割」と「％」を取り違える</strong>
          ──「3割引」は30%オフのことで、3%オフではありません。支払う価格は元の7割です。
        </p>
        <p className={guideBodyClass}>
          <strong className="text-text-primary">4. 割引額と割引後の価格を混同する</strong>
          ──「3,000円引き」と「3,000円（割引後の価格）」はまったく違います。値札では、引かれる金額なのか支払う金額なのかを確認しましょう。
        </p>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />

      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/discount-calculation" />
    </>
  );
}
