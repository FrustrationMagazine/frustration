import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";


/** @type {import("prettier").Config} */
// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  site: 'https://frustration-magazine.vercel.app',
  prefetch: true,
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [react(), tailwind()],
  image: {
    // To download external wordpress images
    domains: ["i0.wp.com"],
  },
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
});
