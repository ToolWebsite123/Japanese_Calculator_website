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
  calcFromLmp,
  calcTargetConception,
  formatDate,
  parseDate,
  type DueDateMode,
  type DueDateResult,
} from "@/lib/calculators/due-date";

const INTRO =
  "出産予定日 計算をブラウザ上で行えるツールです。最終月経開始日（LMP）から求める標準的な計算に加え、排卵日・性交日からの逆算、希望する出産予定日からの受精想定日の逆算にも対応。さらに、他ツールでは固定されがちな「生理周期」を21〜40日の範囲で調整でき、妊娠初期・中期・後期の開始日や正期産（37週0日〜41週6日）の安全出産期間まで、実際のカレンダー日付として一覧表示します。あくまで目安の推定日ですので、正確な出産予定日は医師による超音波検査でご確認ください。";

const HOW_TO = {
  title: "出産予定日 計算の使い方",
  steps: [
    {
      title: "計算モードを選ぶ",
      body: "「最終月経日から」「性交日/排卵日から」「希望日から逆算」の3種類から選択します。",
    },
    {
      title: "日付と条件を入力",
      body: "モード1では最終月経開始日（LMP）と生理周期（既定28日、21〜40日で調整可）を入力します。モード2は性交日または排卵日、モード3は希望する出産予定日を入力します。",
    },
    {
      title: "出産予定日を計算する",
      body: "「計算する」を押すと、出産予定日と個別カレンダー（今日の妊娠週数、妊娠初期/中期/後期の開始日、正期産の期間）が表示されます。",
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
  ],
};

export function DueDateCalculator() {
  const [mode, setMode] = useState<DueDateMode>("lmp");

  // Mode 1
  const [lmpInput, setLmpInput] = useState("");
  const [cycle, setCycle] = useState("28");

  // Mode 2
  const [conceptionInput, setConceptionInput] = useState("");

  // Mode 3
  const [desiredInput, setDesiredInput] = useState("");

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
      <CalculatorCard
        title="出産予定日計算機"
        description="最終月経日・排卵日・希望日の3方向から出産予定日を計算。生理周期の調整と、妊娠週数カレンダー（初期/中期/後期・正期産）にも対応。"
      >
        <div className="space-y-6">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-text-secondary">計算モード</span>
            <SelectWell
              value={mode}
              onChange={(e) => setMode(e.target.value as DueDateMode)}
              className="text-lg"
            >
              <option value="lmp">最終月経日から計算</option>
              <option value="conception">性交日/排卵日から計算</option>
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
              </SurfacePanel>

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

      <p className="mt-8 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/due-date-calculation" />
      </p>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/due-date-calculation" />
    </>
  );
}
