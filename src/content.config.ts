
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const news = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/news",
    }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        summary: z.string(),
        type: z.enum(["story", "event", "memo"]),
        image: z.string(),
        publishedAt: z.string(),
        status: z.enum(["draft", "published"]).default("draft"),
        featured: z.boolean().default(false),
        eventDate: z.string().optional(),
        eventTime: z.string().optional(),
        venue: z.string().optional(),
        tags: z.array(z.string()).default([]),
    }),
});

export const collections = { news };
