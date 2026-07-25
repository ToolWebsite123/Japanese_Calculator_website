"use client";

import React from "react";
import { useRouterState } from "@tanstack/react-router";
import Link from "@/compat/next-link";

// Ordered longest-first within each href group. Every entry maps a Japanese
// calculator name to its route so plain text mentions become internal links.
const LINK_MAP: Array<{ text: string; href: string }> = [
  { text: "社会保険料計算機", href: "/social-insurance-calculator" },
  { text: "失業保険 計算", href: "/unemployment-insurance-calculation" },
  { text: "失業保険計算", href: "/unemployment-insurance-calculation" },
  { text: "失業保険", href: "/unemployment-insurance-calculation" },
  { text: "社会保険料計算", href: "/social-insurance-calculator" },
  { text: "Web電卓", href: "/web-calculator" },
  { text: "web電卓", href: "/web-calculator" },
  { text: "電卓web", href: "/web-calculator" },
  { text: "和暦西暦変換", href: "/era-converter" },
  { text: "元号変換", href: "/era-converter" },
  { text: "素因数分解計算機", href: "/factorization-calculator" },
  { text: "因数分解計算機", href: "/factorization-calculator" },
  { text: "連立方程式計算機", href: "/simultaneous-equations-calculator" },
  { text: "連立方程式", href: "/simultaneous-equations-calculator" },
  { text: "複利計算機", href: "/compound-interest-calculator" },
  { text: "複利計算", href: "/compound-interest-calculator" },
  { text: "利息計算", href: "/interest-calculator" },
  { text: "パーセンテージ計算", href: "/percentage-calculator" },
  { text: "パーセント計算機", href: "/percentage-calculator" },
  { text: "パーセント計算", href: "/percentage-calculator" },
  { text: "単位変換", href: "/unit-converter" },
  { text: "単位換算", href: "/unit-converter" },
  { text: "BMI計算機", href: "/bmi-calculator" },
  { text: "BMIの計算", href: "/bmi-calculator" },
  { text: "BMI計算", href: "/bmi-calculator" },
  { text: "関数電卓", href: "/scientific-calculator" },
  { text: "分数計算機", href: "/fraction-calculator" },
  { text: "分数電卓", href: "/fraction-calculator" },
  { text: "平方根計算機", href: "/squareroot-calculator" },
  { text: "平方根電卓", href: "/squareroot-calculator" },
  { text: "ルート計算機", href: "/squareroot-calculator" },
  { text: "ルート電卓", href: "/squareroot-calculator" },
  { text: "文字式計算機", href: "/algebra-calculator" },
  { text: "金融電卓", href: "/financial-calculator" },
  { text: "金融計算", href: "/financial-calculator" },
  { text: "時間計算機", href: "/time-calculator" },
  { text: "時間計算", href: "/time-calculator" },
  { text: "筆算電卓", href: "/long-division-calculator" },
  { text: "筆算計算機", href: "/long-division-calculator" },
  { text: "筆算", href: "/long-division-calculator" },
  { text: "割引 計算", href: "/discount-calculation" },
  { text: "割引計算", href: "/discount-calculation" },
  { text: "出産予定日 計算", href: "/due-date-calculation" },
  { text: "出産予定日計算", href: "/due-date-calculation" },
  { text: "出産予定日", href: "/due-date-calculation" },
  { text: "麻雀 点数 計算", href: "/mahjong-score-calculation" },
  { text: "麻雀点数計算", href: "/mahjong-score-calculation" },
  { text: "麻雀 点数", href: "/mahjong-score-calculation" },
  { text: "所得税 計算", href: "/income-tax-calculation" },
  { text: "ふるさと納税 シミュレーション", href: "/furusato-nozei-simulation-calculation" },
  { text: "ふるさと納税", href: "/furusato-nozei-calculation" },
];

const LINK_CLASS =
  "text-brand underline underline-offset-2 hover:text-brand/80";

export function linkify(
  text: string,
  activeHref?: string | null
): React.ReactNode {
  if (!text) return text;
  const parts: React.ReactNode[] = [];
  const linkedHrefs = new Set<string>();
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let best: { text: string; href: string; index: number } | null = null;
    for (const m of LINK_MAP) {
      if (m.href === activeHref) continue;
      if (linkedHrefs.has(m.href)) continue;
      const idx = remaining.indexOf(m.text);
      if (idx === -1) continue;
      if (
        !best ||
        idx < best.index ||
        (idx === best.index && m.text.length > best.text.length)
      ) {
        best = { text: m.text, href: m.href, index: idx };
      }
    }
    if (!best) {
      parts.push(remaining);
      break;
    }
    if (best.index > 0) parts.push(remaining.slice(0, best.index));
    parts.push(
      <Link key={`lt-${key++}`} href={best.href} className={LINK_CLASS}>
        {best.text}
      </Link>
    );
    linkedHrefs.add(best.href);
    remaining = remaining.slice(best.index + best.text.length);
  }

  return <>{parts}</>;
}

export function LinkedText({
  text,
  activeHref,
}: {
  text: string;
  activeHref?: string | null;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = activeHref ?? pathname;
  return <>{linkify(text, active)}</>;
}
