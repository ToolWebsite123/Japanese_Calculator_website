"use client";

import { useMemo, useState } from "react";
import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { IconButton, SecondaryButton } from "@/components/ui/primitives";

type HistoryPanelProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (expression: string, result: string) => void;
  route?: string;
};

export function HistoryPanel({ open, onClose, onSelect, route }: HistoryPanelProps) {
  const { history: allHistory, clearHistory } = useHistory();
  const [filterMode, setFilterMode] = useState<"current" | "all">(route ? "current" : "all");
  const { t } = useLocale();

  const routeCount = useMemo(() => {
    if (!route) return allHistory.length;
    return allHistory.filter((e) => e.route === route).length;
  }, [allHistory, route]);

  const displayedHistory = useMemo(() => {
    if (filterMode === "current" && route) {
      return allHistory.filter((e) => e.route === route);
    }
    return allHistory;
  }, [allHistory, filterMode, route]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-surface-raised animate-slide-in-right"
        style={{ boxShadow: "var(--shadow-card)" }}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.history}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold text-text-primary">{t.nav.history}</h2>
          <IconButton onClick={onClose} aria-label={t.common.close}>
            ✕
          </IconButton>
        </div>

        {route && (
          <div className="flex gap-1 border-b border-border bg-surface-sunken/40 p-2">
            <button
              type="button"
              onClick={() => setFilterMode("current")}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                filterMode === "current"
                  ? "bg-surface-raised text-brand shadow-sm font-semibold dark:text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              この計算機 ({routeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                filterMode === "all"
                  ? "bg-surface-raised text-brand shadow-sm font-semibold dark:text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              すべての計算機 ({allHistory.length})
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {displayedHistory.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-tertiary">{t.common.historyEmpty}</p>
          ) : (
            <ul className="space-y-2">
              {displayedHistory.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className="w-full rounded-[var(--radius-md)] border border-border bg-surface-sunken p-3 text-left transition hover:bg-border-subtle"
                    onClick={() => {
                      onSelect?.(entry.expression, entry.result);
                      onClose();
                    }}
                  >
                    <div className="truncate text-xs text-text-tertiary">{entry.expression}</div>
                    <div className="tabular-display mt-0.5 font-semibold text-text-primary">
                      = {entry.result}
                    </div>
                    <div className="mt-1 text-[10px] text-text-tertiary">
                      {entry.route} · {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {allHistory.length > 0 && (
          <div className="border-t border-border p-4">
            <SecondaryButton fullWidth onClick={clearHistory} className="text-brand">
              {t.common.historyClear}
            </SecondaryButton>
          </div>
        )}
      </aside>
    </>
  );
}
