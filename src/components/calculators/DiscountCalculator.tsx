"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { UnitListbox } from "@/components/calculators/UnitListbox";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { formatYen } from "@/lib/format";
import {
  calcForward,
  calcReverse,
  type DiscountUnit,
  type RoundMode,
  type TaxMode,
  type ForwardResult,
  type ReverseResult,
} from "@/lib/calculators/discount-calc";

const INTRO =
  "割引 計算をブラウザ上で行えるツールです。値引き後の販売価格を求める通常計算と、値引き後の価格から元の定価を逆算する二方向に対応。パーセント（％）だけでなく日本独自の「割（1割＝10％）」でも入力でき、消費税8％／10％を含む・含まないの切り替えや、端数の切り捨て・四捨五入・切り上げも選択できます。単位変換やパーセント計算とあわせて活用してください。";

const HOW_TO = {
  title: "割引 計算の使い方",
  steps: [
    {
      title: "計算方向を選ぶ",
      body: "「定価から割引後の価格を計算」または「割引後の価格から元の定価を逆算」を選びます。",
    },
    {
      title: "金額と割引を入力",
      body: "金額と割引の値を入力し、単位（％・割・円）を選びます。1割＝10％、3割＝30％です。",
    },
    {
      title: "税と端数を設定",
      body: "税抜価格を入力した場合は消費税率（8％または10％）を選択。端数は切り捨て・四捨五入・切り上げから選べます。",
    },
    {
      title: "割引後価格を計算する",
      body: "「計算する」を押すと、割引額・割引後価格・（税抜時は）消費税・支払総額が表示されます。",
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
      question: "端数はどう処理されますか？",
      answer:
        "日本の小売の慣例に合わせ、既定は切り捨て（1円未満を切り捨て）です。必要に応じて四捨五入・切り上げに変更できます。",
    },
    {
      question: "円単位の値引きも計算できますか？",
      answer:
        "通常計算では単位を「円」に切り替えると「500円引き」のような固定額の値引きも計算できます。",
    },
  ],
};

type Mode = "forward" | "reverse";

