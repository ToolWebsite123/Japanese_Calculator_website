// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

// Nitro forwards `cloudflare.wrangler` into the generated wrangler config
// at build time (nitro's CloudflareOptions), but the Lovable wrapper's
// published types only declare nodeCompat/deployConfig for `cloudflare`.
// This object is therefore built separately and passed by reference —
// inlining it as a literal would trip the wrapper's excess-property check.
const nitroOptions = {
  cloudflare: {
    // Same values the build already generates with (see .output/nitro.json);
    // declared here so the object shares known keys with the wrapper's type.
    nodeCompat: true,
    deployConfig: true,
    wrangler: {
      assets: {
        // The GSC verification file (public/google39f0ca4d252248af.html)
        // must be served at its exact .html path with 200. Cloudflare
        // Workers Assets' default html_handling instead 308-redirects
        // *.html requests to the extensionless path before the worker
        // runs. "none" disables that rewriting (the only .html asset is
        // this file; every page is SSR), so the assets layer serves the
        // file at its literal path directly. The extensionless path
        // matches no file and falls through to the worker, where
        // src/server.ts answers it with the same body.
        // NOTE: do not set run_worker_first to a path array here — the
        // Pages deploy pipeline's wrangler expects a boolean and rejects
        // the whole generated config (deploy step fails) when it is an
        // array.
        html_handling: "none",
      },
    },
  },
};

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "next/link": path.resolve(__dirname, "src/compat/next-link.tsx"),
        "next/navigation": path.resolve(__dirname, "src/compat/next-navigation.ts"),
        "next/script": path.resolve(__dirname, "src/compat/next-script.tsx"),
        "next/og": path.resolve(__dirname, "src/compat/next-og.tsx"),
        next: path.resolve(__dirname, "src/compat/next.ts"),
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: nitroOptions,
});
