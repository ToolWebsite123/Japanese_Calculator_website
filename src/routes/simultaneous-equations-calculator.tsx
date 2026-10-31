import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/simultaneous-equations-calculator/page";
import { metadata } from "@/ported-pages/simultaneous-equations-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/simultaneous-equations-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/simultaneous-equations-calculator"),
});
