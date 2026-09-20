import { describe, expect, it } from 'vitest'
import { formatPrice, priceUnit, quoteCurrency } from '../lib/currency'
import { parseEcbCsv, nextEcbDecision, formatBp, formatEcbDate, ECB_DECISION_DAYS } from '../lib/fetchEcbRates'
import { buildStockCopy } from '../lib/stockCopy'
import { clipTitle, safeJsonLd } from '../lib/seo'

describe('currency', () => {
  it('quotes London in pence, Stockholm in SEK, the rest in euros', () => {
    expect(quoteCurrency('FTSE')).toBe('GBp')
    expect(quoteCurrency('OMX')).toBe('SEK')
    for (const ex of ['AEX', 'DAX', 'CAC', 'IBEX', 'FTSE_MIB', 'EURONEXT', 'XETRA']) expect(quoteCurrency(ex)).toBe('EUR')
  })
  it('formats prices in the listing currency', () => {
    expect(formatPrice(43.43, 'AEX')).toBe('€43.43')
    expect(formatPrice(2499, 'FTSE')).toBe('2,499.00p')
    expect(formatPrice(197.2, 'OMX')).toBe('197.20 SEK')
  })
  it('gives unit suffixes for bare-number tables', () => {
    expect(priceUnit('AEX')).toBe('')
    expect(priceUnit('FTSE')).toBe('p')
    expect(priceUnit('OMX')).toBe(' SEK')
  })
})

const CSV = [
  'KEY,FREQ,REF_AREA,CURRENCY,PROVIDER_FM,INSTRUMENT_FM,PROVIDER_FM_ID,DATA_TYPE_FM,TIME_PERIOD,OBS_VALUE',
  'FM.B.U2.EUR.4F.KR.DFR.LEV,B,U2,EUR,4F,KR,DFR,LEV,2025-06-11,2',
  'FM.B.U2.EUR.4F.KR.DFR.LEV,B,U2,EUR,4F,KR,DFR,LEV,2026-06-17,2.25',
  'FM.B.U2.EUR.4F.KR.DFR.LEV,B,U2,EUR,4F,KR,DFR,LEV,2026-09-16,2.5',
].join('\r\n')

describe('parseEcbCsv', () => {
  it('reads the current rate, when it took effect and the changes (CRLF line endings)', () => {
    const r = parseEcbCsv(CSV)!
    expect(r.current).toBe(2.5)
    expect(r.since).toBe('2026-09-16')
    expect(r.changes).toEqual([
      { effective: '2026-06-17', rateAfter: 2.25, changeBp: 25 },
      { effective: '2026-09-16', rateAfter: 2.5, changeBp: 25 },
    ])
  })
  it('returns null for missing columns or no rows', () => {
    expect(parseEcbCsv('a,b\n1,2')).toBeNull()
    expect(parseEcbCsv('TIME_PERIOD,OBS_VALUE')).toBeNull()
    expect(parseEcbCsv('')).toBeNull()
  })
  it('treats a single observation as the current rate with no changes', () => {
    const r = parseEcbCsv('TIME_PERIOD,OBS_VALUE\n2026-09-16,2.5')!
    expect(r.current).toBe(2.5)
    expect(r.changes).toEqual([])
  })
})

describe('ECB dates', () => {
  it('finds the next decision and counts the days', () => {
    expect(nextEcbDecision(new Date('2026-09-20T12:00:00Z'))).toEqual({ date: '2026-10-29', daysAway: 39 })
    expect(nextEcbDecision(new Date('2026-10-29T08:00:00Z'))).toEqual({ date: '2026-10-29', daysAway: 0 })
  })
  it('returns null once the calendar has run out', () => {
    const last = ECB_DECISION_DAYS[ECB_DECISION_DAYS.length - 1]
    expect(nextEcbDecision(new Date(`${last}T00:00:00Z`))).not.toBeNull()
    expect(nextEcbDecision(new Date('2099-01-01T00:00:00Z'))).toBeNull()
  })
  it('formats dates and basis points', () => {
    expect(formatBp(25)).toBe('+25bp')
    expect(formatBp(-25)).toBe('−25bp')
    expect(formatEcbDate('2026-10-29')).toMatch(/29 Oct 2026/)
  })
})

describe('buildStockCopy', () => {
  const stock = { ticker: 'REL.L', name: 'RELX', exchange: 'FTSE', sector: 'Industrials', price: 2499, changePct: -2.76, week52High: 3569, week52Low: 1991, relativeStrength: -1.6, rsi: 39, rsiSignal: 'neutral', dividendYield: 2.76 }
  const peers = [stock, { ...stock, ticker: 'A.L', relativeStrength: 5 }, { ...stock, ticker: 'B.L', relativeStrength: -5 }]
  const copy = buildStockCopy(stock, peers, { exchangeLabel: 'London Stock Exchange', indexName: 'FTSE 100', asOf: '18 Sept 2026' })

  it('writes in pence, with correct articles and ranking', () => {
    const text = copy.paragraphs.join(' ')
    expect(text).toContain('is an Industrials stock listed on the London Stock Exchange')
    expect(text).toContain('2,499.00p')
    expect(text).toContain('ranks 2nd of the 3 Industrials stocks')
    expect(text).toContain('between 1,991.00p and 3,569.00p')
  })
  it('explains the quote currency in the FAQ', () => {
    const answer = copy.faqs.find(f => f.q.includes('currency'))!.a
    expect(answer).toContain('pence sterling')
    expect(answer).toContain('£24.99')
  })
  it('omits sections it has no data for', () => {
    const bare = buildStockCopy({ ...stock, week52High: null, week52Low: null, relativeStrength: null, rsi: null, dividendYield: null }, [stock], { exchangeLabel: 'London Stock Exchange', indexName: 'FTSE 100', asOf: 'x' })
    expect(bare.paragraphs).toHaveLength(1)
    expect(bare.faqs.map(f => f.q).join(' ')).not.toMatch(/52-week|performed/)
  })
})

describe('seo helpers', () => {
  it('clips titles at a word boundary and leaves short ones alone', () => {
    expect(clipTitle('Short title')).toBe('Short title')
    const clipped = clipTitle('ECB Holds at 2.25% — Banks Steady, REITs Await Next Cut in Long Headline', 50)
    expect(clipped.length).toBeLessThanOrEqual(50)
    expect(clipped.endsWith('…')).toBe(true)
  })
  it('escapes < in JSON-LD so generated text cannot close the script tag', () => {
    expect(safeJsonLd({ a: '</script><b>' })).not.toContain('</script>')
  })
})
