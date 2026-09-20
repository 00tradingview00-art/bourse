import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Search and AI crawlers are welcome on public content so Boursee can be found and cited.
// /api/ stays closed to everyone.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'meta-externalagent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: '/api/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
