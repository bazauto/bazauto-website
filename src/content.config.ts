import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Lamp states used on project and decision indicators. */
export const PROJECT_STATUSES = ['active', 'paused', 'planned', 'done'] as const;
export const DECISION_STATUSES = ['accepted', 'proposed', 'superseded'] as const;

const projectRefs = z.array(reference('projects')).default([]);

/** Build log / blog. One file per post: `src/content/log/YYYY-MM-DD-slug.md`. */
const log = defineCollection({
	loader: glob({ base: './src/content/log', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				description: z.string(),
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				projects: projectRefs,
				tags: z.array(z.string()).default([]),
				heroImage: image().optional(),
				heroAlt: z.string().optional(),
				draft: z.boolean().default(false),
			})
			.refine((d) => !d.heroImage || d.heroAlt, {
				message: 'heroAlt is required when heroImage is set',
				path: ['heroAlt'],
			}),
});

/** One page per repo or physical sub-project. */
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		status: z.enum(PROJECT_STATUSES),
		/** Short platform line shown on the project board, e.g. "RP2350 · C++". */
		platform: z.string(),
		repo: z.url().optional(),
		order: z.number().int(),
	}),
});

/** Design decision records: what was chosen, what else was considered, and why. */
const decisions = defineCollection({
	loader: glob({ base: './src/content/decisions', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		date: z.coerce.date(),
		status: z.enum(DECISION_STATUSES),
		projects: projectRefs,
		supersededBy: reference('decisions').optional(),
	}),
});

const faq = defineCollection({
	loader: glob({ base: './src/content/faq', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		question: z.string(),
		order: z.number().int(),
	}),
});

export const collections = { log, projects, decisions, faq };
