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

// 令和6年度（2024年度）協会けんぽ 都道府県ごとの健康保険プレミアム率
const PREFECTURES = [
  { name: "北海道", rate: 10.21 },
  { name: "青森県", rate: 9.87 },
  { name: "岩手県", rate: 9.89 },
  { name: "宮城県", rate: 9.86 },
  { name: "秋田県", rate: 9.94 },
  { name: "山形県", rate: 10.01 },
  { name: "福島県", rate: 9.95 },
  { name: "茨城県", rate: 9.85 },
  { name: "栃木県", rate: 9.93 },
  { name: "群馬県", rate: 9.86 },
  { name: "埼玉県", rate: 9.78 },
  { name: "千葉県", rate: 9.87 },
  { name: "東京都", rate: 9.98 },
  { name: "神奈川県", rate: 10.02 },
  { name: "新潟県", rate: 9.77 },
  { name: "富山県", rate: 9.72 },
  { name: "石川県", rate: 9.81 },
  { name: "福井県", rate: 10.03 },
  { name: "山梨県", rate: 9.82 },
  { name: "長野県", rate: 9.74 },
  { name: "岐阜県", rate: 9.93 },
  { name: "静岡県", rate: 9.82 },
  { name: "愛知県", rate: 9.87 },
  { name: "三重県", rate: 9.77 },
  { name: "滋賀県", rate: 9.78 },
  { name: "京都府", rate: 10.04 },
  { name: "大阪府", rate: 10.34 },
  { name: "兵庫県", rate: 10.05 },
  { name: "奈良県", rate: 10.12 },
  { name: "和歌山県", rate: 10.1 },
  { name: "鳥取県", rate: 10.0 },
  { name: "島根県", rate: 10.05 },
  { name: "岡山県", rate: 10.08 },
  { name: "広島県", rate: 10.05 },
  { name: "山口県", rate: 10.19 },
  { name: "徳島県", rate: 10.35 },
  { name: "香川県", rate: 10.22 },
  { name: "愛媛県", rate: 10.04 },
  { name: "高知県", rate: 10.24 },
  { name: "福岡県", rate: 10.35 },
  { name: "佐賀県", rate: 10.51 },
  { name: "長崎県", rate: 10.27 },
  { name: "熊本県", rate: 10.16 },
  { name: "大分県", rate: 10.23 },
  { name: "宮崎県", rate: 10.1 },
  { name: "鹿児島県", rate: 10.26 },
  { name: "沖縄県", rate: 10.06 },
];

