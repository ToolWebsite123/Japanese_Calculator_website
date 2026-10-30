"use client";

import { useState } from "react";
import { CalculatorCard, FormField, ResultCard } from "@/components/ui/FormField";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { CopyResultButton } from "@/components/calculator/CopyResultButton";
import { RelatedCalculators } from "@/components/calculators/RelatedCalculators";
import { LinkedText } from "@/components/calculator/LinkedText";
import { CalculatorFaqSection } from "@/components/calculator/CalculatorFaqSection";
import { CalculatorHowToSection } from "@/components/calculator/CalculatorHowToSection";
import { PrimaryButton, SegmentedControl, SelectWell } from "@/components/ui/primitives";
import { useLocale } from "@/context/LocaleContext";
import { useHistory } from "@/context/HistoryContext";
import { ERAS, eraToWestern, westernToEra, type EraId } from "@/lib/calculators/era";

export function EraConverter() {
  const { t } = useLocale();
  const { addEntry } = useHistory();
  const [direction, setDirection] = useState<"toEra" | "toWestern">("toEra");
  const [westernYear, setWesternYear] = useState("2026");
  const [eraId, setEraId] = useState<EraId>("reiwa");
  const [eraYear, setEraYear] = useState("8");
  const [eraResult, setEraResult] = useState<{
    eraName: string;
    eraYear: number;
  } | null>(null);
  const [westernResult, setWesternResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function eraName(id: EraId) {
    const era = ERAS.find((e) => e.id === id)!;
    return era.nameJa;
  }

  function handleCalculate() {
    setError(null);
    if (direction === "toEra") {
      const y = parseInt(westernYear, 10);
      if (!Number.isFinite(y) || westernYear.trim() === "") {
        setEraResult(null);
        setError(t.common.invalidInput);
        return;
      }
      const res = westernToEra(y);
      if (!res) {
        setEraResult(null);
        setError("対応していない西暦です（1868年以降）");
        return;
      }
      const label = `${eraName(res.era.id)} ${res.eraYear}`;
      setEraResult({ eraName: eraName(res.era.id), eraYear: res.eraYear });
      setWesternResult(null);
      addEntry({
        expression: `${westernYear}`,
        result: label,
        route: "/era-converter",
      });
    } else {
      const y = parseInt(eraYear, 10);
      if (!Number.isFinite(y) || eraYear.trim() === "") {
        setWesternResult(null);
        setError(t.common.invalidInput);
        return;
      }
      const res = eraToWestern(eraId, y);
      if (res === null) {
        setWesternResult(null);
        setError("対応していない和暦の年です");
        return;
      }
      setWesternResult(res);
      setEraResult(null);
      addEntry({
        expression: `${eraName(eraId)} ${eraYear}`,
        result: String(res),
        route: "/era-converter",
      });
    }
  }

  const copyValue =
    direction === "toEra"
      ? eraResult
        ? `${eraResult.eraName}${eraResult.eraYear}`
        : ""
      : westernResult !== null
        ? String(westernResult)
        : "";

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-text-primary sm:mb-5 sm:text-3xl dark:text-[#d6ccf0]">
        {t.eraPage.title}
      </h1>
      <CalculatorCard
        compact
        actions={copyValue ? <CopyResultButton value={copyValue} /> : undefined}
      >
        <div className="space-y-4">
          <SegmentedControl
            value={direction}
            onChange={(v) => {
              setDirection(v);
              setError(null);
            }}
            options={[
              { value: "toEra", label: `${t.era.western} → ${t.era.japanese}` },
              { value: "toWestern", label: `${t.era.japanese} → ${t.era.western}` },
            ]}
          />

          {direction === "toEra" ? (
            <FormField
              label={`${t.era.western} ${t.era.year}`}
              type="number"
              inputMode="numeric"
              value={westernYear}
              onChange={(e) => setWesternYear(e.target.value)}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-text-secondary">{t.era.era}</span>
                <SelectWell value={eraId} onChange={(e) => setEraId(e.target.value as EraId)}>
                  {ERAS.map((era) => (
                    <option key={era.id} value={era.id}>
                      {era.nameJa}
                    </option>
                  ))}
                </SelectWell>
              </label>
              <FormField
                label={t.era.year}
                type="number"
                inputMode="numeric"
                min={1}
                value={eraYear}
                onChange={(e) => setEraYear(e.target.value)}
              />
            </div>
          )}

          <PrimaryButton onClick={handleCalculate}>{t.common.calculate}</PrimaryButton>

          {error && <ErrorMessage message={error} />}

          {direction === "toEra" && eraResult && (
            <ResultCard
              label={t.era.japanese}
              value={`${eraResult.eraName} ${eraResult.eraYear}年`}
              highlight
            />
          )}

          {direction === "toWestern" && westernResult !== null && (
            <ResultCard label={t.era.western} value={`${westernResult}年`} highlight />
          )}
        </div>
      </CalculatorCard>

      <div className="mt-8 space-y-1.5">
        <p className="text-sm text-text-secondary sm:text-base">
          {t.eraPage.description}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
        <LinkedText text={t.eraPage.introParagraph} />
      </p>

      <CalculatorHowToSection title={t.eraPage.howToTitle} steps={t.eraPage.howToSteps} />

      <CalculatorFaqSection title={t.eraPage.faqTitle} items={t.eraPage.faqItems} />
      <RelatedCalculators activeHref="/era-converter" />
    </>
  );
}
