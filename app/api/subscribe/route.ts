import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}))

  const noStore = { headers: { 'Cache-Control': 'no-store' } }

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Valid email address required.' }, { status: 400, ...noStore })
  }

  const apiKey = process.env.BREVO_API_KEY
  const listId = process.env.BREVO_LIST_ID
  const templateId = process.env.BREVO_DOI_TEMPLATE_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bourse.io'

  if (!apiKey || !listId || !templateId) {
    return NextResponse.json({ success: true }, noStore)
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        includeListIds: [parseInt(listId, 10)],
        templateId: parseInt(templateId, 10),
        redirectionUrl: `${siteUrl}/confirmed`,
      }),
    })

    // 201 = DOI email sent, 204 = already subscribed/pending
    if (res.status === 201 || res.status === 204) {
      return NextResponse.json({ success: true }, noStore)
    }

    if (res.status === 400) {
      const body = await res.json().catch(() => ({}))
      if (body?.code === 'duplicate_parameter') {
        return NextResponse.json({ success: true, alreadySubscribed: true }, noStore)
      }
    }

    return NextResponse.json({ error: 'Service unavailable. Please try again.' }, { status: 502, ...noStore })
  } catch {
    return NextResponse.json({ error: 'Service unavailable. Please try again.' }, { status: 502, ...noStore })
  }
}
