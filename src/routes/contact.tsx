import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/contact/page";
import { metadata } from "@/ported-pages/contact/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () => buildRouteHead(metadata, "/contact"),
});
