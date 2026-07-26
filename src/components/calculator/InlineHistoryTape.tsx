"use client";

import { useEffect, useRef } from "react";
import { useHistoryForRoute } from "@/context/HistoryContext";
import { useLocale } from "@/context/LocaleContext";

type InlineHistoryTapeProps = {
  onSelect?: (expression: string, result: string) => void;
  onOpenFullHistory?: () => void;
  compact?: boolean;
  route?: string;
};

export function InlineHistoryTape({
  onSelect,
  onOpenFullHistory,
  compact = false,
  route,
}: InlineHistoryTapeProps) {
  const { history, allHistory } = useHistoryForRoute(route);
  const { t } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Take the latest 6 history entries for this calculator route, reversed so the most recent is at the bottom
  const recentEntries = history.slice(0, 6).reverse();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history.length]);

  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-border/70 bg-surface-sunken/60 p-2 text-xs transition-colors dark:bg-surface-sunken/30 ${
        compact ? "mb-1.5 p-1.5" : "mb-3"
      }`}
    >
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
          {t.nav.history}
        </span>
        {onOpenFullHistory && (
          <button
            type="button"
            onClick={onOpenFullHistory}
            className="text-[11px] font-medium text-brand hover:underline dark:text-[#d6ccf0]"
          >
            {allHistory.length > 0 ? `すべて表示 (${allHistory.length})` : "履歴一覧"}
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="max-h-[4.5rem] overflow-y-auto space-y-1 pr-1 scrollbar-thin md:max-h-[9.5rem]"
      >
        {history.length === 0 ? (
          <div className="py-1 px-1 text-center text-[11px] text-text-tertiary italic">
            {t.common.historyEmpty}
          </div>
        ) : (
          recentEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect?.(entry.expression, entry.result)}
              className="group flex w-full items-center justify-between rounded px-2 py-1 text-left transition hover:bg-surface-raised dark:hover:bg-zinc-800/80"
              title="計算結果を再利用"
            >
              <span className="truncate text-[11px] text-text-secondary group-hover:text-text-primary sm:text-xs">
                {entry.expression}
              </span>
              <span className="ml-2 shrink-0 tabular-display text-[11px] font-semibold text-text-primary sm:text-xs">
                = {entry.result}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
