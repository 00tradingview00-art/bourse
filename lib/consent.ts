/** Cookie-consent state for optional analytics (Google Analytics). Client-side only. */
export const CONSENT_KEY = 'boursee_consent'
export const CONSENT_EVENT = 'boursee-consent-change'
export type Consent = 'granted' | 'denied'

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/** Save the visitor's choice (or clear it with null) and tell listeners. */
export function writeConsent(value: Consent | null): void {
  try {
    if (value) window.localStorage.setItem(CONSENT_KEY, value)
    else window.localStorage.removeItem(CONSENT_KEY)
  } catch {
    /* storage blocked: the choice simply will not persist */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

/** Remove Google Analytics cookies (_ga, _ga_<id>) set on this site or its parent domain. */
export function clearGaCookies(): void {
  const host = window.location.hostname
  const parts = host.split('.')
  const domains = new Set<string | undefined>([undefined, host, `.${host}`])
  if (parts.length >= 2) domains.add(`.${parts.slice(-2).join('.')}`)
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0]?.trim()
    if (!name || !name.startsWith('_ga')) continue
    for (const d of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`
    }
  }
}
