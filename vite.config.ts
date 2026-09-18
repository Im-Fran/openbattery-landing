import { extname, resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Connect, type Plugin } from "vite";

/** Static hosts serve /support from support/index.html. Vite's own servers
    don't, so without this /support 404s locally while working in production —
    the kind of gap you only find after shipping the link to someone. */
function cleanUrls(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const [path = "/", query] = (req.url ?? "/").split("?");
    // /@vite/client and .well-known files have no extension either, and are
    // not pages
    const skip = ["/@", "/node_modules", "/.well-known"];
    if (!extname(path) && !skip.some((prefix) => path.startsWith(prefix))) {
      req.url = path.replace(/\/*$/, "/index.html") + (query ? `?${query}` : "");
    }
    next();
  };

  return {
    name: "clean-urls",
    configureServer: (server) => () => server.middlewares.use(rewrite),
    configurePreviewServer: (server) => () => server.middlewares.use(rewrite),
  };
}

// Two real documents rather than a router: each ships its own <title>,
// canonical and Open Graph, and /support works with JavaScript switched off.
export default defineConfig({
  plugins: [react(), cleanUrls()],
  // no SPA fallback: an unknown path must 404, not quietly serve the landing
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        support: resolve(import.meta.dirname, "support/index.html"),
      },
    },
  },
});