export function SocialInsuranceCalculator() {
  const { t } = useLocale();

  const [salary, setSalary] = useState<string>("300000");
  const [age, setAge] = useState<string>("30");
  const [prefectureIdx, setPrefectureIdx] = useState<number>(12); // Tokyo default
  const [includeBonus, setIncludeBonus] = useState<boolean>(false);
  const [bonus, setBonus] = useState<string>("500000");

  const [submittedResult, setSubmittedResult] = useState<any>(null);

  const handleCalculate = () => {
    const s = parseFloat(salary) || 0;
    const a = parseInt(age, 10) || 0;
    const b = includeBonus ? parseFloat(bonus) || 0 : 0;

    const pref = PREFECTURES[prefectureIdx];

    const healthRate = pref.rate / 100;
    const careRate = a >= 40 && a <= 64 ? 0.0159 : 0;
    const pensionRate = 0.183;
    const employmentRate = 0.006;

    const salaryHealth = Math.floor((s * healthRate) / 2);
    const bonusHealth = Math.floor((b * healthRate) / 2);
    const healthValue = salaryHealth + bonusHealth;

    const salaryCare = Math.floor((s * careRate) / 2);
    const bonusCare = Math.floor((b * careRate) / 2);
    const careValue = salaryCare + bonusCare;

    const salaryPension = Math.floor((s * pensionRate) / 2);
    const bonusPension = Math.floor((b * pensionRate) / 2);
    const pensionValue = salaryPension + bonusPension;

    const salaryEmployment = Math.floor((s * employmentRate) / 2);
    const bonusEmployment = Math.floor((b * employmentRate) / 2);
    const employmentValue = salaryEmployment + bonusEmployment;

    const totalDeduction = healthValue + careValue + pensionValue + employmentValue;

    setSubmittedResult({
      salary: s,
      bonus: b,
      salaryHealth,
      bonusHealth,
      salaryCare,
      bonusCare,
      salaryPension,
      bonusPension,
      salaryEmployment,
      bonusEmployment,
      healthValue,
      healthRate,
      careValue,
      careRate,
      pensionValue,
      pensionRate,
      employmentValue,
      employmentRate,
      totalDeduction,
      prefName: pref.name,
    });
  };

  return (
    <>
      <CalculatorCard
        title={t.socialInsurancePage?.title || "社会保険プレミアム計算"}
        description={
          t.socialInsurancePage?.description ||
          "健康保険・厚生年金などの社会保険プレミアムを計算します。"
        }
      >
        <div className="space-y-6">
          <FormField
            label="月額給与（標準報酬月額）"
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

          {submittedResult && (
            <>
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      健康保険プレミアム (<span>{submittedResult.prefName}</span>)
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(submittedResult.healthValue)}
                    </div>
                  </div>
                  {submittedResult.careRate > 0 && (
                    <div>
                      <div className="text-sm font-medium text-text-tertiary">
                        介護保険プレミアム (40〜64歳)
                      </div>
                      <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                        {formatYen(submittedResult.careValue)}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">
                      厚生年金保険プレミアム
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(submittedResult.pensionValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">雇用保険プレミアム</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(submittedResult.employmentValue)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    合計控除額（月額目安）
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(submittedResult.totalDeduction)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h3 className="mb-4 text-xl font-semibold text-text-primary">計算のステップ</h3>
                <SurfacePanel className="space-y-4 text-sm text-text-secondary animate-in fade-in">
                  <div>
                    <p className="font-medium text-text-primary mb-2">1. 健康保険プレミアム</p>
                    {submittedResult.bonus > 0 ? (
                      <div className="space-y-1">
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">給与:</span>
                          <span>{submittedResult.salary.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>
                            <span>{Number((submittedResult.healthRate * 100).toFixed(2))}</span>
                            <span>%</span>
                          </span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.salaryHealth.toLocaleString()}</span>
                        </MathEq>
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                          <span>{submittedResult.bonus.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>
                            <span>{Number((submittedResult.healthRate * 100).toFixed(2))}</span>
                            <span>%</span>
                          </span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.bonusHealth.toLocaleString()}</span>
                        </MathEq>
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">合計:</span>
                          <span>{submittedResult.salaryHealth.toLocaleString()}</span>
                          <MathOp op="+" />
                          <span>{submittedResult.bonusHealth.toLocaleString()}</span>
                          <MathOp op="=" />
                          <span className="font-bold text-text-primary">
                            {submittedResult.healthValue.toLocaleString()}
                          </span>
                        </MathEq>
                      </div>
                    ) : (
                      <MathEq>
                        <span>{submittedResult.salary.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>
                          <span>{Number((submittedResult.healthRate * 100).toFixed(2))}</span>
                          <span>%</span>
                        </span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{submittedResult.healthValue.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  {submittedResult.careRate > 0 && (
                    <div>
                      <p className="font-medium text-text-primary mb-2">
                        2. 介護保険プレミアム (年齢40〜64歳)
                      </p>
                      {submittedResult.bonus > 0 ? (
                        <div className="space-y-1">
                          <MathEq>
                            <span className="text-text-tertiary text-xs mr-2">給与:</span>
                            <span>{submittedResult.salary.toLocaleString()}</span>
                            <MathOp op="×" />
                            <span>1.59%</span>
                            <MathOp op="÷" />
                            <span>2</span>
                            <MathOp op="=" />
                            <span>{submittedResult.salaryCare.toLocaleString()}</span>
                          </MathEq>
                          <MathEq>
                            <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                            <span>{submittedResult.bonus.toLocaleString()}</span>
                            <MathOp op="×" />
                            <span>1.59%</span>
                            <MathOp op="÷" />
                            <span>2</span>
                            <MathOp op="=" />
                            <span>{submittedResult.bonusCare.toLocaleString()}</span>
                          </MathEq>
                        </div>
                      ) : (
                        <MathEq>
                          <span>{submittedResult.salary.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>1.59%</span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.careValue.toLocaleString()}</span>
                        </MathEq>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-text-primary mb-2">3. 厚生年金保険プレミアム</p>
                    {submittedResult.bonus > 0 ? (
                      <div className="space-y-1">
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">給与:</span>
                          <span>{submittedResult.salary.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>18.3%</span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.salaryPension.toLocaleString()}</span>
                        </MathEq>
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                          <span>{submittedResult.bonus.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>18.3%</span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.bonusPension.toLocaleString()}</span>
                        </MathEq>
                      </div>
                    ) : (
                      <MathEq>
                        <span>{submittedResult.salary.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>18.3%</span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{submittedResult.pensionValue.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-text-primary mb-2">
                      4. 雇用保険プレミアム (一般の事業)
                    </p>
                    {submittedResult.bonus > 0 ? (
                      <div className="space-y-1">
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">給与:</span>
                          <span>{submittedResult.salary.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>0.6%</span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.salaryEmployment.toLocaleString()}</span>
                        </MathEq>
                        <MathEq>
                          <span className="text-text-tertiary text-xs mr-2">賞与:</span>
                          <span>{submittedResult.bonus.toLocaleString()}</span>
                          <MathOp op="×" />
                          <span>0.6%</span>
                          <MathOp op="÷" />
                          <span>2</span>
                          <MathOp op="=" />
                          <span>{submittedResult.bonusEmployment.toLocaleString()}</span>
                        </MathEq>
                      </div>
                    ) : (
                      <MathEq>
                        <span>{submittedResult.salary.toLocaleString()}</span>
                        <MathOp op="×" />
                        <span>0.6%</span>
                        <MathOp op="÷" />
                        <span>2</span>
                        <MathOp op="=" />
                        <span>{submittedResult.employmentValue.toLocaleString()}</span>
                      </MathEq>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                    <p className="font-medium text-text-primary mb-2">5. 合計控除額</p>
                    <MathEq>
                      <span>{submittedResult.healthValue.toLocaleString()}</span>
                      {submittedResult.careRate > 0 && (
                        <>
                          <MathOp op="+" />
                          <span>{submittedResult.careValue.toLocaleString()}</span>
                        </>
                      )}
                      <MathOp op="+" />
                      <span>{submittedResult.pensionValue.toLocaleString()}</span>
                      <MathOp op="+" />
                      <span>{submittedResult.employmentValue.toLocaleString()}</span>
                      <MathOp op="=" />
                      <span className="font-bold text-brand">
                        {submittedResult.totalDeduction.toLocaleString()}
                      </span>
                    </MathEq>
                  </div>
                </SurfacePanel>
              </Divider>
            </>
          )}

          <p className="text-xs text-text-tertiary text-center mt-6">
            This is an estimated calculation. Please consult a professional for exact figures.
          </p>
        </div>
      </CalculatorCard>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
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
