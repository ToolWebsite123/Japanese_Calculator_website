"use client";

import { createContext, useContext, type ReactNode } from "react";
import ja, { type Dictionary } from "@/lib/i18n/ja";

type LocaleContextValue = {
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue>({ t: ja });

export function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ t: ja }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
