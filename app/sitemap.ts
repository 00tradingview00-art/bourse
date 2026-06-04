import type { MetadataRoute } from 'next'
import { getBriefSlugs } from '@/lib/fetchBriefs'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://boursee.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getBriefSlugs()

  const briefUrls: MetadataRoute.Sitemap = slugs.map(slug => {
    // Slugs start with YYYY-MM-DD — extract for lastModified
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/)
    const lastModified = dateMatch ? new Date(dateMatch[1]) : new Date()
    return {
      url: `${BASE}/briefs/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  })

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE}/briefs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...briefUrls,
    {
      url: `${BASE}/disclaimer`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
