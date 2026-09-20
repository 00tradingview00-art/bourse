import { getFeedItems } from '@/lib/feedItems'
import { SITE_URL } from '@/lib/seo'

export const revalidate = 3600

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const CATEGORY = { brief: 'Daily Brief', flash: 'Flash Intelligence', article: 'Explainer' } as const

export async function GET() {
  const items = await getFeedItems(40)
  const built = items[0] ? new Date(items[0].published).toUTCString() : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Boursee — European Market Intelligence</title>
    <link>${SITE_URL}</link>
    <description>Independent daily research on European equities, indices, bonds and the ECB. General information only, not investment advice.</description>
    <language>en</language>
    <lastBuildDate>${built}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    i => `    <item>
      <title>${esc(i.title)}</title>
      <link>${SITE_URL}${i.path}</link>
      <guid isPermaLink="true">${SITE_URL}${i.path}</guid>
      <pubDate>${new Date(i.published).toUTCString()}</pubDate>
      <category>${CATEGORY[i.type]}</category>
      <description>${esc(i.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
