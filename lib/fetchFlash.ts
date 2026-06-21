import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const FLASH_DIR = join(process.cwd(), 'content/flash')

export interface FlashMetadata {
  headline: string
  excerpt: string
  date: string
  dateShort: string
  tags: { label: string; variant: 'green' | 'gold' | 'red' | 'default' }[]
  readTime: number
  slug: string
  category: string
  generationMethod?: string
  generatedAt?: string
}

function parseStr(content: string, key: string): string {
  const m = content.match(new RegExp(`${key}:\\s*"([^"]*)"`, 's'))
  return m ? m[1] : ''
}

function parseTags(content: string): FlashMetadata['tags'] {
  try {
    const m = content.match(/tags:\s*(\[[\s\S]*?\])/m)
    if (!m) return []
    // Convert JS-like object literals to JSON
    const json = m[1]
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"')
    return JSON.parse(json) as FlashMetadata['tags']
  } catch { return [] }
}

function parseMetadataFromMdx(content: string, filename: string): FlashMetadata | null {
  try {
    return {
      headline:         parseStr(content, 'headline'),
      excerpt:          parseStr(content, 'excerpt'),
      date:             parseStr(content, 'date'),
      dateShort:        parseStr(content, 'dateShort'),
      tags:             parseTags(content),
      readTime:         parseInt(parseStr(content, 'readTime')) || 2,
      slug:             parseStr(content, 'slug') || filename.replace('.mdx', ''),
      category:         parseStr(content, 'category'),
      generationMethod: parseStr(content, 'generationMethod') || undefined,
      generatedAt:      parseStr(content, 'generatedAt') || undefined,
    }
  } catch { return null }
}

export function fetchFlash(): FlashMetadata[] {
  try {
    const files = readdirSync(FLASH_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.mdx')).sort().reverse()
    if (!mdxFiles.length) return []
    return mdxFiles
      .map(f => {
        try {
          const content = readFileSync(join(FLASH_DIR, f), 'utf8')
          return parseMetadataFromMdx(content, f)
        } catch { return null }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.generatedAt ?? 0).getTime() - new Date(a!.generatedAt ?? 0).getTime()) as FlashMetadata[]
  } catch {
    return []
  }
}

export function getFlashSlugs(): string[] {
  try {
    const files = readdirSync(FLASH_DIR)
    return files
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
  } catch {
    return []
  }
}
