/**
 * send-newsletter.mjs
 * Creates a Brevo email campaign from the latest brief and sends it immediately.
 *
 * Usage: node scripts/send-newsletter.mjs
 * Requires: BREVO_API_KEY, BREVO_LIST_ID in environment
 */

import { readdir, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BRIEFS_DIR = join(__dirname, '..', 'content', 'briefs')

async function getLatestBriefMetadata() {
  const files = await readdir(BRIEFS_DIR)
  const mdxFiles = files.filter(f => f.endsWith('.mdx')).sort().reverse()
  if (!mdxFiles.length) throw new Error('No brief files found')
  const latest = mdxFiles[0]
  const source = await readFile(join(BRIEFS_DIR, latest), 'utf8')
  // Extract metadata object via regex (JS object literal after "export const metadata = ")
  const match = source.match(/export const metadata = ({[\s\S]+?})\s*\nexport|export const metadata = ({[\s\S]+?})\s*\n\n/)
  if (!match) throw new Error(`Could not parse metadata from ${latest}`)
  // Safe eval of the object literal (CI environment, trusted content)
  const meta = Function(`"use strict"; return (${(match[1] || match[2])})`)()
  return meta
}

function buildEmailHtml(meta, siteUrl) {
  const briefUrl = `${siteUrl}/briefs/${meta.slug}`
  const unsubscribeUrl = `${siteUrl}/unsubscribed`
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.headline}</title>
</head>
<body style="margin:0;padding:0;background:#fafaf7;font-family:'Georgia',serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e0e0d8;">
  <!-- Header -->
  <div style="background:#0f0f0f;padding:24px 32px;display:flex;justify-content:space-between;align-items:center;">
    <div style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.02em;">
      Bourse<span style="color:#4ade80;">.</span>
    </div>
    <div style="color:#666;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">
      Edition #${String(meta.edition).padStart(3, '0')} · ${meta.dateShort}
    </div>
  </div>
  <!-- Tags -->
  <div style="padding:16px 32px 0;display:flex;gap:8px;flex-wrap:wrap;">
    ${meta.tags.map(t => `<span style="font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:3px 10px;border-radius:2px;background:#e8f0eb;color:#1a4a2e;">${t.label}</span>`).join('')}
  </div>
  <!-- Headline -->
  <div style="padding:24px 32px 16px;">
    <h1 style="font-size:24px;font-weight:700;color:#0f0f0f;line-height:1.25;letter-spacing:-0.02em;margin:0 0 12px;">
      ${meta.headline}
    </h1>
    <p style="font-size:15px;color:#3a3a3a;line-height:1.75;margin:0 0 24px;">
      ${meta.excerpt}
    </p>
    <a href="${briefUrl}" style="display:inline-block;background:#1a4a2e;color:#fff;padding:12px 28px;border-radius:3px;font-size:13px;font-weight:500;letter-spacing:0.04em;text-decoration:none;">
      Read full brief →
    </a>
  </div>
  <!-- Divider -->
  <div style="height:1px;background:#e0e0d8;margin:0 32px;"></div>
  <!-- Footer -->
  <div style="padding:20px 32px;background:#fafaf7;">
    <p style="font-size:11px;color:#9a9a9a;line-height:1.6;margin:0 0 8px;">
      Content is for informational purposes only and does not constitute investment advice.
      Not regulated by the AFM. Past performance is not indicative of future results.
    </p>
    <p style="font-size:11px;color:#9a9a9a;margin:0;">
      <a href="${unsubscribeUrl}" style="color:#9a9a9a;">Unsubscribe</a> ·
      <a href="${siteUrl}/privacy" style="color:#9a9a9a;">Privacy</a> ·
      © 2026 Bourse
    </p>
  </div>
</div>
</body>
</html>`
}

async function main() {
  const apiKey = process.env.BREVO_API_KEY
  const listId = process.env.BREVO_LIST_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bourse.io'

  if (!apiKey || !listId) throw new Error('BREVO_API_KEY and BREVO_LIST_ID are required')

  console.log('→ Reading latest brief metadata...')
  const meta = await getLatestBriefMetadata()
  console.log(`  Brief: Edition #${meta.edition} — ${meta.headline.slice(0, 60)}...`)

  const html = buildEmailHtml(meta, siteUrl)
  const subject = `Bourse Brief #${meta.edition} · ${meta.dateShort} — ${meta.headline.slice(0, 60)}`

  console.log('→ Creating Brevo campaign...')
  const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: `Bourse Brief #${meta.edition} - ${meta.dateShort}`,
      subject,
      sender: { name: 'Bourse', email: 'brief@bourse.io' },
      type: 'classic',
      htmlContent: html,
      recipients: { listIds: [parseInt(listId, 10)] },
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Campaign creation failed (${createRes.status}): ${err}`)
  }

  const { id: campaignId } = await createRes.json()
  console.log(`  Campaign created: ID ${campaignId}`)

  console.log('→ Sending campaign now...')
  const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Accept': 'application/json' },
  })

  if (!sendRes.ok) {
    const err = await sendRes.text()
    throw new Error(`Campaign send failed (${sendRes.status}): ${err}`)
  }

  console.log(`✓ Campaign #${campaignId} sent to list ${listId}`)
}

main().catch(err => {
  console.error('✗ Newsletter send failed:', err.message)
  process.exit(1)
})
