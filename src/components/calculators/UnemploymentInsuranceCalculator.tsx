"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, SecondaryButton } from "@/components/ui/primitives";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { useHistory } from "@/context/HistoryContext";
import { formatYen } from "@/lib/format";
import {
  calculateUnemployment,
  AGE_OPTIONS,
  TENURE_OPTIONS,
  REASON_OPTIONS,
  type AgeBracket,
  type TenureBracket,
  type LeaveReason,
} from "@/lib/calculators/unemployment-insurance";

const INTRO =
  "失業保険 計算（雇用保険 基本手当）を、直近6ヶ月の賃金合計・年齢・被保険者期間・離職理由から自動で行うツールです。賃金日額と基本手当日額、所定給付日数、受給総額の目安を素早く確認できます。関連する社会保険料計算や利息計算も併せてご活用ください。";

const HOW_TO = {
  title: "失業保険 計算の手順",
  steps: [
    {
      title: "6ヶ月の賃金合計を入力",
      body: "離職前6ヶ月間に支払われた賃金（賞与を除く）の合計額を円単位で入力します。残業代・通勤手当・住宅手当などは含みます。",
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
      body: "自己都合・会社都合・有期雇用未更新・正当な理由のある自己都合・定年退職から該当するものを選ぶと、結果がその場で表示されます。",
    },
  ],
};

const DAYS_SELF_ROWS: [string, string][] = [
  ["1年未満", "受給できません（原則）"],
  ["1年以上10年未満", "90日"],
  ["10年以上20年未満", "120日"],
  ["20年以上", "150日"],
];

const DAYS_COMPANY_HEAD = ["年齢", "1年未満", "1〜5年", "5〜10年", "10〜20年", "20年以上"];
const DAYS_COMPANY_ROWS: string[][] = [
  ["29歳以下", "90日", "90日", "120日", "180日", "180日"],
  ["30〜34歳", "90日", "120日", "180日", "210日", "240日"],
  ["35〜44歳", "90日", "150日", "180日", "240日", "270日"],
  ["45〜59歳", "90日", "180日", "240日", "270日", "330日"],
  ["60〜64歳", "90日", "150日", "180日", "210日", "240日"],
];

const EXAMPLE_ROWS: [string, string][] = [
  ["月給30万円・35〜44歳・5〜10年・自己都合", "日額6,307円 × 90日 ＝ 567,630円"],
  ["月給30万円・30〜34歳・5〜10年・会社都合", "日額6,307円 × 180日 ＝ 1,135,260円"],
  ["月給25万円・29歳以下・1〜5年・自己都合", "日額5,775円 × 90日 ＝ 519,750円"],
  ["月給40万円・45〜59歳・20年以上・会社都合", "日額6,744円 × 330日 ＝ 2,225,520円"],
];

const MISTAKES: string[] = [
  "賃金合計に賞与（ボーナス）を含めてしまう（賃金日額の計算に賞与・退職金は含みません。残業代や通勤手当は含みます）。",
  "自己都合でも会社都合と同じ日数だと思う（所定給付日数は離職理由で大きく変わり、自己都合には給付制限もあります）。",
  "月給をそのまま6倍すればよいと思う（賃金日額は「離職前6か月の賃金総額 ÷ 180」で、月給の単純な平均ではありません）。",
];

