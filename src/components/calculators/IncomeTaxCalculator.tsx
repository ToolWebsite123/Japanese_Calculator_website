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
    {
      title: "年収（額面）を入力する",
      body: "年間の総支給額（額面）を円で入力します。個人事業主の方は経費を差し引いた所得を入力してください。",
    },
    {
      title: "雇用形態を選ぶ",
      body: "会社員・パート／アルバイトの場合は「会社員」、個人事業主の方は「個人事業主」を選択します。",
    },
    {
      title: "控除額を入力（任意）",
      body: "社会保険料控除額と、その他の所得控除（生命保険料控除・医療費控除等）があれば入力します。不明な場合は0のままで概算できます。",
    },
    {
      title: "所得税額を計算する",
      body: "「計算する」を押すと、給与所得控除・給与所得・基礎控除・課税所得・所得税・復興特別所得税・納税額合計が表示されます。",
    },
  ],
};

export const FAQ = {
  title: "所得税の計算に関するよくある質問",
  items: [
    {
      question: "給与所得控除とは？",
      answer:
        "会社員・パート・アルバイトなど給与所得者に一律で認められる控除です。年収に応じて計算式が変わり、2025年改正では最低額が65万円に引き上げられました。",
    },
    {
      question: "基礎控除とは？",
      answer:
        "すべての納税者に認められる基本的な所得控除です。2025年以降は合計所得金額に応じて段階的に変動し、132万円以下では95万円、多くの給与所得者では58万円〜88万円となります。",
    },
    {
      question: "所得控除と税額控除の違いは？",
      answer:
        "所得控除は課税所得を計算する前に所得から差し引くもの（基礎控除・社会保険料控除など）、税額控除は算出された税額から直接差し引くもの（住宅ローン控除など）です。本ツールでは所得控除のみ扱います。",
    },
    {
      question: "復興特別所得税はなぜ加算されるの？",
      answer:
        "東日本大震災からの復興財源を確保するために、所得税額の2.1%が上乗せされる税金です。2013年から2037年までの各年分に適用されます。",
    },
    {
      question: "計算結果は正確ですか？",
      answer:
        "本ツールは概算であり、扶養控除・医療費控除・住宅ローン控除など個別事情は反映されません。正確な税額は年末調整・確定申告や税理士にご確認ください。",
    },
    {
      question: "所得税と住民税は何が違いますか？",
      answer:
        "所得税は国に納める税金で、その年の所得に対して年末調整や確定申告で精算されます。住民税は都道府県・市区町村に納める税金で、前年の所得をもとに計算され、翌年6月ごろから納付が始まります。所得税の計算では住民税は含まれないため、あわせて見積もる場合は住民税（おおむね課税所得の10%）も見ておきましょう。",
    },
    {
      question: "年収が同じでも所得税が違うのはなぜですか？",
      answer:
        "控除の内容が人によって違うためです。社会保険料の額、配偶者や扶養家族の有無、生命保険料控除などによって課税所得が変わり、税額も変わります。",
    },
  ],
};

const guideHeadingClass =
  "text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]";
const guideSubHeadingClass =
  "mt-8 text-base font-semibold text-[#231942] sm:text-lg dark:text-[#d6ccf0]";
const guideBodyClass = "mt-3 text-sm leading-relaxed text-text-secondary sm:text-base";

