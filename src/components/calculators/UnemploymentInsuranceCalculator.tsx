"use client";

import { useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { formatYen } from "@/lib/format";
import {
  calculateUnemployment,
  AGE_OPTIONS,
  TENURE_OPTIONS,
  REASON_OPTIONS,
  type AgeBracket,
  type TenureBracket,
  type LeaveReason,
  type UnemploymentResult,
} from "@/lib/calculators/unemployment-insurance";

const INTRO =
  "失業保険 計算（雇用保険 基本手当）を、直近6ヶ月の賃金合計・年齢・被保険者期間・離職理由から自動で行うツールです。賃金日額と基本手当日額、所定給付日数、受給総額の目安を素早く確認できます。関連する社会保険料計算や利息計算も併せてご活用ください。";

const HOW_TO = {
  title: "失業保険 計算の手順",
  steps: [
    {
      title: "6ヶ月の賃金合計を入力",
      body: "離職前6ヶ月間に支払われた賃金（賞与を除く）の合計額を円単位で入力します。",
    },
    {
      title: "年齢区分を選択",
      body: "離職日時点の年齢区分（29以下／30～34／35～44／45～59／60～64／65以上）を選びます。",
    },
    {
      title: "被保険者期間を選択",
      body: "雇用保険の被保険者であった期間（1年未満／1～5年／5～10年／10～20年／20年以上）を選びます。",
    },
    {
      title: "離職理由を選択",
      body: "自己都合・会社都合・有期雇用未更新・正当な理由のある自己都合・定年退職から該当するものを選び、計算します。",
    },
  ],
};

export const FAQ = {
  title: "失業保険（雇用保険）の受給に関するよくある質問",
  items: [
    {
      question: "この計算結果はそのまま支給されますか？",
      answer:
        "本ツールは令和7年8月1日の公式レートに基づく目安です。正式な支給額はハローワークの決定に従います。",
    },
    {
      question: "自己都合退職ではいつから受給できますか？",
      answer:
        "受給資格決定日から7日間の待期期間の後、原則1ヶ月の給付制限期間を経て支給が開始されます。",
    },
    {
      question: "会社都合退職の場合はどうなりますか？",
      answer:
        "特定受給資格者となり、給付制限はなく、7日間の待期後すぐに支給が始まります。所定給付日数も自己都合より長くなります。",
    },
    {
      question: "65歳以上でも失業保険は受け取れますか？",
      answer:
        "65歳以上は「高年齢求職者給付金」として一時金で支給されます。被保険者期間1年未満で30日分、1年以上で50日分の基本手当相当額です。",
    },
    {
      question: "賃金日額とは何ですか？",
      answer:
        "離職前6ヶ月間の賃金合計を180で割った金額で、基本手当日額の算定基礎となります。年齢ごとに上限額が定められています。",
    },
  ],
};

export function UnemploymentInsuranceCalculator() {
  const [wage, setWage] = useState<string>("1800000");
  const [age, setAge] = useState<AgeBracket>("30-34");
  const [tenure, setTenure] = useState<TenureBracket>("5-10");
  const [reason, setReason] = useState<LeaveReason>("company");
  const [result, setResult] = useState<UnemploymentResult | null>(null);
  const [resultKey, setResultKey] = useState(0);

  const handleCalculate = () => {
    const total = parseFloat(wage) || 0;
    setResult(calculateUnemployment({ sixMonthWageTotal: total, age, tenure, reason }));
    setResultKey((k) => k + 1);
  };

  return (
    <>
      <CalculatorCard compact maxWidthClass="max-w-[500px]">
        <div className="space-y-2.5 sm:space-y-3">
          <FormField
            label="離職前6ヶ月の賃金合計（円）"
            type="number"
            min={0}
            value={wage}
            onChange={(e) => setWage(e.target.value)}
            className="text-lg"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">年齢区分</span>
              <SelectWell
                value={age}
                onChange={(e) => setAge(e.target.value as AgeBracket)}
                className="text-lg"
              >
                {AGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </SelectWell>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">被保険者期間</span>
              <SelectWell
                value={tenure}
                onChange={(e) => setTenure(e.target.value as TenureBracket)}
                className="text-lg"
              >
                {TENURE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </SelectWell>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">離職理由</span>
            <SelectWell
              value={reason}
              onChange={(e) => setReason(e.target.value as LeaveReason)}
              className="text-lg"
            >
              {REASON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectWell>
          </label>

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          {result && (
            <div key={`res-${resultKey}`} translate="no" className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">賃金日額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.wageDaily)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">基本手当日額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.benefitDaily)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      {result.isLumpSum ? "支給日数（一時金）" : "所定給付日数"}
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {result.prescribedDays}日
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      月あたりの受給金額（目安）
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.monthlyBenefit)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">受給総額（目安）</div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(result.totalBenefit)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  <p>
                    1. 賃金日額 = 6ヶ月賃金合計 ÷ 180 = {formatYen(result.wageDailyRaw)}
                    （上下限適用後：{formatYen(result.wageDaily)}）
                  </p>
                  <p>
                    2. 基本手当日額 = 賃金日額 × 給付率{(result.benefitRate * 100).toFixed(1)}% ={" "}
                    {formatYen(result.benefitDaily)}
                  </p>
                  <p>
                    3. 所定給付日数 = {result.prescribedDays}
                    日（年齢・被保険者期間・離職理由による）
                  </p>
                  <p>
                    4. 受給総額 = {formatYen(result.benefitDaily)} × {result.prescribedDays}日 ={" "}
                    {formatYen(result.totalBenefit)}
                  </p>
                </SurfacePanel>
              </Divider>

              {result.notes.length > 0 && (
                <SurfacePanel className="mt-4 space-y-1 text-xs text-text-tertiary">
                  {result.notes.map((n, i) => (
                    <p key={i}>※ {n}</p>
                  ))}
                </SurfacePanel>
              )}
            </div>
          )}

          <p className="text-xs text-text-tertiary text-center mt-6">
            令和7年8月1日改定の公式レートに基づく概算です。正式な支給額はハローワークの決定に従います。
          </p>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl dark:text-[#d6ccf0]">
          失業保険 計算
        </h1>
        <p className="text-sm text-text-secondary sm:text-base">
          6ヶ月の賃金合計・年齢・被保険者期間・離職理由から、基本手当日額と受給総額を計算します。
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/unemployment-insurance-calculation" />
      </p>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/unemployment-insurance-calculation" />
    </>
  );
}