export function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>("forward");

  // shared
  const [round, setRound] = useState<RoundMode>("floor");

  // forward inputs
  const [original, setOriginal] = useState("1000");
  const [fwdDiscount, setFwdDiscount] = useState("30");
  const [fwdUnit, setFwdUnit] = useState<DiscountUnit>("percent");
  const [taxMode, setTaxMode] = useState<TaxMode>("excluded");
  const [taxRate, setTaxRate] = useState("0.10");

  // reverse inputs
  const [discounted, setDiscounted] = useState("700");
  const [revDiscount, setRevDiscount] = useState("30");
  const [revUnit, setRevUnit] = useState<"percent" | "wari">("percent");

  const [fwdResult, setFwdResult] = useState<ForwardResult | null>(null);
  const [revResult, setRevResult] = useState<ReverseResult | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      if (mode === "forward") {
        const r = calcForward({
          original: parseFloat(original) || 0,
          discountValue: parseFloat(fwdDiscount) || 0,
          discountUnit: fwdUnit,
          taxMode,
          taxRate: parseFloat(taxRate) || 0,
          round,
        });
        setFwdResult(r);
        setRevResult(null);
      } else {
        const r = calcReverse({
          discountedPrice: parseFloat(discounted) || 0,
          discountValue: parseFloat(revDiscount) || 0,
          discountUnit: revUnit,
          round,
        });
        setRevResult(r);
        setFwdResult(null);
      }
      setResultKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "計算エラー");
    }
  };

  const wariNote = useMemo(() => {
    if (mode === "forward" && fwdUnit === "wari")
      return `${fwdDiscount}割 = ${(parseFloat(fwdDiscount) || 0) * 10}％`;
    if (mode === "reverse" && revUnit === "wari")
      return `${revDiscount}割 = ${(parseFloat(revDiscount) || 0) * 10}％`;
    return null;
  }, [mode, fwdUnit, revUnit, fwdDiscount, revDiscount]);

  return (
    <>
      <CalculatorCard
        title="割引 計算"
        description="定価からの割引と、割引後価格からの逆算の両方に対応。％／割／円の指定、消費税、端数処理も選べます。"
      >
        <div className="space-y-6">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">計算方向</span>
            <SelectWell
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="text-lg"
            >
              <option value="forward">定価 → 割引後の価格</option>
              <option value="reverse">割引後の価格 → 元の定価（逆算）</option>
            </SelectWell>
          </label>

          {mode === "forward" ? (
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
          ) : (
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

          {wariNote && <p className="text-xs text-text-tertiary">{wariNote}</p>}

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {(fwdResult || revResult) && (
            <div key={`res-${resultKey}`} translate="no" className="space-y-6">
              {mode === "forward" && fwdResult ? (
                <>
                  <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-text-tertiary">割引額</div>
                        <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                          {formatYen(fwdResult.discountAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-tertiary">
                          {taxMode === "excluded" ? "割引後（税抜）" : "割引後価格"}
                        </div>
                        <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                          {formatYen(fwdResult.discountedBase)}
                        </div>
                      </div>
                      {taxMode === "excluded" && (
                        <div>
                          <div className="text-sm font-medium text-text-tertiary">消費税</div>
                          <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                            {formatYen(fwdResult.taxAmount)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-text-tertiary">割引率</div>
                        <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                          {`${(fwdResult.discountRate * 100).toFixed(2)}％（${fwdResult.wariEquivalent.toFixed(2)}割）`}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-brand/20 pt-4">
                      <div className="text-sm font-medium text-text-tertiary">
                        {taxMode === "excluded" ? "支払総額（税込）" : "最終価格"}
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
                        {(fwdResult.discountRate * 100).toFixed(2)}％ ={" "}
                        {formatYen(fwdResult.discountAmount)}
                      </p>
                      <p>
                        2. 割引後の価格 = {formatYen(fwdResult.original)} −{" "}
                        {formatYen(fwdResult.discountAmount)} ={" "}
                        {formatYen(fwdResult.discountedBase)}
                      </p>
                      {taxMode === "excluded" && (
                        <>
                          <p>
                            3. 消費税 = {formatYen(fwdResult.discountedBase)} ×{" "}
                            {(parseFloat(taxRate) * 100).toFixed(0)}％ ={" "}
                            {formatYen(fwdResult.taxAmount)}
                          </p>
                          <p>
                            4. 支払総額 = {formatYen(fwdResult.discountedBase)} +{" "}
                            {formatYen(fwdResult.taxAmount)} = {formatYen(fwdResult.finalPrice)}
                          </p>
                        </>
                      )}
                    </SurfacePanel>
                  </Divider>
                </>
              ) : mode === "reverse" && revResult ? (
                <>
                  <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-text-tertiary">割引率</div>
                        <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                          {`${(revResult.discountRate * 100).toFixed(2)}％（${revResult.wariEquivalent.toFixed(2)}割）`}
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
                      <p>1. 定価 = 割引後価格 ÷ (1 − 割引率)</p>
                      <p>
                        2. {formatYen(revResult.discountedPrice)} ÷ (1 −{" "}
                        {(revResult.discountRate * 100).toFixed(2)}％) ={" "}
                        {formatYen(revResult.originalPrice)}
                      </p>
                      <p>
                        3. 割引額 = {formatYen(revResult.originalPrice)} −{" "}
                        {formatYen(revResult.discountedPrice)} ={" "}
                        {formatYen(revResult.discountAmount)}
                      </p>
                    </SurfacePanel>
                  </Divider>
                </>
              ) : null}
            </div>
          )}
        </div>
      </CalculatorCard>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/discount-calculation" />
      </p>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/discount-calculation" />
    </>
  );
}
