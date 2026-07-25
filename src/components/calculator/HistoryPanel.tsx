"use client";

import { useHistory } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";
import { IconButton, SecondaryButton } from "@/components/ui/primitives";

type HistoryPanelProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (expression: string, result: string) => void;
};

export function HistoryPanel({ open, onClose, onSelect }: HistoryPanelProps) {
  const { history, clearHistory } = useHistory();
  const { t } = useLocale();

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

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-tertiary">
              {t.common.historyEmpty}
            </p>
          ) : (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className="w-full rounded-[var(--radius-md)] border border-border bg-surface-sunken p-3 text-left transition hover:bg-border-subtle"
                    onClick={() => {
                      onSelect?.(entry.expression, entry.result);
                      onClose();
                    }}
                  >
                    <div className="truncate text-xs text-text-tertiary">
                      {entry.expression}
                    </div>
                    <div className="tabular-display mt-0.5 font-semibold text-text-primary">
                      = {entry.result}
                    </div>
                    <div className="mt-1 text-[10px] text-text-tertiary">
                      {entry.route} ·{" "}
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {history.length > 0 && (
          <div className="border-t border-border p-4">
            <SecondaryButton
              fullWidth
              onClick={clearHistory}
              className="text-brand"
            >
              {t.common.historyClear}
            </SecondaryButton>
          </div>
        )}
      </aside>
    </>
  );
}
