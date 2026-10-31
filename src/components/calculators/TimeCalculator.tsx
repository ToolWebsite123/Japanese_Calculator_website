"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/ui/FormField";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { InputWell, SegmentedControl, SurfacePanel } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import {
  addToClock,
  clockDifference,
  formatClockTime,
  formatDecimalHoursFromMinutes,
  formatDecimalHoursFromSeconds,
  formatDurationMinutes,
  parseClockTime,
} from "@/lib/calculators/time";

type TimeMode = "duration" | "clock" | "offset";

const timeInputClass =
  "w-full rounded-[var(--radius-sm)] border border-border bg-surface-raised px-3 py-2 text-center text-lg text-text-primary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function parseTimePart(value: string, max: number) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0 || parsed > max) {
    return null;
  }
  return parsed;
}

function TimeBlock({
  label,
  hours,
  minutes,
  seconds,
  setHours,
  setMinutes,
  setSeconds,
}: {
  label: string;
  hours: string;
  minutes: string;
  seconds: string;
  setHours: (v: string) => void;
  setMinutes: (v: string) => void;
  setSeconds: (v: string) => void;
}) {
  return (
    <SurfacePanel>
      <div className="mb-3 block text-sm font-semibold text-text-primary">{label}</div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: hours, set: setHours, unit: "時", ariaLabel: `${label}の時間`, max: 9999 },
          { value: minutes, set: setMinutes, unit: "分", ariaLabel: `${label}の分`, max: 999 },
          { value: seconds, set: setSeconds, unit: "秒", ariaLabel: `${label}の秒`, max: 999 },
        ].map(({ value, set, unit, ariaLabel, max }) => (
          <div key={unit}>
            <InputWell
              type="number"
              min={0}
              max={max}
              value={value}
              onChange={(e) => set(e.target.value)}
              className={timeInputClass}
              placeholder="0"
              aria-label={ariaLabel}
            />
            <div className="mt-1 text-center text-xs text-text-tertiary">{unit}</div>
          </div>
        ))}
      </div>
    </SurfacePanel>
  );
}

