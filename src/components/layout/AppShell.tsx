"use client";

import { useState, useId, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CalculatorPageLayout } from "@/components/calculators/CalculatorPageLayout";
import { NAV_ITEMS } from "@/lib/constants";
import { normalizePath } from "@/lib/path";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { PageTransition } from "./PageTransition";

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();
  const normalizedPath = normalizePath(pathname);
  const isCalculatorPage = NAV_ITEMS.some((item) => item.href === normalizedPath);
  const isHomePage = normalizedPath === "/";

  const content = isCalculatorPage ? (
    <main className="flex-1 overflow-x-hidden">
      <CalculatorPageLayout activeHref={normalizedPath}>
        <PageTransition>{children}</PageTransition>
      </CalculatorPageLayout>
    </main>
  ) : (
    <main className="flex-1 overflow-x-hidden px-3 py-4 pb-24 sm:px-6 sm:py-6 lg:pb-8">
      <PageTransition>{children}</PageTransition>
    </main>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Navbar onMenuOpen={() => setMenuOpen(true)} menuOpen={menuOpen} menuId={menuId} />
        {isHomePage ? (
          <main className="flex-1 overflow-x-hidden">
            <PageTransition>{children}</PageTransition>
          </main>
        ) : (
          content
        )}
        <Footer />
      </div>
      <MobileNav menuOpen={menuOpen} onMenuClose={() => setMenuOpen(false)} menuId={menuId} />
    </div>
  );
}
