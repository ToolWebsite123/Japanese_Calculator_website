"use client";

import { useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import {
  SurfacePanel,
  Divider,
  PrimaryButton,
} from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { formatYen } from "@/lib/format";
import {
  calcFurusatoNozei,
  type DependentCategory,
  type FurusatoResult,
} from "@/lib/calculators/furusato-nozei";

const INTRO =
  "ふるさと納税の控除上限額を、年収・家族構成・社会保険料から正確に計算できるツールです。競合サイトの家族タイプ別の早見表とは異なり、扶養家族の年齢区分（16歳未満／16〜18歳／19〜22歳（特定扶養）／23歳以上／70歳以上）を1人単位で入力し、住民税所得割額と所得税の限界税率をもとに公式の計算式で寄付上限の目安を算出します。所得税 計算や社会保険料計算と併せてご活用ください。";

const HOW_TO = {
  title: "ふるさと納税 控除上限額の計算手順",
  steps: [
    { title: "世帯の年収を入力する", body: "年間の総支給額（額面）を円で入力します。" },
    { title: "配偶者控除の有無を選ぶ", body: "配偶者控除の対象となる配偶者がいる場合はチェックします。" },
    { title: "扶養している家族の人数を入力", body: "簡易計算では扶養親族を16歳未満／16〜18歳／19〜22歳（特定扶養）／23歳以上／70歳以上の5区分でまとめて数えます。区分ごとの人数だけで上限額の目安が出せます。" },
    { title: "社会保険料控除額（任意）", body: "源泉徴収票の社会保険料等の金額を入力します。未入力の場合は年収×15％で自動見積もりします。" },
    { title: "控除上限額を計算する", body: "給与所得・住民税所得割額・所得税率・控除上限額（寄付上限の目安）が表示されます。" },
  ],
};

export const FAQ = {
  title: "ふるさと納税に関するよくある質問",
  items: [
    { question: "ふるさと納税とは？", answer: "自分が選んだ自治体に寄付を行うと、寄付額のうち自己負担2,000円を除いた金額が所得税・住民税から控除される制度です。返礼品を受け取れる自治体も多く、実質2,000円で地域の特産品などを楽しめる仕組みです。" },
    { question: "なぜ自己負担2,000円がかかるの？", answer: "制度上、寄付金控除の対象は「寄付額 − 2,000円」と定められています。この2,000円は寄付者自身が必ず負担する金額で、上限内であれば寄付額に関わらず一定です。" },
    { question: "控除上限額を超えて寄付するとどうなる？", answer: "上限を超えた分は控除されず、自己負担が2,000円以上になります。上限額はあくまで目安であり、医療費控除や住宅ローン控除の適用状況によって変動します。" },
    { question: "ワンストップ特例と確定申告の違いは？", answer: "ワンストップ特例は、確定申告が不要な会社員などが寄付先5自治体以内の場合に利用できる簡易手続きです。全額が住民税から控除されます。確定申告を行う場合は、所得税と住民税の両方から控除されます。" },
    { question: "この計算結果は正確ですか？", answer: "本ツールは総務省の公式計算式に基づく概算です。医療費控除・iDeCo・住宅ローン控除など、本ツールでカバーしない控除がある場合は上限額が変わります。正確な金額はお住まいの自治体または税理士にご確認ください。" },
  ],
};

const DEP_LABELS: Array<{ key: DependentCategory; label: string }> = [
  { key: "under16", label: "16歳未満（控除対象外）" },
  { key: "age16to18", label: "16〜18歳（一般扶養）" },
  { key: "age19to22", label: "19〜22歳（特定扶養）" },
  { key: "age23plus", label: "23歳以上（一般扶養）" },
  { key: "age70plus", label: "70歳以上（老人扶養）" },
];

export function FurusatoNozeiCalculator() {
  const [annualIncome, setAnnualIncome] = useState("6000000");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [deps, setDeps] = useState<Record<DependentCategory, string>>({
    under16: "0",
    age16to18: "0",
    age19to22: "0",
    age23plus: "0",
    age70plus: "0",
  });
  const [socialInsurance, setSocialInsurance] = useState("");
  const [result, setResult] = useState<FurusatoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      const parsedDeps = Object.fromEntries(
        (Object.keys(deps) as DependentCategory[]).map((k) => [
          k,
          Math.max(parseInt(deps[k], 10) || 0, 0),
        ])
      ) as Record<DependentCategory, number>;
      const r = calcFurusatoNozei({
        annualIncome: parseFloat(annualIncome) || 0,
        hasSpouse,
        dependents: parsedDeps,
        socialInsurance: socialInsurance ? parseFloat(socialInsurance) : undefined,
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
        title="ふるさと納税 控除上限額を計算"
        description="年収・配偶者控除・扶養家族の年齢区分から、ふるさと納税の寄付上限額の目安を公式計算式で算出します。"
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

          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={hasSpouse}
              onChange={(e) => setHasSpouse(e.target.checked)}
              className="h-4 w-4"
            />
            配偶者控除の対象となる配偶者がいる
          </label>

          <div className="space-y-3">
            <div className="text-sm font-medium text-text-secondary">
              扶養家族の人数（年齢区分ごと）
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {DEP_LABELS.map(({ key, label }) => (
                <FormField
                  key={key}
                  label={label}
                  type="number"
                  min={0}
                  value={deps[key]}
                  onChange={(e) =>
                    setDeps((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              ))}
            </div>
          </div>

          <FormField
            label="社会保険料控除額（円・任意、未入力なら年収×15％で推計）"
            type="number"
            min={0}
            value={socialInsurance}
            onChange={(e) => setSocialInsurance(e.target.value)}
          />

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result && (
            <div className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">給与所得</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.employmentIncome)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">住民税所得割額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(result.residenceTaxIncomePortion)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">所得税率</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {(result.incomeTaxRate * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-tertiary">自己負担額</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatYen(2000)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-brand/20 pt-4">
                  <div className="text-sm font-medium text-text-tertiary">
                    控除上限額（寄付上限の目安）
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(result.donationLimit)}
                  </div>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">計算の内訳</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  <p>1. 給与所得控除 = {formatYen(result.employmentDeduction)}</p>
                  <p>2. 給与所得 = {formatYen(result.annualIncome)} − {formatYen(result.employmentDeduction)} = {formatYen(result.employmentIncome)}</p>
                  <p>3. 所得控除合計（住民税用） = 基礎控除43万円 + 社会保険料{formatYen(result.socialInsurance)} + 配偶者控除{formatYen(result.spouseDeductionResidence)} + 扶養控除{formatYen(result.dependentsDeductionResidence)} = {formatYen(result.totalDeductionResidence)}</p>
                  <p>4. 住民税課税所得 = {formatYen(result.employmentIncome)} − {formatYen(result.totalDeductionResidence)} = {formatYen(result.taxableIncomeResidence)}</p>
                  <p>5. 住民税所得割額 = {formatYen(result.taxableIncomeResidence)} × 10% = {formatYen(result.residenceTaxIncomePortion)}</p>
                  <p>6. 所得税の限界税率 = {(result.incomeTaxRate * 100).toFixed(0)}%（速算表より）</p>
                  <p>7. 控除上限額 = {formatYen(result.residenceTaxIncomePortion)} × 20% ÷ (90% − {(result.incomeTaxRate * 100).toFixed(0)}% × 1.021) + 2,000円 = {formatYen(result.donationLimit)}</p>
                </SurfacePanel>
              </Divider>
            </div>
          )}

          <p className="text-xs leading-relaxed text-text-tertiary">
            ※ 自己負担は常に2,000円です。上限額を超えて寄付するとその超過分は自己負担となり、実質負担が増えます。実際の控除上限額は医療費控除・住宅ローン控除・iDeCoなど本ツールで扱わない控除により変動します。正確な金額はお住まいの自治体または税理士にご確認ください。
          </p>
        </div>
      </CalculatorCard>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/furusato-nozei-calculation" />
      </p>

      <section className="mt-8 space-y-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        <h2 className="text-xl font-semibold text-text-primary">ふるさと納税の仕組み</h2>
        <p>ふるさと納税は、応援したい自治体に寄付をすると、自己負担2,000円を除いた寄付額が所得税と住民税から控除される制度です。控除上限額の範囲内であれば、寄付先の返礼品を実質2,000円で受け取れるため、多くの給与所得者に利用されています。</p>
        <p>会社員などで確定申告が不要な方は、寄付先が5自治体以内であれば<strong>ワンストップ特例制度</strong>を利用でき、全額が翌年度の住民税から控除されます。医療費控除などで確定申告を行う方や6自治体以上に寄付した方は<strong>確定申告</strong>が必要となり、所得税からの還付＋住民税からの控除で調整されます。</p>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/furusato-nozei-calculation" />
    </>
  );
}
