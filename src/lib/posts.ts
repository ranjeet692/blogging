import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;

/** Published posts, newest first. Drafts show up only in `npm run dev`. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postUrl(post: Post): string {
  return `/writing/${post.id}/`;
}

export function readingMinutes(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function allTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, { tag: string; slug: string; count: number }>();
  for (const p of posts)
    for (const tag of p.data.tags) {
      const slug = tagSlug(tag);
      const e = map.get(slug) ?? { tag, slug, count: 0 };
      e.count++;
      map.set(slug, e);
    }
  return [...map.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Group posts by year, newest year first. */
export function byYear(posts: Post[]): [number, Post[]][] {
  const groups = new Map<number, Post[]>();
  for (const p of posts) {
    const y = p.data.date.getUTCFullYear();
    groups.set(y, [...(groups.get(y) ?? []), p]);
  }
  return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const full = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const fmtDayMonth = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
export const fmtFull = (d: Date) => full.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
