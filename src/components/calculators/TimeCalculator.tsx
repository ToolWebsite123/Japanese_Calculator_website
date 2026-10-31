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
          { value: minutes, set: setMinutes, unit: "分", ariaLabel: `${label}の分`, max: 59 },
          { value: seconds, set: setSeconds, unit: "秒", ariaLabel: `${label}の秒`, max: 59 },
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

  const calculateTime = () => {
    const hA = parseTimePart(hoursA, 9999);
    const mA = parseTimePart(minutesA, 59);
    const sA = parseTimePart(secondsA, 59);
    const hB = parseTimePart(hoursB, 9999);
    const mB = parseTimePart(minutesB, 59);
    const sB = parseTimePart(secondsB, 59);

    if (hA === null || mA === null || sA === null || hB === null || mB === null || sB === null) {
      return { error: t.common.invalidInput, isNegative: false, h: 0, m: 0, s: 0 };
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

    return { error: null, isNegative, h, m, s };
  };

  const { error, isNegative, h, m, s } = calculateTime();
  const pad = (num: number) => num.toString().padStart(2, "0");

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.timePage.title}
      </h1>
      <CalculatorCard compact maxWidthClass="max-w-[480px]">
        <div className="space-y-2.5 sm:space-y-3">
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
              className="max-w-xs"
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
            </SurfacePanel>
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

      <CalculatorHowToSection title={t.timePage.howToTitle} steps={t.timePage.howToSteps} />

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

      <CalculatorFaqSection title={t.timePage.faqTitle} items={t.timePage.faqItems} />
      <RelatedCalculators activeHref="/time-calculator" />
    </>
  );
}
