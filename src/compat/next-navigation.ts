import { useNavigate, useRouterState } from "@tanstack/react-router";

export function usePathname() {
  return useRouterState({ select: (state) => state.location.pathname });
}

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (href: string) => navigate({ to: href as never }),
    replace: (href: string) => navigate({ to: href as never, replace: true }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
  };
}