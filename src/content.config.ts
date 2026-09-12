import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content as data; two renderers.
 *
 * Everything the site shows about a piece of work lives in one markdown file.
 * The plain site renders it as pages. A future 3D "museum" renders the same
 * records as plaques and screens. Edit a description once, both change.
 *
 * These schemas are validated at build time: a missing `hook` fails the build
 * rather than shipping an empty page.
 */

const rooms = defineCollection({
  loader: glob({ base: './src/content/rooms', pattern: '**/*.md' }),
  schema: z.object({
    /** Display name, e.g. "Tech Art". */
    name: z.string(),
    /** One line describing what this room is about. */
    blurb: z.string(),
    /** Ordering across the site and, later, physical layout in the museum. */
    order: z.number(),
  }),
});

const mediaItem = z.object({
  type: z.enum(['video', 'image']),
  /** URL or path. Videos are hosted externally; posters are local. */
  src: z.string(),
  poster: z.string().optional(),
  /** Always required — this is the alt text and the caption. */
  caption: z.string(),
});

const exhibits = defineCollection({
  loader: glob({ base: './src/content/exhibits', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),

    /** One sentence. Has to stand alone — it is the museum plaque and the card. */
    hook: z.string(),

    /** Validated against the rooms collection; a typo fails the build. */
    room: reference('rooms'),

    /** Order within the room. */
    order: z.number().default(100),

    /**
     * "front"  — the pamphlet. Curated, ranked, for someone with ninety seconds.
     * "deep"   — the encyclopedia. Everything worth showing, one click away.
     */
    tier: z.enum(['front', 'deep']).default('deep'),

    /** Position on the front page. Only meaningful when tier === "front". */
    frontRank: z.number().optional(),

    project: z.string(),
    year: z.number(),
    tech: z.array(z.string()).default([]),

    media: z.array(mediaItem).default([]),

    /**
     * "own"      — written and understood; explainable line by line.
     * "directed" — architecture and direction mine, implementation AI-generated.
     *
     * The exhibit page renders a disclosure automatically when this is
     * "directed", so the honesty is structural rather than remembered.
     */
    defensibility: z.enum(['own', 'directed']),

    /** Optional pointer back to the private evidence corpus. Never rendered. */
    source: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { rooms, exhibits };
