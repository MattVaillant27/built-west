import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const episodes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/episodes' }),
  schema: ({ image }) =>
    z.object({
      number: z.number().int().positive(),
      title: z.string(),
      date: z.coerce.date(),
      duration: z.string(), // e.g. "58 min"
      summary: z.string(),
      draft: z.boolean().default(false),
      guest: z.object({
        name: z.string(),
        role: z.string(),
        company: z.string(),
        bio: z.string().optional(),
        photo: image().optional(),
        links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
      }),
      riversideEmbed: z.url().optional(),
      listen: z
        .object({ apple: z.url().optional(), spotify: z.url().optional(), youtube: z.url().optional() })
        .default({}),
      chapters: z.array(z.object({ time: z.string(), title: z.string() })).default([]),
      quote: z.string().optional(),
      mentioned: z.array(z.object({ label: z.string(), url: z.url().optional() })).default([]),
    }),
});

export const collections = { episodes };
