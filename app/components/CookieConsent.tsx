'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CONSENT_EVENT, readConsent, writeConsent } from '@/lib/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const button: React.CSSProperties = {
  flex: '1 1 140px',
  padding: '10px 18px',
  fontSize: '13px',
  fontWeight: 600,
  borderRadius: '4px',
  cursor: 'pointer',
}

/** Consent banner for optional analytics cookies. Accept and Decline carry equal weight. */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!GA_ID) return
    const sync = () => setVisible(readConsent() === null)
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', left: '16px', right: '16px', bottom: '16px', zIndex: 1000,
        maxWidth: '760px', margin: '0 auto', padding: '16px 20px',
        background: 'var(--ink)', color: '#fff', borderRadius: '6px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px',
      }}
    >
      <p style={{ flex: '2 1 300px', margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#e5e5e5' }}>
        We would like to use Google Analytics cookies to count visits and see which pages are useful.
        Nothing is set unless you accept.{' '}
        <Link href="/cookies" style={{ color: '#4ade80', textDecoration: 'underline' }}>Cookie policy</Link>
      </p>
      <div style={{ flex: '1 1 300px', display: 'flex', gap: '10px' }}>
        <button type="button" onClick={() => writeConsent('denied')} style={{ ...button, background: 'transparent', color: '#fff', border: '1px solid #777' }}>
          Decline
        </button>
        <button type="button" onClick={() => writeConsent('granted')} style={{ ...button, background: '#4ade80', color: '#0a1f12', border: '1px solid #4ade80' }}>
          Accept
        </button>
      </div>
    </div>
  )
}
