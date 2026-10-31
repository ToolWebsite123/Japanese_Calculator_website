import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/percentage-calculator/page";
import { metadata } from "@/ported-pages/percentage-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/percentage-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/percentage-calculator"),
});