export const FAQ = {
  title: "失業保険（雇用保険）の受給に関するよくある質問",
  items: [
    {
      question: "この計算結果はそのまま支給されますか？",
      answer:
        "本ツールは令和8年8月1日の公式レートに基づく目安です。正式な支給額はハローワークの決定に従います。",
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
    {
      question: "受給中にアルバイトをするとどうなりますか？",
      answer:
        "働いた日は原則として支給対象日が先送りになり、収入額によっては減額されることもあります。認定日には就労した日を申告する必要があります。詳しい取扱いはハローワークでご確認ください。",
    },
    {
      question: "早く再就職すると手当はどうなりますか？",
      answer:
        "所定給付日数を一定以上残して再就職した場合、「再就職手当」が支給されることがあります。支給要件や金額は残り日数によって変わるため、ハローワークでご確認ください。",
    },
  ],
};

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";

export function UnemploymentInsuranceCalculator() {
  const { addEntry } = useHistory();
  const [wage, setWage] = useState<string>("1800000");
  const [age, setAge] = useState<AgeBracket>("30-34");
  const [tenure, setTenure] = useState<TenureBracket>("5-10");
  const [reason, setReason] = useState<LeaveReason>("company");

  const computed = useMemo(() => {
    try {
      return {
        result: calculateUnemployment({
          sixMonthWageTotal: parseFloat(wage) || 0,
          age,
          tenure,
          reason,
        }),
        error: null as string | null,
      };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : "入力が無効です" };
    }
  }, [wage, age, tenure, reason]);
  const result = computed.result;

  const loggedKeyRef = useRef<string>("");
  useEffect(() => {
    if (!result) return;
    const key = `${wage}|${age}|${tenure}|${reason}`;
    if (loggedKeyRef.current === key) return;
    const timer = setTimeout(() => {
      loggedKeyRef.current = key;
      addEntry({
        expression: `失業保険 賃金${wage}円`,
        result: formatYen(result.totalBenefit),
        route: "/unemployment-insurance-calculation",
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [result, wage, age, tenure, reason, addEntry]);

  function handleClear() {
    setWage("1800000");
    setAge("30-34");
    setTenure("5-10");
    setReason("company");
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        失業保険 受給額計算
      </h1>
      <CalculatorCard
        compact
        maxWidthClass="max-w-[500px]"
        actions={result ? <CopyResultButton value={formatYen(result.totalBenefit)} /> : undefined}
      >
        <div className="space-y-2.5 sm:space-y-3">
          <FormField
            label="離職前6ヶ月の賃金合計（円）"
            type="number"
            min={0}
            value={wage}
            onChange={(e) => setWage(e.target.value)}
            className="text-lg"
          />
          <p className="text-xs leading-relaxed text-text-tertiary">
            賞与（ボーナス）・退職金は含めません。残業代・通勤手当・住宅手当などは含みます。
          </p>

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

          <SecondaryButton fullWidth onClick={handleClear}>
            クリア
          </SecondaryButton>

          {computed.error && (
            <p className="text-sm text-red-600 dark:text-red-400">{computed.error}</p>
          )}

          {result && (
            <div translate="no" className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
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
            令和8年8月1日改定の公式レートに基づく概算です。正式な支給額はハローワークの決定に従います。
          </p>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          6ヶ月の賃金合計・年齢・被保険者期間・離職理由から、基本手当日額と受給総額を計算します。
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/unemployment-insurance-calculation" />
      </p>

      <section aria-labelledby="unemp-mechanism-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="unemp-mechanism-heading" className={guideHeadingClass}>
          基本手当の決まり方
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          基本手当日額は、離職前6か月の賃金総額を180で割った「賃金日額」に、給付率（50〜80%、賃金が低いほど高い割合）をかけて決まります。給付率は一律ではなく、賃金日額に応じて80%から50%へなだらかに下がるスライド式です。所定給付日数は、年齢・被保険者期間・離職理由（自己都合か会社都合か）で変わります。
        </p>
      </section>

      <section aria-labelledby="unemp-days-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="unemp-days-heading" className={guideHeadingClass}>
          所定給付日数の早見表
        </h2>
        <h3 className="mt-6 text-base font-semibold text-text-primary">
          一般の離職者（自己都合・定年退職）
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-left">
                <th className="px-3 py-2.5 font-semibold text-text-primary">被保険者期間</th>
                <th className="px-3 py-2.5 font-semibold text-text-primary">所定給付日数</th>
              </tr>
            </thead>
            <tbody>
              {DAYS_SELF_ROWS.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  <td className="px-3 py-2.5 text-text-secondary">{row[0]}</td>
                  <td className="px-3 py-2.5 text-text-primary">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="mt-8 text-base font-semibold text-text-primary">
          特定受給資格者・特定理由離職者（会社都合など）
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-left">
                {DAYS_COMPANY_HEAD.map((cell) => (
                  <th key={cell} className="px-3 py-2.5 font-semibold text-text-primary">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS_COMPANY_ROWS.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  {row.map((cell, i) => (
                    <td
                      key={cell + i}
                      className={`px-3 py-2.5 ${i === 0 ? "font-medium text-text-primary" : "text-text-secondary"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          65歳以上は基本手当ではなく「高年齢求職者給付金」が一時金で支給されます（被保険者期間1年未満で30日分、1年以上で50日分）。
        </p>
      </section>

      <section aria-labelledby="unemp-example-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="unemp-example-heading" className={guideHeadingClass}>
          計算例
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          離職前6か月の賃金総額180万円、年齢30〜34歳、被保険者期間5年以上10年未満、会社都合退職の場合、この計算機では基本手当日額{" "}
          <strong className="text-text-primary">6,307円</strong>、所定給付日数{" "}
          <strong className="text-text-primary">180日</strong>、受給総額の目安{" "}
          <strong className="text-text-primary">1,135,260円</strong> となります。
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-left">
                <th className="px-3 py-2.5 font-semibold text-text-primary">条件</th>
                <th className="px-3 py-2.5 font-semibold text-text-primary">受給総額の目安</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_ROWS.map((row) => (
                <tr key={row[0]} className="border-b border-border">
                  <td className="px-3 py-2.5 text-text-secondary">{row[0]}</td>
                  <td className="px-3 py-2.5 text-text-primary">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          実際の受給額と日数はハローワークの認定で決まります。自己都合退職には給付制限期間があります。
        </p>
      </section>

      <section aria-labelledby="unemp-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="unemp-mistakes-heading" className={guideHeadingClass}>
          よくある間違い
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
      <RelatedCalculators activeHref="/unemployment-insurance-calculation" />
    </>
  );
}
