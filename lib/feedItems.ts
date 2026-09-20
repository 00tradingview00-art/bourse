import { fetchBriefs } from './fetchBriefs'
import { fetchFlash } from './fetchFlash'
import { fetchArticles } from './fetchArticles'

export interface FeedItem {
  type: 'brief' | 'flash' | 'article'
  title: string
  description: string
  path: string
  /** ISO 8601 */
  published: string
}

function iso(value: string | undefined, fallback: string): string {
  const d = new Date(value ?? fallback)
  return Number.isNaN(d.getTime()) ? new Date(fallback).toISOString() : d.toISOString()
}

/** Briefs, flash items and explainer articles merged, newest first. */
export async function getFeedItems(limit = 60): Promise<FeedItem[]> {
  const [briefs, flash, articles] = await Promise.all([fetchBriefs(), Promise.resolve(fetchFlash()), fetchArticles()])

  const items: FeedItem[] = [
    ...briefs
      .filter(b => b.slug)
      .map(b => ({
        type: 'brief' as const,
        title: b.headline,
        description: b.excerpt,
        path: `/briefs/${b.slug}`,
        published: iso(b.generatedAt, b.slug.slice(0, 10)),
      })),
    ...flash
      .filter(f => f.slug)
      .map(f => ({
        type: 'flash' as const,
        title: f.headline,
        description: f.excerpt,
        path: `/flash/${f.slug}`,
        published: iso(f.generatedAt, f.slug.slice(0, 10)),
      })),
    ...articles
      .filter(a => a.slug)
      .map(a => ({
        type: 'article' as const,
        title: a.title,
        description: a.description,
        path: `/articles/${a.slug}`,
        published: iso(a.date, a.slug.slice(0, 10)),
      })),
  ]

  return items.sort((a, b) => b.published.localeCompare(a.published)).slice(0, limit)
}
