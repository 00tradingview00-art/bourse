import { describe, expect, it } from 'vitest'
import {
  checkBrief,
  checkFlash,
  extractFigures,
  findBannedPhrases,
  unsupportedFigures,
  weekdayMatches,
} from '../scripts/lib/contentChecks.mjs'

describe('weekdayMatches', () => {
  it('accepts a correct weekday', () => {
    expect(weekdayMatches('Friday, 18 September 2026', '2026-09-18')).toBe(true)
    expect(weekdayMatches('Fri 18 Sep', '2026-09-18')).toBe(true)
  })
  it('rejects a wrong weekday (21 Jun 2026 is a Sunday)', () => {
    expect(weekdayMatches('Saturday, 21 June 2026', '2026-06-21')).toBe(false)
  })
  it('has nothing to contradict when no weekday is named', () => {
    expect(weekdayMatches('18 September 2026', '2026-09-18')).toBe(true)
  })
})

describe('extractFigures', () => {
  it('reads percentages, basis points and money, ignoring signs and separators', () => {
    const f = extractFigures('Crude −1.2%, EUR/USD +0.3%, a 25bp move, ASML €1,446.00 and Brent $99.29')
    expect(f.percents).toEqual([1.2, 0.3])
    expect(f.bps).toEqual([25])
    expect(f.money).toEqual([{ symbol: '€', value: 1446 }, { symbol: '$', value: 99.29 }])
  })
})

describe('unsupportedFigures', () => {
  const source = 'AEX: 1095.1 (-0.10%), DAX: 25304.1 (-0.92%), Brent: $99.29 (-0.64%)'
  it('accepts figures that match the data, allowing rounding', () => {
    expect(unsupportedFigures('The DAX lost 0.9% and Brent fell 0.64% to $99.29.', source)).toEqual([])
  })
  it('flags a percentage that is not in the data', () => {
    expect(unsupportedFigures('The DAX fell 3.5%.', source)).toEqual(['3.5%'])
  })
  it('flags a price that is not in the data', () => {
    expect(unsupportedFigures('Brent hit $120.', source)).toEqual(['$120'])
  })
})

describe('findBannedPhrases', () => {
  it('catches advisory wording', () => {
    expect(findBannedPhrases('You should buy ASML now')).not.toHaveLength(0)
    expect(findBannedPhrases('A guaranteed return')).not.toHaveLength(0)
  })
  it('leaves neutral wording alone', () => {
    expect(findBannedPhrases('The AEX fell 0.1% as banks slipped.')).toEqual([])
  })
})

const goodBrief = {
  headline: 'European Stocks Slide as Brent Falls Below $100',
  excerpt: 'European equities fell broadly on Friday.',
  dateLabel: 'Friday, 18 September 2026',
  isoDate: '2026-09-18',
  sections: {
    opening: 'European equities fell broadly on Friday, with the DAX down 0.92% and the AEX 0.10% lower.',
    commodities: 'Brent crude eased 0.64% to $99.29, cutting energy costs for European industry and airlines.',
  },
  inputText: 'AEX: 1095.1 (-0.10%), DAX: 25304.1 (-0.92%), Brent: $99.29 (-0.64%)',
}

describe('checkBrief', () => {
  it('passes a clean brief', () => {
    expect(checkBrief(goodBrief)).toEqual({ errors: [], warnings: [] })
  })
  it('blocks advisory wording', () => {
    const r = checkBrief({ ...goodBrief, sections: { ...goodBrief.sections, opening: 'You should buy the DAX after Friday’s fall of 0.92% today.' } })
    expect(r.errors.join(' ')).toMatch(/advisory/)
  })
  it('blocks broken output', () => {
    const r = checkBrief({ ...goodBrief, sections: { ...goodBrief.sections, commodities: 'Brent traded at $undefined after a 0.64% fall on the day.' } })
    expect(r.errors.join(' ')).toMatch(/broken text/)
  })
  it('blocks a wrong weekday label', () => {
    expect(checkBrief({ ...goodBrief, dateLabel: 'Saturday, 18 September 2026' }).errors.join(' ')).toMatch(/does not match/)
  })
  it('blocks empty sections', () => {
    expect(checkBrief({ ...goodBrief, sections: { opening: '' } }).errors.join(' ')).toMatch(/empty or too short/)
  })
  it('only warns about figures missing from the data', () => {
    const r = checkBrief({ ...goodBrief, sections: { ...goodBrief.sections, opening: 'European equities fell broadly on Friday, with the DAX down 4.2% and the AEX lower.' } })
    expect(r.errors).toEqual([])
    expect(r.warnings.join(' ')).toMatch(/4.2%/)
  })
})

const body = '## What Happened\n\nThe ECB left its deposit rate unchanged at the meeting.\n\n## What It Means\n\nBanks keep their current net interest margins for now.'

describe('checkFlash', () => {
  const base = { headline: 'ECB holds rates as banks steady', excerpt: 'Rates unchanged.', body, sourceText: 'ECB holds rates at 2.25% amid inflation worries' }
  const now = new Date('2026-09-20T10:00:00Z')

  it('passes a flash with no invented figures', () => {
    expect(checkFlash({ ...base, now }).errors).toEqual([])
  })
  it('accepts a figure that is in the source headline', () => {
    expect(checkFlash({ ...base, body: body + ' The rate stays at 2.25%.', now }).errors).toEqual([])
  })
  it('blocks a figure the source headline does not contain', () => {
    const r = checkFlash({ ...base, body: body + ' Risk-free rates above 4% remain attractive.', now })
    expect(r.errors.join(' ')).toMatch(/4%/)
  })
  it('warns about years that are too old', () => {
    expect(checkFlash({ ...base, body: body + ' Similar to Q4 2024.', now }).warnings.join(' ')).toMatch(/2024/)
  })
})
