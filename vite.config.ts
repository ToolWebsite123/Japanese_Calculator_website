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
//
// Do NOT add a `wrangler` key here. Production deploy logs (2026-11-03)
// proved the Cloudflare Pages pipeline validates the generated
// dist/_worker.js/wrangler.json strictly and rejects the whole deploy
// when the config carries an `assets` key ("Configuration file for Pages
// projects does not support \"assets\""; an array `assets.run_worker_first`
// also fails its boolean type check). Any `wrangler.assets` option —
// including the html_handling override once used for the GSC
// verification file — therefore blocks EVERY publish. The GSC file is
// served by src/server.ts at its extensionless path instead, and domain
// verification uses a DNS TXT record, which needs no config support.
const nitroOptions = {
  cloudflare: {
    // Same values the build already generates with (see .output/nitro.json);
    // declared here so the object shares known keys with the wrapper's type.
    nodeCompat: true,
    deployConfig: true,
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
