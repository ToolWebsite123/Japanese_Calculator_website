"use client";

import { useMemo, useState } from "react";
import { CalculatorCard, FormField } from "@/components/ui/FormField";
import { SelectWell, SurfacePanel, Divider, PrimaryButton } from "@/components/ui/primitives";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import {
  buildFu,
  calcMahjong,
  type FuBuilderInput,
  type MahjongResult,
  type MeldInput,
  type PairType,
  type Seat,
  type WaitType,
  type WinMethod,
  type WinType,
} from "@/lib/calculators/mahjong";

const INTRO =
  "麻雀 点数 計算をブラウザ上で行えるツールです。翻（han）と符（fu）、親・子、ロン・ツモを選ぶだけで、支払いの内訳（放銃者・親の支払い・子の支払い）まで自動で算出します。満貫・跳満・倍満・三倍満・役満といった固定点も自動判定。さらに符計算のヘルパーも搭載しており、副底20符に門前ロン加符・待ちの形・雀頭・面子（明刻/暗刻/明槓/暗槓、么九牌かどうか）を選ぶだけで符が積み上がり、10符単位で切り上げた値を本計算にワンクリックで反映できます。";

const FU_OPTIONS = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

const HOW_TO = {
  title: "麻雀 点数 計算の使い方",
  steps: [
    {
      title: "翻と符を入力",
      body: "翻（1〜13以上）と符（20/25/30/…/110）を選びます。符が分からない場合は下部の符計算ヘルパーで自動計算できます。",
    },
    {
      title: "親／子とロン／ツモを選ぶ",
      body: "上がった人が親か子か、ロン（他家から出上がり）かツモ（自摸和）かを選択します。",
    },
    {
      title: "点数を計算する",
      body: "「計算する」を押すと、合計点数と支払いの内訳が表示されます。満貫以上（5翻〜）は自動的に固定点数に切り替わります。",
    },
    {
      title: "符計算ヘルパー（任意）",
      body: "待ち・雀頭・面子構成を選ぶと符が自動で積み上がり、10符単位に切り上げた値を本計算の符欄に反映できます。",
    },
  ],
};

export const FAQ = {
  title: "麻雀の点数計算に関するよくある質問",
  items: [
    {
      question: "符（fu）とは何ですか？",
      answer:
        "符は手牌の構成要素（副底20・待ちの形・雀頭・面子の種類）ごとに加算される点数の細分値です。合計を10符単位で切り上げて使用します（20符はそのまま）。翻とかけ合わせて基本点を算出します。",
    },
    {
      question: "翻（han）とは何ですか？",
      answer:
        "翻は成立した役の合計値です。役ごとに1翻・2翻…と決まっており、ドラも1枚1翻として加算します。翻が大きいほど点数が跳ね上がり、5翻以上は満貫以上の固定点になります。",
    },
    {
      question: "親と子で点数はなぜ違うのですか？",
      answer:
        "親はすべての支払い倍率が1.5倍になります。基本点に対して親ロンは×6、親ツモは各家×2、子ロンは×4、子ツモは親×2/子×1で計算します。",
    },
    {
      question: "満貫以上で符が関係なくなるのはなぜですか？",
      answer:
        "5翻以上、または基本点が2000を超える場合は上限に達したとみなし、固定の点数表（満貫・跳満・倍満・三倍満・役満）を使用します。そのため翻数だけで点数が決まり、符は無視されます。",
    },
  ],
};

