import { createRouter } from "@tanstack/react-router";
import { PageLoading } from "./components/layout/PageLoading";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  // No QueryClient in the router context (LCP fix F2): nothing in the app
  // uses react-query (no useQuery/useMutation anywhere), so the library
  // only added dead weight to the entry chunk every page preloads.
  const router = createRouter({
    routeTree,
    context: {},
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
