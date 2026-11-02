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

const ERA_EXAMPLES = [
  {
    title: "例1：2025年を和暦に変換する",
    body: "2025年は令和が始まった2019年から7年目なので、令和7年です（2019 + 7 − 1 = 2025）。",
  },
  {
    title: "例2：昭和64年を西暦に変換する",
    body: "昭和の開始年は1926年なので、1926 + 64 − 1 = 1989年です。昭和64年は1989年1月7日までで終わりました。",
  },
  {
    title: "例3：1989年1月7日と1月8日",
    body: "1989年1月7日は昭和64年、翌日の1月8日は平成元年です。改元の年は、同じ西暦年に2つの元号が存在します。",
  },
  {
    title: "例4：2019年4月30日と5月1日",
    body: "2019年4月30日は平成31年、翌日の5月1日は令和元年です。平成から令和への改元は、2019年5月1日に行われました。",
  },
  {
    title: "例5：1995年を和暦に変換する",
    body: "1995年は平成7年です（1989 + 7 − 1 = 1995）。履歴書の生年月日欄などで、生まれた年を和暦で書くときに使えます。",
  },
  {
    title: "例6：昭和45年を西暦に変換する",
    body: "昭和の開始年は1926年なので、1926 + 45 − 1 = 1970年です。親世代の生まれた年や、古い書類の日付を確認するときによく使われます。",
  },
] as const;

const ERA_MISTAKES = [
  "「元年」を0年として数えてしまう（元年は1年です。西暦 = 元号の開始年 + 和暦の年数 − 1 で計算します）",
  "改元の年には2つの元号があることを忘れる（例：1989年は1月7日まで昭和、1月8日から平成です）",
  "明治より前の年（江戸時代など）にこの換算を当てはめる（本ツールの対象は明治以降です）",
  "大正と昭和の境目を取り違える（昭和は1926年12月25日に始まりました）",
] as const;

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

      <section aria-labelledby="era-memory-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="era-memory-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.eraPage.guideMemoryTitle}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {t.eraPage.guideMemoryItems.map((item) => (
            <li
              key={item}
              className="rounded-full border border-border bg-surface-sunken px-3 py-1.5 text-sm text-text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
          {t.eraPage.guideMemoryExample}
        </p>
      </section>

      <section
        aria-labelledby="era-examples-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2
          id="era-examples-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          変換の計算例
        </h2>
        <div className="mt-4 space-y-4">
          {ERA_EXAMPLES.map((ex) => (
            <div key={ex.title}>
              <h3 className="text-base font-semibold text-text-primary">{ex.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">
                {ex.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="era-table-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="era-table-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.eraPage.guideTableTitle}
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr>
                {t.eraPage.guideTableHead.map((cell) => (
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
              {t.eraPage.guideTableRows.map((row) => (
                <tr key={row[0] + row[1]}>
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
      </section>

      <section aria-labelledby="era-note-heading" className="mt-16 border-t border-border pt-16">
        <h2
          id="era-note-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          {t.eraPage.guideNoteTitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">{t.eraPage.guideNoteBody}</p>
      </section>

      <section
        aria-labelledby="era-mistakes-heading"
        className="mt-16 border-t border-border pt-16"
      >
        <h2
          id="era-mistakes-heading"
          className="text-2xl font-bold tracking-tight text-[#231942] sm:text-3xl dark:text-[#d6ccf0]"
        >
          よくある間違い
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {ERA_MISTAKES.map((m) => (
            <li key={m} className="text-sm leading-relaxed text-text-secondary sm:text-base">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <CalculatorHowToSection title={t.eraPage.howToTitle} steps={t.eraPage.howToSteps} />

      <CalculatorFaqSection title={t.eraPage.faqTitle} items={t.eraPage.faqItems} />
      <RelatedCalculators activeHref="/era-converter" />
    </>
  );
}
