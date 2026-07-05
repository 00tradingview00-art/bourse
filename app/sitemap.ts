import type { MetadataRoute } from 'next'
import { getBriefSlugs } from '@/lib/fetchBriefs'
import { getFlashSlugs } from '@/lib/fetchFlash'
import screenerData from '@/data/screener.json'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://boursee.com'

const STATIC_SECTIONS = [
  { path: '/screener',    priority: 0.9, freq: 'daily'   },
  { path: '/sectors',     priority: 0.8, freq: 'daily'   },
  { path: '/bonds',       priority: 0.8, freq: 'daily'   },
  { path: '/ecb-watch',   priority: 0.8, freq: 'weekly'  },
  { path: '/macro-bridge',priority: 0.8, freq: 'daily'   },
  { path: '/search',      priority: 0.7, freq: 'weekly'  },
  { path: '/watchlist',   priority: 0.5, freq: 'weekly'  },
  { path: '/guides',      priority: 0.8, freq: 'monthly' },
  { path: '/calculators', priority: 0.7, freq: 'monthly' },
  { path: '/brokers',     priority: 0.6, freq: 'monthly' },
  { path: '/about',       priority: 0.7, freq: 'monthly' },
  { path: '/flash',       priority: 0.9, freq: 'hourly'  },
] as const

const GUIDE_SLUGS = [
  'dutch-box-3',
  'german-vorabpauschale',
  'french-pea',
  'dividend-withholding-tax',
  'broker-comparison',
  'what-is-ucits',
  'etf-accumulating-vs-distributing',
  'ecb-interest-rates-explained',
  'european-indices-explained',
  'bond-yields-and-stocks',
]

const INDEX_SLUGS = ['aex', 'dax', 'cac-40', 'ftse-100', 'ibex-35', 'ftse-mib', 'omx']

const CALCULATOR_SLUGS = ['dutch-box-3', 'german-vorabpauschale']

const LEGAL_PATHS = ['/disclaimer', '/privacy', '/terms', '/cookies']

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getBriefSlugs()
  const d = screenerData as Record<string, unknown>
  const stocks = (d.stocks ?? d.instruments ?? []) as Array<{ ticker: string; type?: string }>

  const briefUrls: MetadataRoute.Sitemap = slugs.map(slug => {
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/)
    const lastModified = dateMatch ? new Date(dateMatch[1]) : new Date()
    return {
      url: `${BASE}/briefs/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  })

  const stockUrls: MetadataRoute.Sitemap = stocks
    .filter(s => s.type === 'stock' || !s.type)
    .map(s => ({
      url: `${BASE}/stocks/${s.ticker}`,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }))

  const indexUrls: MetadataRoute.Sitemap = INDEX_SLUGS.map(slug => ({
    url: `${BASE}/indices/${slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const guideUrls: MetadataRoute.Sitemap = GUIDE_SLUGS.map(slug => ({
    url: `${BASE}/guides/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const sectionUrls: MetadataRoute.Sitemap = STATIC_SECTIONS.map(s => ({
    url: `${BASE}${s.path}`,
    changeFrequency: s.freq as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: s.priority,
  }))

  const calculatorUrls: MetadataRoute.Sitemap = CALCULATOR_SLUGS.map(slug => ({
    url: `${BASE}/calculators/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const legalUrls: MetadataRoute.Sitemap = LEGAL_PATHS.map(p => ({
    url: `${BASE}${p}`,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }))

  const flashUrls: MetadataRoute.Sitemap = getFlashSlugs().map(slug => ({
    url: `${BASE}/flash/${slug}`,
    changeFrequency: 'never' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/briefs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...sectionUrls,
    ...indexUrls,
    ...briefUrls,
    ...guideUrls,
    ...calculatorUrls,
    ...flashUrls,
    ...stockUrls,
    ...legalUrls,
  ]
}
