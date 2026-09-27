import { getCollection, type CollectionEntry } from 'astro:content';

export type Episode = CollectionEntry<'episodes'>;

/** Published episodes, newest first. Drafts are never built. */
export async function getEpisodes(): Promise<Episode[]> {
  const all = await getCollection('episodes', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.number - a.data.number);
}

export const pad = (n: number) => String(n).padStart(2, '0');

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-CA', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const guestLine = (ep: Episode) => `${ep.data.guest.name} · ${ep.data.guest.role}, ${ep.data.guest.company}`;
