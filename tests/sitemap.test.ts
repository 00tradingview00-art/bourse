import { describe, expect, it } from 'vitest'
import sitemap from '../app/sitemap'
import screener from '../data/screener.json'

describe('sitemap', () => {
  const urls = sitemap().map(e => e.url)
  const paths = urls.map(u => new URL(u).pathname)

  it('has no duplicate URLs and stays on the canonical host', () => {
    expect(new Set(urls).size).toBe(urls.length)
    for (const u of urls) expect(u.startsWith('https://boursee.com')).toBe(true)
  })
  it('leaves out utility pages that are noindex', () => {
    expect(paths).not.toContain('/watchlist')
    expect(paths).not.toContain('/search')
  })
  it('includes the hubs that were once missing', () => {
    for (const p of ['/articles', '/flash', '/methodology', '/about', '/ecb-watch']) expect(paths).toContain(p)
  })
  it('lists every tracked stock and ETF exactly once', () => {
    expect(paths.filter(p => p.startsWith('/stocks/'))).toHaveLength(screener.stockCount)
    expect(paths.filter(p => p.startsWith('/etfs/'))).toHaveLength(screener.etfCount)
  })
  it('lists briefs and flash items', () => {
    expect(paths.filter(p => p.startsWith('/briefs/')).length).toBeGreaterThan(50)
    expect(paths.filter(p => p.startsWith('/flash/')).length).toBeGreaterThan(10)
  })
})
