import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const authors = defineCollection({
  loader: glob({ base: "./src/content/authors", pattern: "*.json" }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      first_name: z.string(),
      last_name: z.string().optional(),
      full_name: z.string(),
      email: z.string().email().optional(),
      role: z.string().optional(),
      picture: image(),
      punchline: z.string().optional(),
      themes: z.array(z.string()).optional(),
      public: z.boolean().optional().default(false),
    }),
});

export const collections = {
  authors,
};
