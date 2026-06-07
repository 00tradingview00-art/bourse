'use client'

import { useWatchlist } from '@/lib/useWatchlist'

interface Props {
  ticker: string
  size?: 'sm' | 'md'
}

export default function WatchlistButton({ ticker, size = 'md' }: Props) {
  const { isWatched, toggle } = useWatchlist()
  const watched = isWatched(ticker)
  const px = size === 'sm' ? '16px' : '20px'

  return (
    <button
      onClick={() => toggle(ticker)}
      title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
      style={{
        background: watched ? '#fef9c3' : '#fff',
        border: `1px solid ${watched ? '#ca8a04' : 'var(--border)'}`,
        borderRadius: '4px',
        padding: `7px ${px}`,
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        color: watched ? '#92400e' : 'var(--ink-4)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: size === 'sm' ? '13px' : '15px' }}>{watched ? '★' : '☆'}</span>
      {size === 'md' && <span>{watched ? 'Watching' : 'Watch'}</span>}
    </button>
  )
}
