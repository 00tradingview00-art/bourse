import screenerData from '@/data/screener.json'

/**
 * Stock, ETF, index and screener pages read data/screener.json, which the screener
 * workflow rewrites once per weekday after the close. This is the honest "as of" date
 * for those prices.
 */
export const SCREENER_AS_OF: string = (() => {
  const iso = (screenerData as { updatedAt?: string }).updatedAt
  if (!iso) return 'the last update'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  })
})()