function IncomeGuideTable({ head, rows }: { head: string[]; rows: string[][] }) {
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

const TAX_TRUST = {
  title: "この計算について",
  items: [
    "計算方法：年収から給与所得控除を差し引いて給与所得を求め、基礎控除・社会保険料控除・その他の控除を差し引いた課税所得に、国税庁の速算表を適用して所得税を計算します。あわせて復興特別所得税（所得税額の2.1%）を加算します。",
    "根拠：2025年（令和7年）改正の給与所得控除・基礎控除と、国税庁公表の所得税速算表に基づきます。復興特別所得税は2037年分まで適用されます。",
    "注意：本ツールの結果は概算です。実際の税額は、社会保険料の金額、配偶者や扶養家族の状況、各種控除（医療費控除、住宅ローン控除など）によって変わります。正確な計算や申告については、国税庁のサイトや税務署・税理士にご確認ください。",
  ],
};

const TAX_FLOW = {
  title: "所得税の計算の流れ",
  steps: [
    "給与所得 ＝ 給与収入（年収） − 給与所得控除",
    "課税所得 ＝ 給与所得 − 所得控除の合計（基礎控除、社会保険料控除、配偶者控除、扶養控除など）",
    "所得税額 ＝ 課税所得 × 税率 − 控除額（下の速算表）",
  ],
  note: "所得税は、所得が多いほど税率が上がる累進課税です。なお、所得税とは別に住民税（おおむね課税所得の10%）もかかります。",
  bracketTitle: "所得税の税率（速算表）",
  bracketHead: ["課税所得", "税率", "控除額"],
  bracketRows: [
    ["1,000円〜194万9,000円", "5%", "0円"],
    ["195万円〜329万9,000円", "10%", "97,500円"],
    ["330万円〜694万9,000円", "20%", "427,500円"],
    ["695万円〜899万9,000円", "23%", "636,000円"],
    ["900万円〜1,799万9,000円", "33%", "1,536,000円"],
    ["1,800万円〜3,999万9,000円", "40%", "2,796,000円"],
    ["4,000万円〜", "45%", "4,796,000円"],
  ],
};

const TAX_HAYAMI = {
  title: "年収別の所得税の早見表",
  intro:
    "会社員（給与所得のみ）で、社会保険料控除・その他の控除を入力しない場合の目安です。この計算機で実際に計算した値です。",
  head: ["年収", "課税所得", "所得税", "復興特別所得税", "納税額合計"],
  rows: [
    ["200万円", "370,000円", "18,500円", "389円", "18,889円"],
    ["300万円", "1,140,000円", "57,000円", "1,197円", "58,197円"],
    ["400万円", "1,880,000円", "94,000円", "1,974円", "95,974円"],
    ["500万円", "2,880,000円", "190,500円", "4,001円", "194,501円"],
    ["600万円", "3,680,000円", "308,500円", "6,479円", "314,979円"],
    ["700万円", "4,570,000円", "486,500円", "10,217円", "496,717円"],
    ["800万円", "5,470,000円", "666,500円", "13,997円", "680,497円"],
    ["1,000万円", "7,470,000円", "1,082,100円", "22,724円", "1,104,824円"],
  ],
  note: "社会保険料控除などを入力すると、課税所得が下がり、実際の税額はこの表より少なくなります。ご自分の条件では上の計算機でご確認ください。",
};

const TAX_EXAMPLE = {
  title: "所得税の計算例",
  intro: "年収（給与収入）500万円の場合、この計算機では課税所得が2,880,000円となります。",
  steps: [
    "課税所得288万円は速算表の「195万円〜329万9,000円」の区分です（税率10%、控除額97,500円）。",
    "所得税額 ＝ 2,880,000円 × 10% − 97,500円 ＝ 190,500円",
    "復興特別所得税 ＝ 190,500円 × 2.1% ＝ 4,001円（所得税額に対して別途かかります）",
    "納税額合計 ＝ 190,500円 + 4,001円 ＝ 194,501円",
  ],
};

const TAX_USES = {
  title: "こんなときに役立ちます",
  items: [
    "転職・昇給で年収が変わったときの、手取りの変化の目安を知りたいとき",
    "副業収入にかかる税金の目安を知りたいとき",
    "年末調整と確定申告の前に、税額を事前にチェックしたいとき",
    "ふるさと納税の控除上限を考える前提として、課税所得を確認したいとき",
  ],
};

const TAX_MISTAKES = {
  title: "よくある間違い",
  items: [
    "年収（給与収入）と課税所得を同じものだと思ってしまう。課税所得は、給与所得控除や各種控除を差し引いた後の金額です。",
    "所得税だけを見て住民税を忘れる。住民税は別にかかり、おおむね課税所得の10%が目安です。",
    "副業の「20万円以下なら申告不要」のルールを住民税にも当てはめてしまう。所得税の申告が不要な場合でも、住民税の申告が必要なことがあります。",
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
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        所得税 計算
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[500px]">
        <div className="space-y-2.5 sm:space-y-3">
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
                      <p>
                        1. 給与所得控除 = {formatYen(result.employmentDeduction)}
                        （2025年改正の給与所得控除表より）
                      </p>
                      <p>
                        2. 給与所得 = {formatYen(result.annualIncome)} −{" "}
                        {formatYen(result.employmentDeduction)} ={" "}
                        {formatYen(result.employmentIncome)}
                      </p>
                    </>
                  )}
                  <p>
                    {employmentType === "employee" ? "3" : "1"}. 基礎控除 ={" "}
                    {formatYen(result.basicDeduction)}（合計所得金額に応じて算定）
                  </p>
                  <p>
                    {employmentType === "employee" ? "4" : "2"}. 課税所得 ={" "}
                    {formatYen(result.employmentIncome)} − {formatYen(result.basicDeduction)} −{" "}
                    {formatYen(result.socialInsurance)} − {formatYen(result.otherDeductions)} ={" "}
                    {formatYen(result.taxableIncome)}（1,000円未満切り捨て）
                  </p>
                  <p>
                    {employmentType === "employee" ? "5" : "3"}. 所得税 = 速算表より{" "}
                    {formatYen(result.incomeTax)}
                  </p>
                  <p>
                    {employmentType === "employee" ? "6" : "4"}. 復興特別所得税 ={" "}
                    {formatYen(result.incomeTax)} × 2.1％ = {formatYen(result.reconstructionTax)}
                  </p>
                  <p>
                    {employmentType === "employee" ? "7" : "5"}. 納税額合計 ={" "}
                    {formatYen(result.incomeTax)} + {formatYen(result.reconstructionTax)} ={" "}
                    {formatYen(result.totalTax)}
                  </p>
                </SurfacePanel>
              </Divider>
            </div>
          )}

          <p className="text-xs leading-relaxed text-text-tertiary">
            ※
            本ツールの結果は概算です。実際の税額は医療費控除・扶養控除・住宅ローン控除など個別の事情によって変わります。復興特別所得税は2037年までの各年分に適用されます。正確な金額は年末調整・確定申告、または税理士にご確認ください。
          </p>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          年収と雇用形態から所得税・復興特別所得税・納税額合計を概算します。2025年改正の給与所得控除・基礎控除に対応。
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/income-tax-calculation" />
      </p>

      <section aria-labelledby="tax-trust-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-trust-heading" className={guideHeadingClass}>
          {TAX_TRUST.title}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {TAX_TRUST.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />

      <section aria-labelledby="tax-flow-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-flow-heading" className={guideHeadingClass}>
          {TAX_FLOW.title}
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {TAX_FLOW.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className={guideBodyClass}>{TAX_FLOW.note}</p>
        <h3 className={guideSubHeadingClass}>{TAX_FLOW.bracketTitle}</h3>
        <IncomeGuideTable head={TAX_FLOW.bracketHead} rows={TAX_FLOW.bracketRows} />
      </section>

      <section aria-labelledby="tax-hayami-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-hayami-heading" className={guideHeadingClass}>
          {TAX_HAYAMI.title}
        </h2>
        <p className={guideBodyClass}>{TAX_HAYAMI.intro}</p>
        <IncomeGuideTable head={TAX_HAYAMI.head} rows={TAX_HAYAMI.rows} />
        <p className={guideBodyClass}>{TAX_HAYAMI.note}</p>
      </section>

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
      </section>

      <section aria-labelledby="tax-uses-heading" className="mt-16 border-t border-border pt-16">
        <h2 id="tax-uses-heading" className={guideHeadingClass}>
          {TAX_USES.title}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary sm:text-base">
          {TAX_USES.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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

      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/income-tax-calculation" />
    </>
  );
}
