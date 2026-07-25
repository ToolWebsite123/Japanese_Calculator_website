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
  calcIncomeTax,
  type EmploymentType,
  type IncomeTaxResult,
} from "@/lib/calculators/income-tax";

const INTRO =
  "所得税 計算を、年収と雇用形態（会社員・パート／個人事業主）から素早く見積もれるツールです。2025年改正の給与所得控除・基礎控除、所得税の速算表、復興特別所得税（2.1%）に対応。社会保険料控除やその他の所得控除も任意で入力でき、課税所得・所得税・復興特別所得税・納税額合計を段階的に表示します。社会保険料計算や割引 計算とあわせてご活用ください。";

const HOW_TO = {
  title: "所得税 計算の使い方",
  steps: [
    { title: "年収（額面）を入力する", body: "年間の総支給額（額面）を円で入力します。個人事業主の方は経費を差し引いた所得を入力してください。" },
    { title: "雇用形態を選ぶ", body: "会社員・パート／アルバイトの場合は「会社員」、個人事業主の方は「個人事業主」を選択します。" },
    { title: "控除額を入力（任意）", body: "社会保険料控除額と、その他の所得控除（生命保険料控除・医療費控除等）があれば入力します。不明な場合は0のままで概算できます。" },
    { title: "所得税額を計算する", body: "「計算する」を押すと、給与所得控除・給与所得・基礎控除・課税所得・所得税・復興特別所得税・納税額合計が表示されます。" },
  ],
};

export const FAQ = {
  title: "所得税の計算に関するよくある質問",
  items: [
    { question: "給与所得控除とは？", answer: "会社員・パート・アルバイトなど給与所得者に一律で認められる控除です。年収に応じて計算式が変わり、2025年改正では最低額が65万円に引き上げられました。" },
    { question: "基礎控除とは？", answer: "すべての納税者に認められる基本的な所得控除です。2025年以降は合計所得金額に応じて段階的に変動し、132万円以下では95万円、多くの給与所得者では58万円〜88万円となります。" },
    { question: "所得控除と税額控除の違いは？", answer: "所得控除は課税所得を計算する前に所得から差し引くもの（基礎控除・社会保険料控除など）、税額控除は算出された税額から直接差し引くもの（住宅ローン控除など）です。本ツールでは所得控除のみ扱います。" },
    { question: "復興特別所得税はなぜ加算されるの？", answer: "東日本大震災からの復興財源を確保するために、所得税額の2.1%が上乗せされる税金です。2013年から2037年までの各年分に適用されます。" },
    { question: "計算結果は正確ですか？", answer: "本ツールは概算であり、扶養控除・医療費控除・住宅ローン控除など個別事情は反映されません。正確な税額は年末調整・確定申告や税理士にご確認ください。" },
  ],
};

export function IncomeTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState("6000000");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("employee");
  const [socialInsurance, setSocialInsurance] = useState("0");
  const [otherDeductions, setOtherDeductions] = useState("0");
  const [result, setResult] = useState<IncomeTaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      const r = calcIncomeTax({
        annualIncome: parseFloat(annualIncome) || 0,
        employmentType,
        socialInsurance: parseFloat(socialInsurance) || 0,
        otherDeductions: parseFloat(otherDeductions) || 0,
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "計算エラー");
      setResult(null);
    }
  };

  return (
    <>
      <CalculatorCard
        title="所得税 計算"
        description="年収と雇用形態から所得税・復興特別所得税・納税額合計を概算します。2025年改正の給与所得控除・基礎控除に対応。"
      >
        <div className="space-y-6">
          <FormField
            label="年収（円）"
            type="number"
            min={0}
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            className="text-lg"
          />

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">雇用形態</span>
            <SelectWell
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
              className="text-lg"
            >
              <option value="employee">会社員・パート／アルバイト</option>
              <option value="self">個人事業主</option>
            </SelectWell>
          </label>

          {employmentType === "self" && (
            <p className="text-xs text-text-tertiary">
              個人事業主の方は、実際は経費を差し引いた金額を「年収」欄に入力してください。
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="社会保険料控除額（円・任意）"
              type="number"
              min={0}
              value={socialInsurance}
              onChange={(e) => setSocialInsurance(e.target.value)}
              className="text-lg"
            />
            <FormField
              label="その他控除額（円・任意）"
              type="number"
              min={0}
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              className="text-lg"
            />
          </div>

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result && (
            <div className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {employmentType === "employee" && (
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">給与所得控除</div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {formatYen(result.employmentDeduction)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      {employmentType === "employee" ? "給与所得" : "所得"}
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.employmentIncome)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">基礎控除</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.basicDeduction)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">課税所得</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.taxableIncome)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">所得税</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.incomeTax)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">復興特別所得税</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.reconstructionTax)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">納税額合計</div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(result.totalTax)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  {employmentType === "employee" && (
                    <>
                      <p>1. 給与所得控除 = {formatYen(result.employmentDeduction)}（2025年改正の給与所得控除表より）</p>
                      <p>2. 給与所得 = {formatYen(result.annualIncome)} − {formatYen(result.employmentDeduction)} = {formatYen(result.employmentIncome)}</p>
                    </>
                  )}
                  <p>
                    {employmentType === "employee" ? "3" : "1"}. 基礎控除 = {formatYen(result.basicDeduction)}（合計所得金額に応じて算定）
                  </p>
                  <p>
                    {employmentType === "employee" ? "4" : "2"}. 課税所得 = {formatYen(result.employmentIncome)} − {formatYen(result.basicDeduction)} − {formatYen(result.socialInsurance)} − {formatYen(result.otherDeductions)} = {formatYen(result.taxableIncome)}（1,000円未満切り捨て）
                  </p>
                  <p>
                    {employmentType === "employee" ? "5" : "3"}. 所得税 = 速算表より {formatYen(result.incomeTax)}
                  </p>
                  <p>
                    {employmentType === "employee" ? "6" : "4"}. 復興特別所得税 = {formatYen(result.incomeTax)} × 2.1％ = {formatYen(result.reconstructionTax)}
                  </p>
                  <p>
                    {employmentType === "employee" ? "7" : "5"}. 納税額合計 = {formatYen(result.incomeTax)} + {formatYen(result.reconstructionTax)} = {formatYen(result.totalTax)}
                  </p>
                </SurfacePanel>
              </Divider>
            </div>
          )}

          <p className="text-xs leading-relaxed text-text-tertiary">
            ※ 本ツールの結果は概算です。実際の税額は医療費控除・扶養控除・住宅ローン控除など個別の事情によって変わります。復興特別所得税は2037年までの各年分に適用されます。正確な金額は年末調整・確定申告、または税理士にご確認ください。
          </p>
        </div>
      </CalculatorCard>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/income-tax-calculation" />
      </p>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/income-tax-calculation" />
    </>
  );
}
