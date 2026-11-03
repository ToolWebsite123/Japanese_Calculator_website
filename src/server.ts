import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Baseline security headers for HTML responses (audit H-06). A full CSP is
// intentionally not set here: the app loads Google Fonts and inline scripts,
// so a CSP needs its own dedicated pass; clickjacking is covered by
// X-Frame-Options: DENY.
const SECURITY_HEADERS: Record<string, string> = {
  "strict-transport-security": "max-age=63072000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

// Google Search Console HTML-file verification: the file in public/ must
// answer at its EXACT path with 200. The hosting layer (Cloudflare Workers
// Assets, default html_handling) redirects any *.html request to the
// extensionless path with a 308 before app code runs, which can fail
// Google's exact-URL check — so vite.config.ts also sets
// html_handling: "none" + run_worker_first for this path, and this handler
// serves the body itself as the app-level guarantee once the worker runs
// first. The body must stay byte-identical to
// public/google39f0ca4d252248af.html.
const GSC_VERIFICATION_PATH = "/google39f0ca4d252248af.html";
// Until now the extensionless path was also served the same body by the
// CDN's .html handling; keep answering it so that URL does not change.
const GSC_VERIFICATION_ALIAS_PATH = "/google39f0ca4d252248af";
const GSC_VERIFICATION_BODY = "google-site-verification: google39f0ca4d252248af.html\n";

function withSecurityHeaders(response: Response): Response {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!secured.headers.has(name)) secured.headers.set(name, value);
  }
  return secured;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // Canonical URLs have no trailing slash (see the sitemap); the
    // framework would answer slashed URLs with a temporary 307, so make
    // the redirect permanent (301) here. Root "/" itself is untouched.
    if (request.method === "GET" || request.method === "HEAD") {
      const url = new URL(request.url);
      if (url.pathname === GSC_VERIFICATION_PATH || url.pathname === GSC_VERIFICATION_ALIAS_PATH) {
        return new Response(request.method === "HEAD" ? null : GSC_VERIFICATION_BODY, {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "public, max-age=0, must-revalidate",
            "content-length": String(new TextEncoder().encode(GSC_VERIFICATION_BODY).length),
          },
        });
      }
      if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
        url.pathname = url.pathname.replace(/\/+$/, "");
        return new Response(null, {
          status: 301,
          headers: { location: url.toString() },
        });
      }
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
