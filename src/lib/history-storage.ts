import { HISTORY_MAX, HISTORY_STORAGE_KEY } from "@/lib/constants";

export type HistoryEntry = {
  id: string;
  expression: string;
  result: string;
  route: string;
  timestamp: number;
};

const EMPTY_HISTORY: HistoryEntry[] = [];

let cachedRaw = "";
let cachedSnapshot: HistoryEntry[] = EMPTY_HISTORY;

function parseHistory(raw: string): HistoryEntry[] {
  if (!raw) {
    return EMPTY_HISTORY;
  }

  try {
    const parsed = JSON.parse(raw) as HistoryEntry[];
    if (!Array.isArray(parsed)) {
      return EMPTY_HISTORY;
    }

    const sliced = parsed.slice(0, HISTORY_MAX);
    return sliced.length === 0 ? EMPTY_HISTORY : sliced;
  } catch {
    return EMPTY_HISTORY;
  }
}

function refreshHistoryCache(raw: string): HistoryEntry[] {
  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;
  cachedSnapshot = parseHistory(raw);
  return cachedSnapshot;
}

export function getServerHistorySnapshot(): HistoryEntry[] {
  return EMPTY_HISTORY;
}

export function getHistorySnapshot(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return EMPTY_HISTORY;
  }

  const raw = localStorage.getItem(HISTORY_STORAGE_KEY) ?? "";
  return refreshHistoryCache(raw);
}

export function readHistoryFromStorage(): HistoryEntry[] {
  return getHistorySnapshot();
}

export function writeHistoryToStorage(entries: HistoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  const next = entries.length === 0 ? EMPTY_HISTORY : entries.slice(0, HISTORY_MAX);
  const raw = next.length === 0 ? "" : JSON.stringify(next);

  cachedRaw = raw;
  cachedSnapshot = next.length === 0 ? EMPTY_HISTORY : next;
  localStorage.setItem(HISTORY_STORAGE_KEY, raw);
}
