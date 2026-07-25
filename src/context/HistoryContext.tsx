"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { HISTORY_MAX, HISTORY_STORAGE_KEY } from "@/lib/constants";
import type { HistoryEntry } from "@/lib/history-storage";
import {
  getHistorySnapshot,
  getServerHistorySnapshot,
  readHistoryFromStorage,
  writeHistoryToStorage,
} from "@/lib/history-storage";

export type { HistoryEntry };

type HistoryContextValue = {
  history: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

const historyListeners = new Set<() => void>();

function emitHistoryChange() {
  historyListeners.forEach((listener) => listener());
}

function subscribeHistory(onStoreChange: () => void) {
  historyListeners.add(onStoreChange);
  return () => {
    historyListeners.delete(onStoreChange);
  };
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const history = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getServerHistorySnapshot
  );

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
      const next: HistoryEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
      };
      const current = readHistoryFromStorage();
      writeHistoryToStorage([next, ...current].slice(0, HISTORY_MAX));
      emitHistoryChange();
    },
    []
  );

  const clearHistory = useCallback(() => {
    writeHistoryToStorage([]);
    emitHistoryChange();
  }, []);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === HISTORY_STORAGE_KEY) {
        emitHistoryChange();
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <HistoryContext.Provider
      value={{ history, addEntry, clearHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
