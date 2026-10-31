import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/social-insurance-calculator/page";
import { metadata } from "@/ported-pages/social-insurance-calculator/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/social-insurance-calculator")({
  component: Page,
  head: () => buildRouteHead(metadata, "/social-insurance-calculator"),
});
