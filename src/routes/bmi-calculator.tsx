import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/bmi-calculator/page";
import { metadata } from "@/ported-pages/bmi-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/bmi-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/bmi-calculator"),
});
