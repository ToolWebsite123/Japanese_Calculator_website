"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SurfacePanel, Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { formatYen } from "@/lib/format";
import Link from "@/compat/next-link";
import {
  calcFurusatoNozeiDetailed,
  type DetailedDependentKey,
  type DisabilityKey,
  type SpouseType,
  type FurusatoDetailedResult,
} from "@/lib/calculators/furusato-nozei-detailed";

const INTRO =
  "ふるさと納税 シミュレーションの詳細版です。給与収入だけの簡単な目安を出したい方は、シンプル版のふるさと納税ページ（クイック版）をご利用ください。この詳細版では、社会保険料の実額に加え、生命保険料控除・地震保険料控除・医療費控除・障害者控除・ひとり親控除・住宅ローン控除など、furusato-tax.jp が公式Excelシートで採用しているのと同じすべての所得控除を1画面で入力できます。入力するたびに控除上限額と内訳がその場で更新されるため、Excelをダウンロードする必要はありません。所得税 計算や社会保険料計算と併せてお使いください。";

const HOW_TO = {
  title: "ふるさと納税 シミュレーションの使い方",
  steps: [
    { title: "給与収入を入力", body: "額面年収を入力します。入力の瞬間に結果が更新されます。" },
    {
      title: "配偶者の状況を選ぶ",
      body: "なし／69歳以下／70歳以上を選び、配偶者の給与収入を入力します（103万円以下で配偶者控除の対象）。",
    },
    {
      title: "同居・別居まで分けて扶養情報を登録",
      body: "詳細版では老人扶養親族を同居・別居に分けて集計するため、70歳以上（同居）と70歳以上（別居）を別枠で入力します。控除額が変わるので該当者は必ず区別してください。",
    },
    {
      title: "各種控除の実額を入力",
      body: "社会保険料等・生命保険料控除・地震保険料控除・医療費控除・住宅ローン控除を、源泉徴収票や控除証明書の実額で入力します。",
    },
    {
      title: "障害者・ひとり親を反映",
      body: "障害者控除（一般／特別／同居特別）の人数と、ひとり親・寡婦控除の該当有無を選びます。",
    },
    {
      title: "詳細な内訳を確認",
      body: "給与所得・所得控除の合計・課税所得・所得税率・住民税所得割額・控除上限額まで、ステップごとに表示されます。",
    },
  ],
};

export const FAQ = {
  title: "FAQs",
  items: [
    {
      question: "簡単版（ふるさと納税ページ）とどう違うの？",
      answer:
        "簡単版は「年収・配偶者・扶養」の3項目に絞り、社会保険料は年収×15％で推計する目安ツールです。詳細版は生命保険料控除・地震保険料控除・医療費控除・障害者控除・ひとり親控除・住宅ローン控除まで含めて計算し、furusato-tax.jp のExcelシミュレーションと同じ結果を目指します。",
    },
    {
      question: "furusato-tax.jp の詳細版との違いは？",
      answer:
        "同サイトの詳細シミュレーションは正確な結果を得るためにExcelファイルのダウンロードが必要ですが、本ツールはブラウザ上で入力するたびに結果と内訳がリアルタイムに更新されます。",
    },
    {
      question: "住宅ローン控除は反映されますか？",
      answer:
        "はい。住宅ローン控除額は住民税所得割から差し引いた上で控除上限額を計算します。控除額が大きい場合は上限が下がる傾向があります。",
    },
    {
      question: "医療費控除は年間の医療費をそのまま入力すればいい？",
      answer:
        "いいえ。医療費控除額（＝支払った医療費 − 保険金等 − 10万円 または 所得×5%）の欄には、控除額そのものを入力してください。",
    },
    {
      question: "株の譲渡益や配当があります。反映できますか？",
      answer:
        "本ツールは給与所得のみを対象としています。株式の譲渡益・配当・不動産所得などがある場合は上限額が変わるため、税理士やお住まいの自治体にご確認ください。",
    },
  ],
};

