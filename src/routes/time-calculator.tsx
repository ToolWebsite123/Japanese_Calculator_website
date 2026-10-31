import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/time-calculator/page";
import { metadata } from "@/ported-pages/time-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/time-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/time-calculator"),
});
