"use client";

/**
 * Neutral loading state shown while a route is being fetched/rendered.
 *
 * Used as the router's defaultPendingComponent and as the catch-all route's
 * transient fallback, so a slow navigation shows an honest "loading"
 * indicator instead of stale content or any error-looking page. It must
 * never contain 404 / error copy.
 */
export function PageLoading() {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-16"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-border border-t-brand"
      />
      <p className="text-sm text-text-secondary">読み込み中…</p>
    </div>
  );
}
