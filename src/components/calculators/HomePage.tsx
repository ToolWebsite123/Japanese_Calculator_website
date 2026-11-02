"use client";

import { Hero } from "@/components/home/Hero";

export function HomePage() {
  return (
    <div suppressHydrationWarning>
      <Hero />

      {/* Homepage = calculator only (owner's repeated, final decision
          2026-11-02). Content sections were added and removed twice at
          his direction; the last set (category browser / guide / about
          / FAQ / CTA) was deleted from the backend completely on
          2026-11-02 together with its ja.ts strings and the FAQ
          JSON-LD, at his explicit instruction that nothing unused may
          remain in the backend. Do not re-add homepage sections
          without a new explicit owner decision. */}
    </div>
  );
}
