import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { PageLoading } from "./components/layout/PageLoading";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Preload routes on hover/touch intent so calculator pages open
    // instantly instead of fetching on click.
    defaultPreload: "intent",
    // On slow connections a navigation can outlast defaultPendingMs; show
    // the neutral loading state (kept for at least defaultPendingMinMs to
    // avoid flicker) rather than leaving a stale page or anything that
    // looks like an error page on screen.
    defaultPendingMs: 200,
    defaultPendingMinMs: 300,
    defaultPendingComponent: PageLoading,
  });

  return router;
};
