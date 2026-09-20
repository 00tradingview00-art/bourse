import { getFeedItems } from '@/lib/feedItems'
import { SITE_URL } from '@/lib/seo'
import screenerData from '@/data/screener.json'

export const revalidate = 3600

const GUIDES: Array<[string, string]> = [
  ['what-is-ucits', 'What is UCITS?'],
  ['dutch-box-3', 'Dutch Box 3 wealth tax explained'],
  ['german-vorabpauschale', 'German Vorabpauschale on accumulating ETFs'],
  ['french-pea', 'French PEA account'],
  ['dividend-withholding-tax', 'Dividend withholding tax across Europe'],
  ['etf-accumulating-vs-distributing', 'Accumulating vs distributing ETFs'],
  ['ecb-interest-rates-explained', 'ECB interest rates explained'],
  ['european-indices-explained', 'European stock indices explained'],
  ['bond-yields-and-stocks', 'Bond yields and stocks'],
  ['broker-comparison', 'European broker comparison'],
]

export async function GET() {
  const items = await getFeedItems(200)
  const latest = (type: 'brief' | 'flash' | 'article', n: number) =>
    items
      .filter(i => i.type === type)
      .slice(0, n)
      .map(i => `- [${i.title}](${SITE_URL}${i.path}): ${i.description.replace(/\s+/g, ' ').trim()}`)
      .join('\n')

  const d = screenerData as { stockCount?: number; etfCount?: number }

  const body = `# Boursee

> Independent, English-language research on European equities, indices, government bonds and the ECB, for retail investors. General information only under Article 24 MiFID II; not investment advice and not regulated by the AFM or FCA.

## How to read this site
- Stock, ETF, index and screener pages show end-of-day closing prices, refreshed each weekday evening. Homepage market data comes from a feed that can lag the exchange by up to 15 minutes.
- Prices are in each listing's own currency: euros for most, pence (GBp) for London, Swedish krona (SEK) for Stockholm.
- The Daily Brief, Flash Intelligence items and weekly explainer articles are written by an AI language model and published without human review. Stock, ETF, ECB and bond figures come straight from the listed data sources, not from a model.
- Sources, refresh times and indicator definitions: ${SITE_URL}/methodology

## Coverage
- ${d.stockCount ?? ''} stocks and ${d.etfCount ?? ''} UCITS ETFs across AEX, DAX, CAC 40, FTSE 100, IBEX 35, FTSE MIB and OMX 30
- Deposit rate, rate history and next decision date for the ECB

## Key pages
- [Daily Brief archive](${SITE_URL}/briefs): one macro-to-equity brief per weekday morning
- [Flash Intelligence](${SITE_URL}/flash): short items on European market-moving events
- [Stock and ETF screener](${SITE_URL}/screener): filter by exchange, sector and momentum
- [ECB Rate Watch](${SITE_URL}/ecb-watch): deposit rate, rate changes and upcoming decisions, from ECB data
- [Macro–Equity Bridge](${SITE_URL}/macro-bridge): how oil, FX and the ECB rate map to European stocks
- [Bond yields](${SITE_URL}/bonds): European government bond yields
- [Sectors](${SITE_URL}/sectors): sector heatmap
- [Methodology](${SITE_URL}/methodology): data sources, freshness and definitions
- [About](${SITE_URL}/about)
- [Disclaimer](${SITE_URL}/disclaimer)

## Investor guides
${GUIDES.map(([slug, title]) => `- [${title}](${SITE_URL}/guides/${slug})`).join('\n')}

## Latest daily briefs
${latest('brief', 10)}

## Latest flash items
${latest('flash', 10)}

## Explainer articles
${latest('article', 12)}

## Optional
- [Sitemap](${SITE_URL}/sitemap.xml)
- [RSS feed](${SITE_URL}/feed.xml)
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
