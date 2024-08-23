import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from '@astrojs/vercel/serverless';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [react(), tailwind()],
  image: {
    domains: ["i0.wp.com"],
  },
});
