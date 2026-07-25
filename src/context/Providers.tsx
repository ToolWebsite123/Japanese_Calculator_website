"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { HistoryProvider } from "./HistoryContext";
import { LocaleProvider } from "./LocaleContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <HistoryProvider>{children}</HistoryProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
