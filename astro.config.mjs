// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://willsonsmith.com",
  output: "static",
  // All code is intentionally unminified so that others can learn.
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      minify: false,
      cssMinify: false,
    },
  },
});
