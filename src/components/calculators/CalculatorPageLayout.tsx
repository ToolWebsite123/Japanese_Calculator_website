"use client";

import { createContext, type ReactNode } from "react";

const CalculatorPageContext = createContext<string | null>(null);

export function CalculatorPageLayout({
  children,
  activeHref,
}: {
  children: ReactNode;
  activeHref: string;
}) {
  return (
    <CalculatorPageContext.Provider value={activeHref}>
      {/* Minimal top padding so the calculator card (each page's first block,
          horizontally centered via the card's own mx-auto) sits immediately
          below the site header, per the owner's layout instruction. Bottom
          padding stays larger for the heading/content sections below. */}
      <div className="mx-auto max-w-6xl px-4 pt-2 pb-4 sm:px-6 sm:pt-3 sm:pb-6" suppressHydrationWarning>
        {children}
      </div>
    </CalculatorPageContext.Provider>
  );
}
