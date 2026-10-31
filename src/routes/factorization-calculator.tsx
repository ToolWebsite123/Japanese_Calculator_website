import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/factorization-calculator/page";
import { metadata } from "@/ported-pages/factorization-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/factorization-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/factorization-calculator"),
});
