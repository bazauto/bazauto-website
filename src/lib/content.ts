import { type CollectionEntry, getCollection } from 'astro:content';

/** Log posts, newest first. Drafts appear in `astro dev` but never in a build. */
export async function getPosts(): Promise<CollectionEntry<'log'>[]> {
	const posts = await getCollection('log', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
	const projects = await getCollection('projects');
	return projects.sort((a, b) => a.data.order - b.data.order);
}

/** Decisions, newest first. */
export async function getDecisions(): Promise<CollectionEntry<'decisions'>[]> {
	const decisions = await getCollection('decisions');
	return decisions.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function mentionsProject(
	entry: { data: { projects: { id: string }[] } },
	projectId: string,
): boolean {
	return entry.data.projects.some((p) => p.id === projectId);
}