export function MahjongCalculator() {
  // Main inputs
  const [han, setHan] = useState("4");
  const [fu, setFu] = useState("30");
  const [seat, setSeat] = useState<Seat>("dealer");
  const [win, setWin] = useState<WinType>("ron");

  const [result, setResult] = useState<MahjongResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fu builder
  const [showBuilder, setShowBuilder] = useState(false);
  const [method, setMethod] = useState<WinMethod>("menzenRon");
  const [wait, setWait] = useState<WaitType>("ryanmenShanpon");
  const [pair, setPair] = useState<PairType>("other");
  const [melds, setMelds] = useState<MeldInput[]>([
    { tile: "simple", shape: "none" },
    { tile: "simple", shape: "none" },
    { tile: "simple", shape: "none" },
    { tile: "simple", shape: "none" },
  ]);

  const builder = useMemo(
    () => buildFu({ method, wait, pair, melds } satisfies FuBuilderInput),
    [method, wait, pair, melds],
  );

  const handleCalculate = () => {
    setError(null);
    setResult(null);
    const hanNum = parseInt(han, 10);
    const fuNum = parseInt(fu, 10);
    if (!Number.isFinite(hanNum) || hanNum < 1) {
      setError("翻は1以上の整数を入力してください");
      return;
    }
    if (!Number.isFinite(fuNum) || fuNum < 20) {
      setError("符は20以上を選んでください");
      return;
    }
    setResult(calcMahjong({ han: hanNum, fu: fuNum, seat, win }));
  };

  const applyBuilderFu = () => {
    const nearest = FU_OPTIONS.reduce((prev, curr) =>
      Math.abs(curr - builder.rounded) < Math.abs(prev - builder.rounded) ? curr : prev,
    );
    setFu(String(Math.max(nearest, builder.rounded > 110 ? 110 : nearest)));
  };

  const updateMeld = (i: number, patch: Partial<MeldInput>) => {
    setMelds((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  };

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        麻雀 点数 計算
      </h1>
      <CalculatorCard compact>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="翻（han）"
              type="number"
              min={1}
              max={20}
              step="1"
              value={han}
              onChange={(e) => setHan(e.target.value)}
              className="text-lg"
            />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">符（fu）</span>
              <SelectWell value={fu} onChange={(e) => setFu(e.target.value)} className="text-lg">
                {FU_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}符
                  </option>
                ))}
              </SelectWell>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">親／子</span>
              <SelectWell
                value={seat}
                onChange={(e) => setSeat(e.target.value as Seat)}
                className="text-lg"
              >
                <option value="dealer">親（Dealer）</option>
                <option value="nondealer">子（Non-dealer）</option>
              </SelectWell>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-secondary">上がり方</span>
              <SelectWell
                value={win}
                onChange={(e) => setWin(e.target.value as WinType)}
                className="text-lg"
              >
                <option value="ron">ロン</option>
                <option value="tsumo">ツモ</option>
              </SelectWell>
            </label>
          </div>

          <PrimaryButton onClick={handleCalculate}>計算する</PrimaryButton>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {result && (
            <SurfacePanel className="border-brand/20 bg-brand-muted space-y-3">
              <div>
                <div className="text-sm font-medium text-text-tertiary">合計点</div>
                <div className="tabular-display mt-2 text-2xl font-bold text-brand sm:text-3xl">
                  {result.total.toLocaleString()}点{result.label ? `（${result.label}）` : ""}
                </div>
              </div>
              <div className="border-t border-brand/20 pt-3">
                <div className="text-sm font-medium text-text-tertiary">支払いの内訳</div>
                <div className="mt-1 text-sm text-text-primary">{result.breakdown}</div>
                {result.basePoints !== null && (
                  <div className="mt-1 text-xs text-text-tertiary">基本点：{result.basePoints}</div>
                )}
              </div>
            </SurfacePanel>
          )}

          <Divider>
            <button
              type="button"
              onClick={() => setShowBuilder((v) => !v)}
              className="text-sm font-medium text-brand underline underline-offset-2"
            >
              {showBuilder ? "符計算ヘルパーを閉じる" : "符計算ヘルパーを開く"}
            </button>
            {showBuilder && (
              <SurfacePanel className="mt-3 space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <label className="block space-y-1.5">
                    <span className="font-medium text-text-secondary">上がり方（加符）</span>
                    <SelectWell
                      value={method}
                      onChange={(e) => setMethod(e.target.value as WinMethod)}
                    >
                      <option value="menzenRon">門前ロン (+10)</option>
                      <option value="tsumo">ツモ (+2)</option>
                      <option value="openRon">鳴きロン (+0)</option>
                    </SelectWell>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="font-medium text-text-secondary">待ちの形</span>
                    <SelectWell value={wait} onChange={(e) => setWait(e.target.value as WaitType)}>
                      <option value="ryanmenShanpon">両面/シャンポン (+0)</option>
                      <option value="kanchanPenchanTanki">カンチャン/ペンチャン/単騎 (+2)</option>
                    </SelectWell>
                  </label>
                  <label className="block space-y-1.5">
                    <span className="font-medium text-text-secondary">雀頭</span>
                    <SelectWell value={pair} onChange={(e) => setPair(e.target.value as PairType)}>
                      <option value="other">通常 (+0)</option>
                      <option value="yakuhai">役牌 (+2)</option>
                      <option value="doubleYakuhai">ダブル役牌 (+4)</option>
                    </SelectWell>
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-medium text-text-tertiary">面子（4つまで）</div>
                  {melds.map((m, i) => (
                    <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <SelectWell
                        value={m.tile}
                        onChange={(e) =>
                          updateMeld(i, { tile: e.target.value as MeldInput["tile"] })
                        }
                      >
                        <option value="simple">中張牌（2〜8）</option>
                        <option value="terminalHonor">么九・字牌</option>
                      </SelectWell>
                      <SelectWell
                        value={m.shape}
                        onChange={(e) =>
                          updateMeld(i, { shape: e.target.value as MeldInput["shape"] })
                        }
                      >
                        <option value="none">なし / 順子（+0）</option>
                        <option value="openTriplet">明刻</option>
                        <option value="closedTriplet">暗刻</option>
                        <option value="openKan">明槓</option>
                        <option value="closedKan">暗槓</option>
                      </SelectWell>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <div className="text-xs text-text-tertiary">符の内訳</div>
                  <ul className="mt-1 text-sm">
                    {builder.parts.map((p, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{p.label}</span>
                        <span className="tabular-display">+{p.value}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm">
                      合計 <span className="font-semibold">{builder.total}符</span>
                      <span className="text-text-tertiary"> → 切り上げ </span>
                      <span className="font-semibold">{builder.rounded}符</span>
                    </div>
                    <PrimaryButton onClick={applyBuilderFu}>本計算の符に反映</PrimaryButton>
                  </div>
                </div>
              </SurfacePanel>
            )}
          </Divider>
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          翻・符・親子・ロンツモを選ぶだけで、合計点と支払いの内訳まで算出。満貫〜役満の固定点にも対応。
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={INTRO} activeHref="/mahjong-score-calculation" />
      </p>

      <CalculatorHowToSection title={HOW_TO.title} steps={HOW_TO.steps} />
      <CalculatorFaqSection title={FAQ.title} items={FAQ.items} />
      <RelatedCalculators activeHref="/mahjong-score-calculation" />
    </>
  );
}
