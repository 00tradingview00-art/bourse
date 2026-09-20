import { formatPrice, quoteCurrency } from './currency'

export interface StockCopyInput {
  ticker: string
  name: string
  exchange: string
  sector: string
  price: number
  changePct: number | null
  week52High?: number | null
  week52Low?: number | null
  relativeStrength?: number | null
  rsi?: number | null
  rsiSignal?: string
  dividendYield?: number | null
}

export interface StockCopy {
  paragraphs: string[]
  faqs: Array<{ q: string; a: string }>
}

function pct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

function article(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a'
}

/** "London Stock Exchange" takes "the"; the other venue names do not. */
function onExchange(label: string): string {
  return /^London Stock Exchange/.test(label) ? `the ${label}` : label
}

function ordinal(n: number): string {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}

/**
 * Plain-language description of one stock, written only from the data on the page.
 * States what the data shows; makes no forecast and gives no advice.
 */
export function buildStockCopy(
  s: StockCopyInput,
  sectorStocks: StockCopyInput[],
  ctx: { exchangeLabel: string; indexName: string; asOf: string },
): StockCopy {
  const price = formatPrice(s.price, s.exchange)
  const day = s.changePct != null ? `${pct(s.changePct)} on the day` : 'unchanged on the day'
  const paragraphs: string[] = []

  paragraphs.push(
    `${s.name} (${s.ticker}) is ${article(s.sector)} ${s.sector} stock listed on ${onExchange(ctx.exchangeLabel)} and covered in Boursee's ${ctx.indexName} group. It closed at ${price} on ${ctx.asOf}, ${day}.`,
  )

  let rangeText: string | null = null
  if (s.week52High != null && s.week52Low != null && s.week52High > s.week52Low) {
    const pos = Math.round(Math.min(100, Math.max(0, ((s.price - s.week52Low) / (s.week52High - s.week52Low)) * 100)))
    rangeText = `${formatPrice(s.week52Low, s.exchange)} and ${formatPrice(s.week52High, s.exchange)}, and the latest close sits ${pos}% of the way from the low to the high`
    paragraphs.push(`Over the past 52 weeks the shares have traded between ${rangeText}.`)
  }

  let perfText: string | null = null
  if (s.relativeStrength != null) {
    const ranked = sectorStocks
      .filter(x => x.relativeStrength != null)
      .sort((a, b) => (b.relativeStrength as number) - (a.relativeStrength as number))
    const rank = ranked.findIndex(x => x.ticker === s.ticker) + 1
    perfText = `Against the ${ctx.indexName} over the last 30 days it is ${pct(s.relativeStrength)}`
    if (rank > 0 && ranked.length > 1) {
      perfText += `. Measured against each stock's own index, that ranks ${ordinal(rank)} of the ${ranked.length} ${s.sector} stocks Boursee tracks across all covered markets`
    }
    paragraphs.push(`${perfText}.`)
  }

  const extras: string[] = []
  if (s.rsi != null && s.rsiSignal) extras.push(`its RSI reads ${s.rsi.toFixed(0)} (classed as ${s.rsiSignal})`)
  if (s.dividendYield != null) extras.push(`its dividend yield is ${s.dividendYield.toFixed(2)}%`)
  if (extras.length) paragraphs.push(`On the other indicators, ${extras.join(' and ')}.`)

  const currency = quoteCurrency(s.exchange)
  const currencyAnswer =
    currency === 'GBp'
      ? `Shares listed on the London Stock Exchange are quoted in pence sterling (GBp), where 100p equals £1. The latest close of ${price} is £${(s.price / 100).toFixed(2)}.`
      : currency === 'SEK'
        ? `Shares listed on Nasdaq Stockholm are quoted in Swedish krona (SEK). Boursee shows the price in SEK without converting it.`
        : `This listing is quoted in euros (€). Boursee shows the price as quoted, without conversion.`

  const faqs: StockCopy['faqs'] = [
    {
      q: `What is the ${s.name} share price?`,
      a: `${s.name} (${s.ticker}) closed at ${price} on ${ctx.asOf}, ${day}. Prices on Boursee stock pages are end-of-day closing prices, refreshed each weekday evening.`,
    },
  ]
  if (rangeText) {
    faqs.push({ q: `What is ${s.name}'s 52-week range?`, a: `Over the past 52 weeks ${s.name} has traded between ${rangeText}.` })
  }
  if (perfText) {
    faqs.push({ q: `How has ${s.name} performed against the ${ctx.indexName}?`, a: `${perfText}.` })
  }
  faqs.push({
    q: `Where does ${s.name} trade, and in which currency?`,
    a: `${s.name} trades on ${onExchange(ctx.exchangeLabel)} under the ticker ${s.ticker}. ${currencyAnswer}`,
  })

  return { paragraphs, faqs }
}
