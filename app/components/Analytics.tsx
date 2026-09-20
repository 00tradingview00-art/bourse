'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { CONSENT_EVENT, clearGaCookies, readConsent } from '@/lib/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * Loads Google Analytics only after the visitor accepts analytics cookies.
 * Declining or withdrawing consent stops collection and removes the _ga cookies.
 */
export default function Analytics() {
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    if (!GA_ID) return
    const flags = window as unknown as Record<string, boolean>
    const sync = () => {
      const ok = readConsent() === 'granted'
      setGranted(ok)
      flags[`ga-disable-${GA_ID}`] = !ok
      if (!ok) clearGaCookies()
    }
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  if (!GA_ID || !granted) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
        try {
          var h = document.referrer ? new URL(document.referrer).hostname : '';
          if (/(^|\\.)(chatgpt\\.com|chat\\.openai\\.com|perplexity\\.ai|claude\\.ai|gemini\\.google\\.com|copilot\\.microsoft\\.com)$/.test(h)) {
            gtag('event', 'ai_referral', { ai_source: h });
          }
        } catch (e) {}
      `}</Script>
    </>
  )
}
