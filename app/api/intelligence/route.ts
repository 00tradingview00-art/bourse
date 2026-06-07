import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { readFile } from 'fs/promises'
import { join } from 'path'

interface Instrument {
  type?: string
  ticker: string
  name: string
  exchange?: string
  sector?: string
  category?: string
  domicile?: string
  indexTracked?: string
  price?: number
  changePct?: number
  dividendYield?: number | null
  peRatio?: number | null
}

interface ScreenerData {
  stocks?: Instrument[]
  etfs?: Instrument[]
  instruments?: Instrument[]
}

// Build instrument context at request time (small file, fast)
async function buildInstrumentContext(): Promise<{ stockIndex: string; etfIndex: string; allTickers: string[] }> {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    const d: ScreenerData = JSON.parse(raw)
    const stocks = d.stocks ?? (d.instruments ?? []).filter((i: Instrument) => i.type !== 'etf') as Instrument[]
    const etfs = d.etfs ?? []

    const stockIndex = stocks.map((s: Instrument) =>
      `${s.ticker}: ${s.name} | ${s.sector ?? ''} | ${s.exchange ?? ''} | P/E ${s.peRatio?.toFixed(1) ?? '—'} | Div ${s.dividendYield?.toFixed(2) ?? '—'}%`
    ).join('\n')

    const etfIndex = etfs.map((e: Instrument) =>
      `${e.ticker}: ${e.name} | ${e.category ?? ''} | ${e.indexTracked ?? ''} | ${e.domicile ?? ''}`
    ).join('\n')

    const allTickers = [...stocks.map((s: Instrument) => s.ticker), ...etfs.map((e: Instrument) => e.ticker)]

    return { stockIndex, etfIndex, allTickers }
  } catch {
    return { stockIndex: '', etfIndex: '', allTickers: [] }
  }
}

const SYSTEM_PROMPT = (stockIndex: string, etfIndex: string) => `You are the intelligence engine for Boursee, a European market research platform for retail investors. You provide clear, honest, and useful answers about European equities, UCITS ETFs, tax rules, and market concepts.

AVAILABLE STOCKS (178 total — AEX · DAX · CAC 40 · FTSE 100 · IBEX 35 · FTSE MIB · OMX):
${stockIndex}

AVAILABLE ETFs (15 UCITS ETFs):
${etfIndex}

GUIDES AVAILABLE:
- /guides/dutch-box-3 — Dutch Box 3 wealth tax on investments
- /guides/german-vorabpauschale — German annual pre-tax on accumulating ETFs
- /guides/french-pea — French PEA eligible ETFs
- /guides/dividend-withholding-tax — Dividend WHT rates across Europe
- /guides/broker-comparison — DEGIRO vs Trade Republic vs Scalable Capital

RULES:
1. Answer in plain English. Be specific and genuinely useful — not generic.
2. Maximum 3 paragraphs. Short paragraphs preferred.
3. Do NOT mention any data providers or data sources.
4. If discussing ETFs, mention domicile (Ireland = 15% US dividend WHT, Luxembourg = 30%) where relevant.
5. If discussing tax, be clear that rules vary by residency and you're not giving personalised tax advice.
6. At the very end of your answer, on its own line, output ONLY this JSON and nothing else after it:
{"tickers":["TICKER1","TICKER2"],"guides":["/guides/slug"]}
7. tickers: up to 5 most relevant tickers from the AVAILABLE universe above (use exact ticker strings — must match).
8. guides: up to 3 relevant guide slugs from the GUIDES AVAILABLE list.
9. If nothing is directly relevant, use empty arrays [].
10. Final line before JSON: "Prices may be delayed up to 15 minutes. Not investment advice."`

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json() as { query?: string }

    if (!query || query.trim().length < 5) {
      return Response.json({ error: 'Query too short' }, { status: 400 })
    }

    const key = process.env.ANTHROPIC_API_KEY
    if (!key) {
      return Response.json({ error: 'Intelligence engine not configured' }, { status: 503 })
    }

    const { stockIndex, etfIndex } = await buildInstrumentContext()

    const client = new Anthropic({ apiKey: key })

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 900,
      system: SYSTEM_PROMPT(stockIndex, etfIndex),
      messages: [{ role: 'user', content: query.trim() }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract trailing JSON block
    const jsonMatch = raw.match(/(\{"tickers":\[.*?\],"guides":\[.*?\]\})\s*$/)
    let tickers: string[] = []
    let guides: string[] = []
    let answer = raw

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]) as { tickers?: string[]; guides?: string[] }
        tickers = parsed.tickers ?? []
        guides = parsed.guides ?? []
        answer = raw.slice(0, jsonMatch.index).trim()
      } catch {
        // leave as-is
      }
    }

    return Response.json({ answer, tickers, guides })
  } catch (err) {
    console.error('Intelligence route error:', err)
    return Response.json({ error: 'Intelligence engine temporarily unavailable' }, { status: 500 })
  }
}
