/**
 * generate-keyword-article.mjs
 * Picks the top uncovered keyword from data/keyword-universe.json,
 * generates an evergreen explainer article via Claude, and writes it
 * to content/articles/.
 *
 * Usage: node scripts/generate-keyword-article.mjs
 * Requires: ANTHROPIC_API_KEY in environment
 */

import { readdir, writeFile, readFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(ROOT, 'content', 'articles')
const KEYWORD_UNIVERSE = join(ROOT, 'data', 'keyword-universe.json')
const KEYWORD_COVERAGE = join(ROOT, 'data', 'keyword-coverage.json')

const COOLDOWN_DAYS = 90

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function loadJsonAsync(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function stripCodeFences(text) {
  return text.replace(/^```[a-z]*\r?\n?/gm, '').replace(/^```\s*$/gm, '').trim()
}

function validateOutput(text, label) {
  const cleaned = stripCodeFences(text)
  if (cleaned.length < 50) throw new Error(`Output too short for "${label}"`)
  if (/^skip\b/i.test(cleaned) || /i cannot/i.test(cleaned)) {
    throw new Error(`Claude refused "${label}"`)
  }
  return cleaned
}

async function getArticleSlugs() {
  try {
    const files = await readdir(ARTICLES_DIR)
    return files.filter(f => f.endsWith('.mdx')).map(f => f.replace('.mdx', '').toLowerCase())
  } catch {
    return []
  }
}

async function pickKeyword() {
  const universe = await loadJsonAsync(KEYWORD_UNIVERSE, [])
  const coverage = await loadJsonAsync(KEYWORD_COVERAGE, { covered: [] })
  const existingSlugs = await getArticleSlugs()

  const coveredSlugs = new Set(coverage.covered.map(c => c.slug))
  const today = new Date()

  // Filter out already covered (within cooldown) and already written
  const available = universe.filter(entry => {
    if (existingSlugs.some(s => s.includes(entry.slug))) return false
    const prev = coverage.covered.find(c => c.slug === entry.slug)
    if (!prev) return true
    const daysSince = (today - new Date(prev.date)) / (1000 * 60 * 60 * 24)
    return daysSince > COOLDOWN_DAYS
  })

  if (!available.length) {
    console.log('All keywords covered — nothing to write today.')
    process.exit(0)
  }

  // Priority 1 first, then priority 2; within same priority, first uncovered wins
  available.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
  return available[0]
}

async function callClaude(client, prompt, label, maxTokens = 3000) {
  const delay = ms => new Promise(r => setTimeout(r, ms))
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: `You are a financial journalist writing for European retail and institutional investors.
Tone: FT editorial — precise, declarative, no fluff.
Cite specific numbers, mechanisms, and historical examples where relevant.
Never use phrases like "it's worth noting", "as an AI", "AI-powered", or "in conclusion".
Structure responses clearly. Use ## for section headers.
Write for readers who are intelligent but may not be finance professionals.`,
        messages: [{ role: 'user', content: prompt }],
      })
      return validateOutput(msg.content[0].text.trim(), label)
    } catch (err) {
      if (attempt === 3) throw err
      console.log(`  Retry ${attempt}/3 for "${label}"...`)
      await delay(3500 * attempt)
    }
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY required')

  const entry = await pickKeyword()
  console.log(`→ Writing article for: "${entry.keyword}" (topic: ${entry.topic})`)

  const client = new Anthropic()
  const today = new Date()
  const dateStr = toDateStr(today)
  const slug = `${dateStr}-${entry.slug}`

  // Generate article body
  const body = await callClaude(client,
    `Write an in-depth explainer article targeting the search query: "${entry.keyword}"

Topic area: ${entry.topic}
Site: Boursee (boursee.com) — European market intelligence for retail and institutional investors

Requirements:
- Start with an ## Introduction section that directly answers the search query in 2-3 sentences
- Include these sections (adapt names to fit the topic):
  ## Introduction
  ## How It Works (or The Mechanism, or What It Contains)
  ## European Context (regulatory, structural, or geographic nuance specific to Europe)
  ## Historical Episodes (2-3 real examples with approximate dates and numbers)
  ## What to Watch (5-7 bullet-style items as plain sentences, no bullet characters)
- Total length: 550-750 words
- Include specific numbers, ticker symbols (with exchange suffix), index names, and regulatory references
- MiFID II / ESMA context where relevant
- No padding, no bullet points (use prose paragraphs except in What to Watch)
- End with the What to Watch section — no conclusion paragraph

Write the article body only (no frontmatter). Start directly with ## Introduction.`,
    'article-body', 2000
  )

  // Generate title
  const title = await callClaude(client,
    `Write an SEO-optimised article title for the search query: "${entry.keyword}"
Rules: max 65 characters, title case, no quotes, clear and descriptive.
Respond with ONLY the title text.`,
    'title', 80
  )

  // Generate description
  const description = await callClaude(client,
    `Write a meta description for an article titled "${title.trim()}" targeting the query "${entry.keyword}".
Rules: 140-160 characters, includes the target keyword, describes what the reader will learn.
Respond with ONLY the description text.`,
    'description', 100
  )

  // Compose MDX
  const mdx = `export const metadata = {
  title: '${title.trim().replace(/'/g, "\\'")}',
  description: '${description.trim().replace(/'/g, "\\'")}',
  date: '${dateStr}',
  slug: '${slug}',
  keywords: ['${entry.keyword}'],
  tags: ['${entry.topic}'],
  topic: '${entry.topic}',
}

${body}
`

  if (!existsSync(ARTICLES_DIR)) mkdirSync(ARTICLES_DIR, { recursive: true })
  const filePath = join(ARTICLES_DIR, `${slug}.mdx`)
  await writeFile(filePath, mdx, 'utf8')
  console.log(`✓ Written: content/articles/${slug}.mdx`)

  // Update coverage
  const coverage = await loadJsonAsync(KEYWORD_COVERAGE, { covered: [] })
  coverage.covered.push({ slug: entry.slug, keyword: entry.keyword, date: dateStr })
  await writeFile(KEYWORD_COVERAGE, JSON.stringify(coverage, null, 2), 'utf8')
  console.log(`✓ Updated keyword coverage`)
}

main().catch(err => {
  console.error('✗ Keyword article generation failed:', err.message)
  process.exit(1)
})