export function TimeCalculator() {
  const { t } = useLocale();

  const [hoursA, setHoursA] = useState<string>("2");
  const [minutesA, setMinutesA] = useState<string>("30");
  const [secondsA, setSecondsA] = useState<string>("0");
  const [hoursB, setHoursB] = useState<string>("1");
  const [minutesB, setMinutesB] = useState<string>("45");
  const [secondsB, setSecondsB] = useState<string>("0");
  const [operation, setOperation] = useState<"+" | "-">("+");
  const [mode, setMode] = useState<TimeMode>("duration");

  // Clock mode (start -> end, optional break)
  const [clockStart, setClockStart] = useState("09:00");
  const [clockEnd, setClockEnd] = useState("17:30");
  const [breakMinutes, setBreakMinutes] = useState("");

  // Offset mode (base time +/- duration)
  const [offsetBase, setOffsetBase] = useState("09:00");
  const [offsetHours, setOffsetHours] = useState("7");
  const [offsetMinutes, setOffsetMinutes] = useState("30");
  const [offsetDirection, setOffsetDirection] = useState<"after" | "before">("after");

  const calculateTime = () => {
    const hA = parseTimePart(hoursA, 9999);
    const mA = parseTimePart(minutesA, 999);
    const sA = parseTimePart(secondsA, 999);
    const hB = parseTimePart(hoursB, 9999);
    const mB = parseTimePart(minutesB, 999);
    const sB = parseTimePart(secondsB, 999);

    if (hA === null || mA === null || sA === null || hB === null || mB === null || sB === null) {
      return { error: t.common.invalidInput, isNegative: false, h: 0, m: 0, s: 0, absSeconds: 0 };
    }

    const totalSecondsA = hA * 3600 + mA * 60 + sA;
    const totalSecondsB = hB * 3600 + mB * 60 + sB;
    const resultSeconds =
      operation === "+" ? totalSecondsA + totalSecondsB : totalSecondsA - totalSecondsB;

    const isNegative = resultSeconds < 0;
    const absSeconds = Math.abs(resultSeconds);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;

    return { error: null, isNegative, h, m, s, absSeconds };
  };

  const { error, isNegative, h, m, s, absSeconds } = calculateTime();
  const pad = (num: number) => num.toString().padStart(2, "0");

  // Clock mode, computed live
  const clockStartMin = parseClockTime(clockStart);
  const clockEndMin = parseClockTime(clockEnd);
  const clockDiff =
    clockStartMin !== null && clockEndMin !== null
      ? clockDifference(clockStartMin, clockEndMin)
      : null;
  const breakMin = Math.max(parseInt(breakMinutes, 10) || 0, 0);
  const workingMinutes = clockDiff ? Math.max(clockDiff.minutes - breakMin, 0) : 0;

  // Offset mode, computed live
  const offsetBaseMin = parseClockTime(offsetBase);
  const offsetDuration =
    Math.max(parseInt(offsetHours, 10) || 0, 0) * 60 + Math.max(parseInt(offsetMinutes, 10) || 0, 0);
  const offsetResult =
    offsetBaseMin !== null ? addToClock(offsetBaseMin, offsetDuration, offsetDirection) : null;
  const offsetDaySuffix = offsetResult
    ? offsetResult.dayOffset === 1
      ? t.timePage.nextDaySuffix
      : offsetResult.dayOffset === -1
        ? t.timePage.prevDaySuffix
        : offsetResult.dayOffset > 1
          ? `（${offsetResult.dayOffset}日後）`
          : offsetResult.dayOffset < -1
            ? `（${-offsetResult.dayOffset}日前）`
            : ""
    : "";

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.timePage.title}
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[480px]">
        <div className="space-y-2.5 sm:space-y-3">
          <SegmentedControl
            value={mode}
            onChange={setMode}
            options={[
              { value: "duration", label: t.timePage.modeDuration },
              { value: "clock", label: t.timePage.modeClock },
              { value: "offset", label: t.timePage.modeOffset },
            ]}
          />

          {mode === "duration" && (
            <>
          <TimeBlock
            label={t.time.timeA}
            hours={hoursA}
            minutes={minutesA}
            seconds={secondsA}
            setHours={setHoursA}
            setMinutes={setMinutesA}
            setSeconds={setSecondsA}
          />

          <div className="flex justify-center">
            <SegmentedControl
              value={operation}
              onChange={setOperation}
              options={[
                { value: "+", label: "+" },
                { value: "-", label: "−" },
              ]}
              className="w-full max-w-[280px]"
              size="lg"
            />
          </div>

          <TimeBlock
            label={t.time.timeB}
            hours={hoursB}
            minutes={minutesB}
            seconds={secondsB}
            setHours={setHoursB}
            setMinutes={setMinutesB}
            setSeconds={setSecondsB}
          />

          {error && <ErrorMessage message={error} />}

          {!error && (
            <SurfacePanel className="border-brand/20 bg-brand-muted text-center">
              <div className="text-sm font-medium text-text-tertiary">結果</div>
              <div className="tabular-display mt-2 text-4xl font-bold tracking-tight text-brand">
                {isNegative && "-"}
                {h > 0 ? `${h}時間 ` : ""}
                {m > 0 || h > 0 ? `${m}分 ` : ""}
                {`${s}秒`}
              </div>
              <div className="tabular-display mt-2 text-sm text-text-tertiary">
                ({isNegative && "-"}
                {pad(h)}:{pad(m)}:{pad(s)})
              </div>
              <div className="tabular-display mt-1 text-sm text-text-tertiary">
                {t.timePage.decimalLabel}：{isNegative && "-"}
                {formatDecimalHoursFromSeconds(absSeconds)}時間
                {absSeconds % 60 === 0 && absSeconds > 0
                  ? `（${t.timePage.totalLabel}${absSeconds / 60}分）`
                  : ""}
              </div>
            </SurfacePanel>
          )}
            </>
          )}

          {mode === "clock" && (
            <>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-text-secondary">
                  {t.timePage.startTime}
                </span>
                <InputWell
                  type="time"
                  value={clockStart}
                  onChange={(e) => setClockStart(e.target.value)}
                  className={timeInputClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-text-secondary">
                  {t.timePage.endTime}
                </span>
                <InputWell
                  type="time"
                  value={clockEnd}
                  onChange={(e) => setClockEnd(e.target.value)}
                  className={timeInputClass}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-text-secondary">
                  {t.timePage.breakTime}
                </span>
                <InputWell
                  type="number"
                  min={0}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value)}
                  className={timeInputClass}
                  placeholder="0"
                />
              </label>

              {clockDiff && (
                <SurfacePanel className="border-brand/20 bg-brand-muted text-center">
                  <div className="text-sm font-medium text-text-tertiary">
                    {t.timePage.elapsedTime}
                  </div>
                  <div className="tabular-display mt-2 text-4xl font-bold tracking-tight text-brand">
                    {formatDurationMinutes(clockDiff.minutes)}
                  </div>
                  <div className="tabular-display mt-2 text-sm text-text-tertiary">
                    {t.timePage.decimalLabel}：{formatDecimalHoursFromMinutes(clockDiff.minutes)}
                    時間（{t.timePage.totalLabel}
                    {clockDiff.minutes}分）
                  </div>
                  {breakMin > 0 && (
                    <div className="mt-4 border-t border-brand/20 pt-4">
                      <div className="text-sm font-medium text-text-tertiary">
                        {t.timePage.workingTime}
                      </div>
                      <div className="tabular-display mt-1 text-2xl font-bold text-text-primary">
                        {formatDurationMinutes(workingMinutes)}
                      </div>
                      <div className="tabular-display mt-1 text-sm text-text-tertiary">
                        {t.timePage.decimalLabel}：
                        {formatDecimalHoursFromMinutes(workingMinutes)}時間（
                        {t.timePage.totalLabel}
                        {workingMinutes}分）
                      </div>
                    </div>
                  )}
                  {clockDiff.nextDay && (
                    <p className="mt-3 text-xs text-text-tertiary">{t.timePage.nextDayNote}</p>
                  )}
                </SurfacePanel>
              )}
            </>
          )}

          {mode === "offset" && (
            <>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-text-secondary">
                  {t.timePage.baseTime}
                </span>
                <InputWell
                  type="time"
                  value={offsetBase}
                  onChange={(e) => setOffsetBase(e.target.value)}
                  className={timeInputClass}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-text-secondary">時間（時）</span>
                  <InputWell
                    type="number"
                    min={0}
                    value={offsetHours}
                    onChange={(e) => setOffsetHours(e.target.value)}
                    className={timeInputClass}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-text-secondary">時間（分）</span>
                  <InputWell
                    type="number"
                    min={0}
                    value={offsetMinutes}
                    onChange={(e) => setOffsetMinutes(e.target.value)}
                    className={timeInputClass}
                  />
                </label>
              </div>
              <div className="flex justify-center">
                <SegmentedControl
                  value={offsetDirection}
                  onChange={setOffsetDirection}
                  options={[
                    { value: "after", label: t.timePage.afterLabel },
                    { value: "before", label: t.timePage.beforeLabel },
                  ]}
                  className="max-w-xs"
                />
              </div>

              {offsetResult && (
                <SurfacePanel className="border-brand/20 bg-brand-muted text-center">
                  <div className="text-sm font-medium text-text-tertiary">
                    {t.timePage.offsetResult}
                  </div>
                  <div className="tabular-display mt-2 text-4xl font-bold tracking-tight text-brand">
                    {formatClockTime(offsetResult.minutesOfDay)}
                    {offsetDaySuffix && (
                      <span className="ml-2 text-xl">{offsetDaySuffix}</span>
                    )}
                  </div>
                </SurfacePanel>
              )}
            </>
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.timePage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.timePage.introParagraph} />
      </p>

      <section aria-labelledby="time-examples-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="time-examples-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.timePage.guideExamplesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.timePage.guideExamples.map((ex) => (
            <li key={ex} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {ex}
            </li>
          ))}
        </ul>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">計算</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">モード</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">結果</th>
              </tr>
            </thead>
            <tbody>
              {t.timePage.examplesTable.map((row) => (
                <tr key={row.calc} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.calc}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.mode}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="time-mistakes-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="time-mistakes-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.timePage.guideMistakesTitle}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {t.timePage.guideMistakes.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="time-decimal-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="time-decimal-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.timePage.decimalTitle}
        </h2>
        {t.timePage.decimalParagraphs.map((p) => (
          <p key={p} className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
            {p}
          </p>
        ))}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-border bg-surface-sunken">
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">分</th>
                <th className="px-3 py-2.5 text-left font-semibold text-text-primary">
                  小数（時間）
                </th>
              </tr>
            </thead>
            <tbody>
              {t.timePage.decimalTable.map((row) => (
                <tr key={row.minutes} className="border-b border-border">
                  <td className="px-3 py-2.5 font-medium text-text-primary">{row.minutes}</td>
                  <td className="px-3 py-2.5 text-text-secondary">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CalculatorHowToSection title={t.timePage.howToTitle} steps={t.timePage.howToSteps} />

      <CalculatorFaqSection title={t.timePage.faqTitle} items={t.timePage.faqItems} />
      <RelatedCalculators activeHref="/time-calculator" />
    </>
  );
}
