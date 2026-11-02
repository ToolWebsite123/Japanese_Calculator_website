import { createFileRoute } from "@tanstack/react-router";

import Page from "@/ported-pages/character-counter/page";
import { metadata } from "@/ported-pages/character-counter/metadata";
import { buildRouteHead } from "@/lib/seo/route-head";

export const Route = createFileRoute("/character-counter")({
  component: Page,
  head: () => buildRouteHead(metadata, "/character-counter"),
});
