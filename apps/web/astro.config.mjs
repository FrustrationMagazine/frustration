import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

/** @type {import("prettier").Config} */
// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://frustrationmagazine.fr/",
  prefetch: true,
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [react(), tailwind(), sitemap()],
  image: {
    // To optimize external wordpress images
    domains: ["adminfrustrationmagazine.fr"],
  },
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
});
