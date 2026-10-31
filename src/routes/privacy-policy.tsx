import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/privacy-policy/page";
import { metadata } from "@/ported-pages/privacy-policy/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/privacy-policy")({
  component: Page,
  head: () => buildRouteHead(metadata, "/privacy-policy"),
});
