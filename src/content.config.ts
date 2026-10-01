import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every page of the original site, scraped into local JSON by scripts/scrape.py.
 * Nothing here is fetched at runtime.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/pages' }),
  schema: z.object({
    path: z.string(),
    title: z.string().default(''),
    description: z.string().default(''),
    eyebrow: z.string().default(''),
    h1: z.string().default(''),
    date: z.string().default(''),
    kind: z.string().default('page'),
    featured: z.string().default(''),
    canonical: z.string().default(''),
    images: z.array(z.string()).default([]),
    blocks: z.array(z.any()).default([]),
  }),
});

export const collections = { pages };
