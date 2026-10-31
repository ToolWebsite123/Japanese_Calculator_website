import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/fraction-calculator/page";
import { metadata } from "@/ported-pages/fraction-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/fraction-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/fraction-calculator"),
});
