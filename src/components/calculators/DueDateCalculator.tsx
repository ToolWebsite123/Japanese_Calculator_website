"use client";

import { useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import {
  buildDueDateResult,
  calcFromConception,
  calcFromIvf,
  calcFromLmp,
  calcTargetConception,
  formatDate,
  parseDate,
  type DueDateMode,
  type DueDateResult,
  type IvfEmbryoAge,
} from "@/lib/calculators/due-date";

const INTRO =
  "出産予定日 計算をブラウザ上で行えるツールです。最終月経開始日（LMP）から求める標準的な計算に加え、排卵日・性交日からの計算、体外受精の胚移植日からの計算、希望する出産予定日からの受精想定日の逆算にも対応。さらに、他ツールでは固定されがちな「生理周期」を21〜40日の範囲で調整でき、妊娠初期・中期・後期の開始日や正期産（37週0日〜41週6日）の安全出産期間、主なイベントの日付まで、実際のカレンダー日付として一覧表示します。あくまで目安の推定日ですので、正確な出産予定日は医師による超音波検査でご確認ください。";

const HOW_TO = {
  title: "出産予定日 計算の使い方",
  steps: [
    {
      title: "計算モードを選ぶ",
      body: "「最終月経日から」「性交日/排卵日から」「体外受精（胚移植日）から」「希望日から逆算」の4種類から選択します。",
    },
    {
      title: "日付と条件を入力",
      body: "モード1では最終月経開始日（LMP）と生理周期（既定28日、21〜40日で調整可）を入力します。モード2は性交日または排卵日、体外受精モードは胚移植日と胚の種類（胚盤胞・3日目胚・2日目胚）、逆算モードは希望する出産予定日を入力します。",
    },
    {
      title: "出産予定日を計算する",
      body: "「計算する」を押すと、出産予定日と個別カレンダー（今日の妊娠週数、予定日までの日数、主なイベントの日付、妊娠初期/中期/後期の開始日、正期産の期間）が表示されます。",
    },
    {
      title: "医師に確認",
      body: "本ツールの結果は目安です。妊娠8〜11週頃の超音波検査（CRL計測）で医師に正式な出産予定日を確定してもらいましょう。",
    },
  ],
};

export const FAQ = {
  title: "出産予定日の計算に関するよくある質問",
  items: [
    {
      question: "最終月経日（LMP）からの計算はなぜズレることがありますか？",
      answer:
        "LMPからの計算は生理周期28日・排卵はLMPから14日目という仮定に基づく推定です。実際の生理周期には個人差があり、排卵日が前後するとその分だけ予定日もズレます。本ツールでは生理周期を21〜40日で調整でき、周期差を反映した予定日を算出します。",
    },
    {
      question: "超音波検査で予定日を確認すべき理由は？",
      answer:
        "妊娠8〜11週頃の初期超音波検査で胎児のCRL（頭殿長）を計測すると、この時期は胎児の成長速度に個人差が少なく、±3〜5日程度の高い精度で出産予定日を確定できます。LMPが不明瞭な方や生理不順の方では特に、超音波による確定が推奨されます。",
    },
    {
      question: "妊娠初期・中期・後期の違いは？",
      answer:
        "妊娠初期は0週0日〜13週6日で、器官形成の重要な時期です。妊娠中期は14週0日〜27週6日で、体調が安定しやすく胎動を感じ始めます。妊娠後期は28週0日〜出産までで、赤ちゃんの体重が急増し出産準備が進みます。",
    },
    {
      question: "「正期産」とは何ですか？",
      answer:
        "正期産は妊娠37週0日〜41週6日の間に生まれることを指し、赤ちゃんが十分に成熟して生まれてくる安全な期間とされます。予定日（40週0日）ちょうどに生まれる方は約5%で、多くはこの正期産の期間内に出産します。",
    },
    {
      question: "性交日と排卵日、どちらを入力すればよいですか？",
      answer:
        "排卵日が分かる場合は排卵日を入力してください（精度が高くなります）。性交日しか分からない場合は、精子が数日生存することから±数日の誤差が生じる可能性があります。いずれもモード2の266日加算で予定日を算出します。",
    },
    {
      question: "体外受精の場合、出産予定日はどう計算しますか？",
      answer:
        "受精日を基準に266日を加えて計算します。受精日は「胚移植日 − 胚の日数」で求められるため、胚盤胞（5日目胚）なら移植日＋261日、3日目胚なら＋263日、2日目胚なら＋264日となります。本ツールの「体外受精（胚移植日）から計算」モードで、移植日と胚の種類を選ぶだけで計算できます。実際の予定日は、移植を行った医療機関にご確認ください。",
    },
  ],
};

const WEEK_TABLE: { weeks: string; months: string; event: string }[] = [
  { weeks: "0週", months: "1か月", event: "最終月経の開始（妊娠0週0日）" },
  { weeks: "2週", months: "1か月", event: "排卵・受精の目安" },
  { weeks: "5週", months: "2か月", event: "胎嚢（GS）が確認できる目安" },
  { weeks: "6週", months: "2か月", event: "心拍が確認できる目安" },
  { weeks: "10週", months: "3か月", event: "つわりのピークの目安" },
  { weeks: "16週", months: "5か月", event: "胎盤が完成し、安定期に入る目安" },
  { weeks: "18〜20週", months: "5〜6か月", event: "胎動を感じ始める目安" },
  { weeks: "22週", months: "6か月", event: "早産の区分に入る（22週未満は流産）" },
  { weeks: "28週", months: "8か月", event: "妊娠後期の開始" },
  { weeks: "36週", months: "10か月", event: "臨月の開始" },
  { weeks: "37週", months: "10か月", event: "正期産の開始" },
  { weeks: "40週", months: "10か月", event: "出産予定日" },
];

export function DueDateCalculator() {
  const [mode, setMode] = useState<DueDateMode>("lmp");

  // Mode 1
  const [lmpInput, setLmpInput] = useState("");
  const [cycle, setCycle] = useState("28");

  // Mode 2
  const [conceptionInput, setConceptionInput] = useState("");

  // Mode 3
  const [desiredInput, setDesiredInput] = useState("");

  // Mode 4 (IVF)
  const [ivfInput, setIvfInput] = useState("");
  const [embryoAge, setEmbryoAge] = useState("5");

  const [result, setResult] = useState<DueDateResult | null>(null);
  const [targetConception, setTargetConception] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultKey, setResultKey] = useState(0);

  const handleCalculate = () => {
    setError(null);
    setResult(null);
    setTargetConception(null);
    try {
      if (mode === "lmp") {
        const lmp = parseDate(lmpInput);
        if (!lmp) throw new Error("最終月経開始日を正しく入力してください");
        const cycleNum = parseFloat(cycle);
        const due = calcFromLmp(lmp, cycleNum);
        setResult(buildDueDateResult(due));
      } else if (mode === "conception") {
        const c = parseDate(conceptionInput);
        if (!c) throw new Error("性交日/排卵日を正しく入力してください");
        const due = calcFromConception(c);
        setResult(buildDueDateResult(due));
      } else if (mode === "ivf") {
        const transfer = parseDate(ivfInput);
        if (!transfer) throw new Error("胚移植日を正しく入力してください");
        const due = calcFromIvf(transfer, Number(embryoAge) as IvfEmbryoAge);
        setResult(buildDueDateResult(due));
      } else {
        const desired = parseDate(desiredInput);
        if (!desired) throw new Error("希望する出産予定日を正しく入力してください");
        const target = calcTargetConception(desired);
        setTargetConception(target);
        setResult(buildDueDateResult(desired));
      }
      setResultKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "計算エラー");
    }
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        出産予定日計算機
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[500px]">
        <div className="space-y-2.5 sm:space-y-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">計算モード</span>
            <SelectWell
              value={mode}
              onChange={(e) => setMode(e.target.value as DueDateMode)}
              className="text-lg"
            >
              <option value="lmp">最終月経日から計算</option>
              <option value="conception">性交日/排卵日から計算</option>
              <option value="ivf">体外受精（胚移植日）から計算</option>
              <option value="reverse">逆算（出産希望日から）</option>
            </SelectWell>
          </label>

          {mode === "lmp" && (
            <>
              <FormField
                label="最終月経開始日（LMP）"
                type="date"
                value={lmpInput}
                onChange={(e) => setLmpInput(e.target.value)}
                className="text-lg"
              />
              <FormField
                label="生理周期（日）"
                type="number"
                min={21}
                max={40}
                step="1"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-text-tertiary">
                既定は28日。21〜40日の範囲で調整できます（本ツールの独自機能）。
              </p>
            </>
          )}

          {mode === "conception" && (
            <FormField
              label="性交日または排卵日"
              type="date"
              value={conceptionInput}
              onChange={(e) => setConceptionInput(e.target.value)}
              className="text-lg"
            />
          )}

          {mode === "ivf" && (
            <>
              <FormField
                label="胚移植日"
                type="date"
                value={ivfInput}
                onChange={(e) => setIvfInput(e.target.value)}
                className="text-lg"
              />
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-text-secondary">胚の種類</span>
                <SelectWell
                  value={embryoAge}
                  onChange={(e) => setEmbryoAge(e.target.value)}
                  className="text-lg"
                >
                  <option value="5">胚盤胞（5日目胚）</option>
                  <option value="3">3日目胚</option>
                  <option value="2">2日目胚</option>
                </SelectWell>
              </label>
              <p className="text-xs text-text-tertiary">
                受精日（移植日 − 胚の日数）から266日で計算します。
              </p>
            </>
          )}

          {mode === "reverse" && (
            <FormField
              label="希望する出産予定日"
              type="date"
              value={desiredInput}
              onChange={(e) => setDesiredInput(e.target.value)}
              className="text-lg"
            />
          )}

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result && (
            <div key={`res-${resultKey}`} className="space-y-6">
              <SurfacePanel className="border-brand/20 bg-brand-muted space-y-4">
                <div>
                  <div className="text-sm font-medium text-text-tertiary">
                    {mode === "reverse" ? "希望する出産予定日" : "出産予定日（40週0日）"}
                  </div>
                  <div className="tabular-display mt-2 text-2xl font-bold text-brand sm:text-3xl">
                    {formatDate(result.dueDate)}
                  </div>
                </div>
                {mode === "reverse" && targetConception && (
                  <div className="mt-4 border-t border-brand/20 pt-4">
                    <div className="text-sm font-medium text-text-tertiary">
                      逆算：目安となる受精/性交日
                    </div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {formatDate(targetConception)}
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary">
                      希望日 − 266日で算出しています。
                    </p>
                  </div>
                )}
                {result.gestational && (
                  <div className="mt-4 border-t border-brand/20 pt-4">
                    <div className="text-sm font-medium text-text-tertiary">今日の妊娠週数</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {result.gestational.label}
                    </div>
                  </div>
                )}
                {mode !== "reverse" && (
                  <div className="mt-4 border-t border-brand/20 pt-4">
                    <div className="text-sm font-medium text-text-tertiary">出産予定日まで</div>
                    <div className="tabular-display mt-1 text-lg font-semibold text-text-primary">
                      {result.daysRemaining > 0
                        ? `あと${result.daysRemaining}日`
                        : result.daysRemaining === 0
                          ? "今日が出産予定日です"
                          : `予定日を${-result.daysRemaining}日過ぎています`}
                    </div>
                  </div>
                )}
              </SurfacePanel>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">主なイベント（目安）</h2>
                <SurfacePanel className="space-y-2 text-sm text-text-secondary">
                  {result.milestones.map((m) => (
                    <div
                      key={m.label}
                      className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <div>
                        <span className="font-semibold text-text-primary">{m.weekLabel}</span>
                        <span className="ml-2">{m.label}</span>
                      </div>
                      <div className="tabular-display text-xs text-text-secondary">
                        {formatDate(m.date)}
                      </div>
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-text-tertiary">
                    イベントの時期には個人差があります。実際の診察スケジュールは医療機関にご確認ください。
                  </p>
                </SurfacePanel>
              </Divider>

              <Divider>
                <h2 className="mb-4 text-xl font-semibold text-text-primary">個別カレンダー</h2>
                <SurfacePanel className="space-y-3 text-sm text-text-secondary">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium text-text-tertiary">
                        最終月経開始日（0週0日）
                      </div>
                      <div className="mt-0.5 font-semibold text-text-primary">
                        {formatDate(result.lmp)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-text-tertiary">
                        受精想定日（2週0日）
                      </div>
                      <div className="mt-0.5 font-semibold text-text-primary">
                        {formatDate(result.conceptionDate)}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 space-y-2">
                    {result.trimesters.map((t) => (
                      <div
                        key={t.name}
                        className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                      >
                        <div>
                          <span className="font-semibold text-text-primary">{t.name}</span>
                          <span className="ml-2 text-xs text-text-tertiary">{t.rangeLabel}</span>
                        </div>
                        <div className="tabular-display text-xs text-text-secondary">
                          {formatDate(t.startDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="text-xs font-medium text-text-tertiary">
                      正期産（安全な出産期間・37週0日〜41週6日）
                    </div>
                    <div className="mt-0.5 font-semibold text-text-primary">
                      {formatDate(result.safeWindowStart)} 〜 {formatDate(result.safeWindowEnd)}
                    </div>
                  </div>
                </SurfacePanel>
              </Divider>

              <SurfacePanel className="border-amber-300/60 bg-amber-50 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100">
                <strong>ご注意：</strong>
                本ツールの計算結果はあくまで目安です。実際の出産予定日は、妊娠8〜11週頃の超音波検査（CRL計測）などをもとに医師にご確認ください。
              </SurfacePanel>
            </div>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          最終月経日・排卵日・体外受精（胚移植日）・希望日の4方向から出産予定日を計算。生理周期の調整と、妊娠週数カレンダー（初期/中期/後期・正期産）、主なイベントの日付にも対応。
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/due-date-calculation" />
      </p>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />

      <section aria-labelledby="due-count-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="due-count-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          妊娠週数と予定日の数え方
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          妊娠期間は、最終月経の開始日を「妊娠0週0日」として数え、予定日はその{" "}
          <strong className="text-text-primary">280日後（40週0日）</strong>{" "}
          が目安です（ネーゲレ概算法）。たとえば最終月経が2026年1月1日の場合、予定日は{" "}
          <strong className="text-text-primary">2026年10月8日</strong> です。
        </p>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          予定日はあくまで目安で、実際のお産は前後します。月経周期が不規則な方や、医師から予定日を伝えられている場合は、医師の判断を優先してください。
        </p>
      </section>

      <section aria-labelledby="due-table-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="due-table-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          妊娠週数・月数と主なイベントの早見表
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          妊娠週数と月数の対応と、主なイベントの目安をまとめた早見表です。上の計算機で計算すると、あなたの日付に合わせたイベントの日付も表示されます。イベントの時期には個人差があります。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">妊娠週数</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">妊娠月数</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">
                  主なイベント・目安
                </th>
              </tr>
            </thead>
            <tbody>
              {WEEK_TABLE.map((row) => (
                <tr key={row.weeks} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.weeks}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.months}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/due-date-calculation" />
    </>
  );
}
