import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

// Home-page sections, authored as markdown with frontmatter.
const index = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/index" }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

export const collections = { index };
