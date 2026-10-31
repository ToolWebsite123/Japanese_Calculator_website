import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/algebra-calculator/page";
import { metadata } from "@/ported-pages/algebra-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/algebra-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/algebra-calculator"),
});
