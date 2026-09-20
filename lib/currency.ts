/**
 * Quote currency by exchange. Prices in data/screener.json are in each listing's own
 * quote currency, not euros: LSE shares are quoted in pence (GBp) and Nasdaq
 * Stockholm shares in Swedish krona. Every other tracked venue is EUR.
 */
export type QuoteCurrency = 'EUR' | 'GBp' | 'SEK'

export function quoteCurrency(exchange: string | null | undefined): QuoteCurrency {
  if (exchange === 'FTSE') return 'GBp'
  if (exchange === 'OMX') return 'SEK'
  return 'EUR'
}

function money(value: number, currency: QuoteCurrency): string {
  switch (currency) {
    case 'GBp':
      return `${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}p`
    case 'SEK':
      return `${value.toFixed(2)} SEK`
    default:
      return `€${value.toFixed(2)}`
  }
}

/** Price in the listing's own currency, e.g. "€43.43", "2,499.00p", "197.20 SEK". */
export function formatPrice(value: number, exchange: string | null | undefined): string {
  return money(value, quoteCurrency(exchange))
}

/** Unit suffix for tables that print bare numbers: "" for EUR, "p" for pence, " SEK" for krona. */
export function priceUnit(exchange: string | null | undefined): string {
  const c = quoteCurrency(exchange)
  return c === 'GBp' ? 'p' : c === 'SEK' ? ' SEK' : ''
}
