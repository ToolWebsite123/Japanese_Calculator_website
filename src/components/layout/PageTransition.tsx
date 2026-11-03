"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // No fade-in animation here (LCP fix F4): the wrapper used to carry
  // `animate-fade-in` (0.25s opacity from 0), which opacity-gated every
  // page's first-paint text — including the LCP element — behind the
  // animation. The keyed div stays so route changes still remount the
  // page subtree exactly as before; only the opacity gate is gone.
  return <div key={pathname}>{children}</div>;
}
