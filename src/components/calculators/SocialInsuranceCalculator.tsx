"use client";

import { useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { useLocale } from "@/context/LocaleContext";
import { formatYen } from "@/lib/format";
import { MathEq, MathOp } from "@/components/ui/MathDisplay";
import {
  PREFECTURES,
  RATES_BASIS_LABEL,
  calcSocialInsurance,
  type SocialInsuranceResult,
} from "@/lib/calculators/social-insurance";

function percentLabel(rate: number): string {
  return `${Number((rate * 100).toFixed(2))}%`;
}

export function SocialInsuranceCalculator() {
  const { t } = useLocale();

  const [salary, setSalary] = useState<string>("300000");
  const [age, setAge] = useState<string>("30");
  const [prefectureIdx, setPrefectureIdx] = useState<number>(12); // Tokyo default
  const [includeBonus, setIncludeBonus] = useState<boolean>(false);
  const [bonus, setBonus] = useState<string>("500000");

  const [submittedResult, setSubmittedResult] = useState<SocialInsuranceResult | null>(null);

  const handleCalculate = () => {
    const s = parseFloat(salary) || 0;
    const a = parseInt(age, 10) || 0;
    const b = includeBonus ? parseFloat(bonus) || 0 : 0;

    setSubmittedResult(
      calcSocialInsurance({ monthlySalary: s, bonus: b, age: a, prefectureIndex: prefectureIdx }),
    );
  };

  const r = submittedResult;

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.socialInsurancePage?.title || "社会保険料 計算"}
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[500px]">
        <div className="space-y-2.5 sm:space-y-3">
          <FormField
            label="月額給与（報酬月額）"
            type="number"
            min={0}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="text-lg"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="年齢"
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="text-lg"
            />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">都道府県</span>
              <SelectWell
                value={prefectureIdx}
                onChange={(e) => setPrefectureIdx(Number(e.target.value))}
                className="text-lg"
              >
                {PREFECTURES.map((p, idx) => (
                  <option key={p.name} value={idx}>
                    {p.name}
                  </option>
                ))}
              </SelectWell>
            </label>
          </div>

          <label className="flex items-center space-x-3 text-sm font-medium text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={includeBonus}
              onChange={(e) => setIncludeBonus(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            <span>賞与（ボーナス）を含める</span>
          </label>

          {includeBonus && (
            <FormField
              label="賞与（ボーナス）金額"
              type="number"
              min={0}
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="text-lg animate-in fade-in slide-in-from-top-2"
            />
          )}

          <PrimaryButton onClick={handleCalculate}>
            {t.common.calculate || "計算する"}
          </PrimaryButton>

          <p className="text-xs leading-relaxed text-text-tertiary">{RATES_BASIS_LABEL}</p>

          {r && (
            <>
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      健康保険プレミアム (<span>{r.prefName}</span>)
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(r.healthValue)}
                    </div>
                  </div>
                  {r.careRate > 0 && (
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">
                        介護保険プレミアム (40〜64歳)
                      </div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {formatYen(r.careValue)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      子ども・子育て支援金
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(r.childValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      厚生年金保険プレミアム
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(r.pensionValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">雇用保険プレミアム</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(r.employmentValue)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    合計控除額（月額目安）
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(r.totalDeduction)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">計算のステップ</h3>
                <SurfacePanel className="space-y-4 text-sm text-text-secondary animate-in fade-in">
                  <p>
                    標準報酬月額（健康保険）: {r.standardMonthlyHealth.toLocaleString()}円 /
                    標準報酬月額（厚生年金）: {r.standardMonthlyPension.toLocaleString()}円
                    {r.bonus > 0 && (
                      <>
                        {" "}
                        / 標準賞与額（健康保険）: {r.standardBonusHealth.toLocaleString()}円 /
                        標準賞与額（厚生年金）: {r.standardBonusPension.toLocaleString()}円
                      </>
                    )}
                  </p>

                  <div>
                    <p className="font-medium text-text-primary mb-2">健康保険プレミアム</p>
                    <MathEq>
                      <span className="text-text-tertiary text-xs mr-2">給与:</span>
                      <span>{r.standardMonthlyHealth.toLocaleString()}</span>
                      <MathOp op="×" />
                      <span>{percentLabel(r.healthRate)}</span>
                      <MathOp op="÷" />
                      <span>2</span>
                      <MathOp op="=" />
                      <span>{r.salaryHealth.toLocaleString()}</span>
                    </MathEq>
                    {r.bonus > 0 && (
                      <MathEq>
                        <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                        <span>{r.standardBonusHealth.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>{percentLabel(r.healthRate)}</span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{r.bonusHealth.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  {r.careRate > 0 && (
                    <div>
                      <p className="font-medium text-text-primary mb-2">
                        介護保険プレミアム (年齢40〜64歳)
                      </p>
                      <MathEq>
                        <span className="text-text-tertiary text-xs mr-2">給与:</span>
                        <span>{r.standardMonthlyHealth.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>{percentLabel(r.careRate)}</span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{r.salaryCare.toLocaleString()}</span>
                      </MathEq>
                      {r.bonus > 0 && (
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                          <span>{r.standardBonusHealth.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>{percentLabel(r.careRate)}</span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{r.bonusCare.toLocaleString()}</span>
                        </MathEq>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-text-primary mb-2">子ども・子育て支援金</p>
                    <MathEq>
                      <span className="text-text-tertiary text-xs mr-2">給与:</span>
                      <span>{r.standardMonthlyHealth.toLocaleString()}</span>
                      <MathOp op="×" />
                      <span>{percentLabel(r.childRate)}</span>
                      <MathOp op="÷" />
                      <span>2</span>
                      <MathOp op="=" />
                      <span>{r.salaryChild.toLocaleString()}</span>
                    </MathEq>
                    {r.bonus > 0 && (
                      <MathEq>
                        <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                        <span>{r.standardBonusHealth.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>{percentLabel(r.childRate)}</span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{r.bonusChild.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-text-primary mb-2">厚生年金保険プレミアム</p>
                    <MathEq>
                      <span className="text-text-tertiary text-xs mr-2">給与:</span>
                      <span>{r.standardMonthlyPension.toLocaleString()}</span>
                      <MathOp op="×" />
                      <span>{percentLabel(r.pensionRate)}</span>
                      <MathOp op="÷" />
                      <span>2</span>
                      <MathOp op="=" />
                      <span>{r.salaryPension.toLocaleString()}</span>
                    </MathEq>
                    {r.bonus > 0 && (
                      <MathEq>
                        <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                        <span>{r.standardBonusPension.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>{percentLabel(r.pensionRate)}</span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{r.bonusPension.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-text-primary mb-2">
                      雇用保険プレミアム (一般の事業・本人負担、折半ではありません)
                    </p>
                    <MathEq>
                      <span className="text-text-tertiary text-xs mr-2">給与:</span>
                      <span>{r.salary.toLocaleString()}</span>
                      <MathOp op="×" />
                      <span>{percentLabel(r.employmentRate)}</span>
                      <MathOp op="=" />
                      <span>{r.salaryEmployment.toLocaleString()}</span>
                    </MathEq>
                    {r.bonus > 0 && (
                      <MathEq>
                        <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                        <span>{r.bonus.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>{percentLabel(r.employmentRate)}</span>
                        <MathOp op="=" />
                        <span>{r.bonusEmployment.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                    <p className="font-medium text-text-primary mb-2">合計控除額</p>
                    <MathEq>
                      <span>{r.healthValue.toLocaleString()}</span>
                      {r.careRate > 0 && (
                        <>
                          <MathOp op="+" />
                          <span>{r.careValue.toLocaleString()}</span>
                        </>
                      )}
                      <MathOp op="+" />
                      <span>{r.childValue.toLocaleString()}</span>
                      <MathOp op="+" />
                      <span>{r.pensionValue.toLocaleString()}</span>
                      <MathOp op="+" />
                      <span>{r.employmentValue.toLocaleString()}</span>
                      <MathOp op="=" />
                      <span className="font-bold text-brand">{r.totalDeduction.toLocaleString()}</span>
                    </MathEq>
                  </div>
                </SurfacePanel>
              </Divider>
            </>
          )}

          <p className="text-xs text-text-tertiary text-center mt-6">
            これは概算計算です。正確な金額については専門家または日本年金機構・協会けんぽにご確認ください。
          </p>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.socialInsurancePage?.description || "健康保険・厚生年金などの社会保険料を計算します。"}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        {t.socialInsurancePage?.introParagraph && (
          <LinkedText
            text={t.socialInsurancePage.introParagraph}
            activeHref="/social-insurance-calculator"
          />
        )}
      </p>

      {t.socialInsurancePage?.howToTitle && t.socialInsurancePage?.howToSteps && (
        <CalculatorHowToSection
          title={t.socialInsurancePage.howToTitle}
          steps={t.socialInsurancePage.howToSteps}
        />
      )}

      {t.socialInsurancePage?.faqTitle && t.socialInsurancePage?.faqItems && (
        <CalculatorFaqSection
          title={t.socialInsurancePage.faqTitle}
          items={t.socialInsurancePage.faqItems}
        />
      )}
      <RelatedCalculators activeHref="/social-insurance-calculator" />
    </>
  );
}
