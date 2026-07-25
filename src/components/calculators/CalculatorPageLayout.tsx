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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>
    </CalculatorPageContext.Provider>
  );
}