const DEP: Array<{ key: DetailedDependentKey; label: string }> = [
  { key: "under16", label: "16歳未満（控除対象外）" },
  { key: "age16to18", label: "16〜18歳（一般扶養）" },
  { key: "age19to22", label: "19〜22歳（特定扶養）" },
  { key: "age23to69", label: "23〜69歳（一般扶養）" },
  { key: "age70coliving", label: "70歳以上（同居老親）" },
  { key: "age70separate", label: "70歳以上（別居）" },
];

const DIS: Array<{ key: DisabilityKey; label: string }> = [
  { key: "general", label: "一般の障害者" },
  { key: "special", label: "特別障害者" },
  { key: "cohabitingSpecial", label: "同居特別障害者" },
];

const num = (v: string) => parseFloat(v) || 0;
const int = (v: string) => Math.max(parseInt(v, 10) || 0, 0);

export function FurusatoNozeiSimulator() {
  const [annualIncome, setAnnualIncome] = useState("6000000");
  const [spouseType, setSpouseType] = useState<SpouseType>("none");
  const [spouseIncome, setSpouseIncome] = useState("0");
  const [deps, setDeps] = useState<Record<DetailedDependentKey, string>>({
    under16: "0",
    age16to18: "0",
    age19to22: "0",
    age23to69: "0",
    age70coliving: "0",
    age70separate: "0",
  });
  const [dis, setDis] = useState<Record<DisabilityKey, string>>({
    general: "0",
    special: "0",
    cohabitingSpecial: "0",
  });
  const [socialInsurance, setSocialInsurance] = useState("900000");
  const [lifeInsurance, setLifeInsurance] = useState("0");
  const [earthquakeInsurance, setEarthquakeInsurance] = useState("0");
  const [medical, setMedical] = useState("0");
  const [singleParent, setSingleParent] = useState(false);
  const [housingLoanCredit, setHousingLoanCredit] = useState("0");
  const [showResults, setShowResults] = useState(false);

  const { result, error } = useMemo<{
    result: FurusatoDetailedResult | null;
    error: string | null;
  }>(() => {
    try {
      const r = calcFurusatoNozeiDetailed({
        annualIncome: num(annualIncome),
        spouseType,
        spouseIncome: num(spouseIncome),
        dependents: {
          under16: int(deps.under16),
          age16to18: int(deps.age16to18),
          age19to22: int(deps.age19to22),
          age23to69: int(deps.age23to69),
          age70coliving: int(deps.age70coliving),
          age70separate: int(deps.age70separate),
        },
        disability: {
          general: int(dis.general),
          special: int(dis.special),
          cohabitingSpecial: int(dis.cohabitingSpecial),
        },
        socialInsurance: num(socialInsurance),
        lifeInsurance: num(lifeInsurance),
        earthquakeInsurance: num(earthquakeInsurance),
        medical: num(medical),
        singleParent,
        housingLoanCredit: num(housingLoanCredit),
      });
      return { result: r, error: null };
    } catch (e) {
      return {
        result: null,
        error: e instanceof Error ? e.message : "計算エラー",
      };
    }
  }, [
    annualIncome,
    spouseType,
    spouseIncome,
    deps,
    dis,
    socialInsurance,
    lifeInsurance,
    earthquakeInsurance,
    medical,
    singleParent,
    housingLoanCredit,
  ]);

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        ふるさと納税 控除上限額 詳細シミュレーション
      </h1>
      <CalculatorCard compact>
        <div className="space-y-6">
          <FormField
            label="給与収入（円・額面年収）"
            type="number"
            min={0}
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            className="text-lg"
          />

          <div className="space-y-3">
            <div className="text-sm font-medium text-text-secondary">配偶者の状況</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="text-text-tertiary">配偶者控除区分</span>
                <select
                  value={spouseType}
                  onChange={(e) => setSpouseType(e.target.value as SpouseType)}
                  className="ml-auto rounded border border-border bg-background px-2 py-1 text-sm"
                >
                  <option value="none">なし</option>
                  <option value="under70">あり（69歳以下）</option>
                  <option value="over70">あり（70歳以上）</option>
                </select>
              </label>
              <FormField
                label="配偶者の給与収入（円）"
                type="number"
                min={0}
                value={spouseIncome}
                onChange={(e) => setSpouseIncome(e.target.value)}
                disabled={spouseType === "none"}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-text-secondary">
              扶養家族の人数（年齢区分ごと）
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {DEP.map(({ key, label }) => (
                <FormField
                  key={key}
                  label={label}
                  type="number"
                  min={0}
                  value={deps[key]}
                  onChange={(e) => setDeps((p) => ({ ...p, [key]: e.target.value }))}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-text-secondary">
              各種控除（源泉徴収票の実額）
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label="社会保険料等の金額（円）"
                type="number"
                min={0}
                value={socialInsurance}
                onChange={(e) => setSocialInsurance(e.target.value)}
              />
              <FormField
                label="生命保険料控除額（円）"
                type="number"
                min={0}
                value={lifeInsurance}
                onChange={(e) => setLifeInsurance(e.target.value)}
              />
              <FormField
                label="地震保険料控除額（円）"
                type="number"
                min={0}
                value={earthquakeInsurance}
                onChange={(e) => setEarthquakeInsurance(e.target.value)}
              />
              <FormField
                label="医療費控除額（円）"
                type="number"
                min={0}
                value={medical}
                onChange={(e) => setMedical(e.target.value)}
              />
              <FormField
                label="住宅ローン控除額（円・任意）"
                type="number"
                min={0}
                value={housingLoanCredit}
                onChange={(e) => setHousingLoanCredit(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-text-secondary">障害者控除・ひとり親控除</div>
            <div className="grid gap-3 sm:grid-cols-3">
              {DIS.map(({ key, label }) => (
                <FormField
                  key={key}
                  label={label}
                  type="number"
                  min={0}
                  value={dis[key]}
                  onChange={(e) => setDis((p) => ({ ...p, [key]: e.target.value }))}
                />
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={singleParent}
                onChange={(e) => setSingleParent(e.target.checked)}
                className="h-4 w-4"
              />
              ひとり親・寡婦控除に該当する
            </label>
          </div>

          <PrimaryButton onClick={() => setShowResults(true)}>結果を確認する</PrimaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {showResults && result && (
            <div className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div>
                  <div className="text-sm font-medium text-text-tertiary">
                    控除上限額（寄付上限の目安）
                  </div>
                  <div className="tabular-display mt-2 text-3xl font-bold text-brand">
                    {formatYen(result.donationLimit)}
                  </div>
                  <p className="mt-1 text-xs text-text-tertiary">
                    自己負担額 2,000円を含みます。入力を変更すると即座に更新されます。
                  </p>
                </div>
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">詳細な計算内訳</h2>
                <SurfacePanel className="overflow-x-auto text-sm text-text-secondary">
                  <table className="w-full min-w-[520px] border-collapse">
                    <tbody>
                      <Row label="① 給与収入" value={formatYen(result.annualIncome)} />
                      <Row
                        label="② 給与所得控除"
                        value={`− ${formatYen(result.employmentDeduction)}`}
                      />
                      <Row
                        label="③ 給与所得 (①−②)"
                        value={formatYen(result.employmentIncome)}
                        strong
                      />
                      <Row
                        label="④ 基礎控除（住民税）"
                        value={formatYen(result.basicDeductionResidence)}
                      />
                      <Row label="⑤ 社会保険料控除" value={formatYen(result.socialInsurance)} />
                      <Row label="⑥ 生命保険料控除" value={formatYen(result.lifeInsurance)} />
                      <Row label="⑦ 地震保険料控除" value={formatYen(result.earthquakeInsurance)} />
                      <Row label="⑧ 医療費控除" value={formatYen(result.medical)} />
                      <Row
                        label="⑨ 配偶者控除（住民税）"
                        value={formatYen(result.spouseDeductionResidence)}
                      />
                      <Row
                        label="⑩ 扶養控除（住民税）"
                        value={formatYen(result.dependentsDeductionResidence)}
                      />
                      <Row
                        label="⑪ 障害者控除（住民税）"
                        value={formatYen(result.disabilityDeductionResidence)}
                      />
                      <Row
                        label="⑫ ひとり親控除（住民税）"
                        value={formatYen(result.singleParentDeductionResidence)}
                      />
                      <Row
                        label="所得控除の合計（住民税）"
                        value={formatYen(result.totalDeductionResidence)}
                        strong
                      />
                      <Row
                        label="⑬ 住民税課税所得 (③−合計)"
                        value={formatYen(result.taxableIncomeResidence)}
                        strong
                      />
                      <Row
                        label="⑭ 住民税所得割額 (⑬×10% − 住宅ローン控除)"
                        value={formatYen(result.residenceTaxIncomePortion)}
                        strong
                      />
                      <Row
                        label="⑮ 所得税課税所得（1,000円未満切捨）"
                        value={formatYen(result.taxableIncomeIncomeTax)}
                      />
                      <Row
                        label="⑯ 所得税の限界税率"
                        value={`${(result.incomeTaxRate * 100).toFixed(0)}%`}
                      />
                      <Row
                        label="⑰ 住宅ローン控除（差引）"
                        value={formatYen(result.housingLoanCredit)}
                      />
                      <Row
                        label="⑱ 控除上限額 = ⑭×20% ÷ (90% − ⑯×1.021) + 2,000"
                        value={formatYen(result.donationLimit)}
                        highlight
                      />
                    </tbody>
                  </table>
                </SurfacePanel>
              </Divider>
            </div>
          )}

          <p className="text-xs leading-relaxed text-text-tertiary">
            ※
            本シミュレーションはあくまで目安です。株式の譲渡益・配当所得・不動産所得など給与以外の所得や、iDeCo・小規模企業共済等掛金控除など、本ツールで扱わない控除がある場合は控除上限額が変わります。最終的な金額はお住まいの自治体または税理士にご確認ください。
          </p>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          全ての所得控除を反映した詳細な控除上限額シミュレーション。入力するたびにリアルタイムで結果が更新されます。
        </p>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/furusato-nozei-simulation-calculation" />
      </p>

      <section className="mt-8 space-y-3 text-sm leading-relaxed text-text-secondary sm:text-base">
        <h2 className="text-xl font-semibold text-text-primary">クイック版と詳細版の使い分け</h2>
        <p>
          年収と家族構成だけでざっくり上限を知りたい方は、シンプルな
          <Link
            href="/furusato-nozei-calculation"
            className="text-brand underline underline-offset-2 hover:text-brand/80"
          >
            ふるさと納税 クイック版
          </Link>
          が便利です。生命保険料控除・地震保険料控除・医療費控除・住宅ローン控除など全ての所得控除を反映して精緻に計算したい場合は、このページ（詳細版シミュレーション）をご利用ください。
        </p>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/furusato-nozei-simulation-calculation" />
    </>
  );
}

function Row({
  label,
  value,
  strong,
  highlight,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: boolean;
}) {
  return (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="py-2 pr-3 align-top text-text-secondary">{label}</td>
      <td
        className={`tabular-display py-2 pl-3 text-right align-top ${highlight
            ? "text-brand font-bold"
            : strong
              ? "font-semibold text-text-primary"
              : "text-text-primary"
          }`}
      >
        {value}
      </td>
    </tr>
  );
}
