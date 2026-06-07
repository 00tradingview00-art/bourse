'use client'

import { useState, useEffect, useCallback } from 'react'

const KEY = 'boursee_watchlist'

export function useWatchlist() {
  const [tickers, setTickers] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored) setTickers(new Set(JSON.parse(stored)))
    } catch { /* ignore */ }
  }, [])

  const toggle = useCallback((ticker: string) => {
    setTickers(prev => {
      const next = new Set(prev)
      if (next.has(ticker)) { next.delete(ticker) } else { next.add(ticker) }
      try { localStorage.setItem(KEY, JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }, [])

  const isWatched = useCallback((ticker: string) => tickers.has(ticker), [tickers])

  return { tickers, toggle, isWatched }
}
