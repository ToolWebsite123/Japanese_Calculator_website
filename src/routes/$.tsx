import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { PageLoading } from "@/components/layout/PageLoading";

// Every real page now has its own route file (src/routes/<slug>.tsx) with a
// static page import, so the framework loads exactly one page chunk per
// route and hydrates it without a Suspense swap (the previous React.lazy
// splat caused a full-page layout shift on every inner page). This splat
// route remains only for two jobs:
//  1. Alias short paths permanently redirect (301) to their canonical route.
//  2. Anything else is an unknown path: beforeLoad throws notFound() so SSR
//     returns a true HTTP 404 (rendered by the root notFoundComponent).
const aliasMap: Record<string, string> = {
  "/algebra": "/algebra-calculator",
  "/bmi": "/bmi-calculator",
  "/compound-interest": "/compound-interest-calculator",
  "/era": "/era-converter",
  "/factorization": "/factorization-calculator",
  "/financial": "/financial-calculator",
  "/fraction": "/fraction-calculator",
  "/interest": "/interest-calculator",
  "/long-division": "/long-division-calculator",
  "/percentage": "/percentage-calculator",
  "/root-calculator": "/squareroot-calculator",
  "/root": "/squareroot-calculator",
  "/scientific": "/scientific-calculator",
  "/simultaneous-equations": "/simultaneous-equations-calculator",
  "/time": "/time-calculator",
};

function normalizePath(path: string): string {
  return path.replace(/\/$/, "") || "/";
}

export const Route = createFileRoute("/$")({
  beforeLoad: ({ params }) => {
    const raw = "/" + (params._splat ?? "").replace(/^\/+/, "");
    const path = normalizePath(raw);
    const target = aliasMap[path];
    if (target) {
      throw redirect({ href: target, statusCode: 301 });
    }
    throw notFound();
  },
  component: PageLoading,
  head: () => ({
    meta: [
      { title: "ページが見つかりません（404）｜電卓.Online" },
      {
        name: "description",
        content:
          "お探しのページは見つかりませんでした。電卓.Onlineのトップページから、目的の計算ツールをお探しください。",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});
