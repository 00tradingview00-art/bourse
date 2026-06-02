import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email || !EMAIL_REGEX.test(email)) {
    redirect('/unsubscribed')
  }

  const apiKey = process.env.BREVO_API_KEY
  const listId = process.env.BREVO_LIST_ID

  if (apiKey && listId) {
    try {
      // Remove contact from the mailing list (GDPR: stops emails, preserves data)
      await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}/lists/remove`, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listIds: [parseInt(listId, 10)] }),
      })
    } catch {
      // Best-effort — redirect to confirmation regardless
    }
  }

  redirect('/unsubscribed')
}
