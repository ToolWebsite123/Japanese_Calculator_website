import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/financial-calculator/page";
import { metadata } from "@/ported-pages/financial-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/financial-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/financial-calculator"),
});
