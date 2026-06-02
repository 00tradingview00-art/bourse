import { readdirSync } from 'fs'
import { join } from 'path'
import { BRIEFS } from './data'
import type { BriefMetadata } from '@/types'

const BRIEFS_DIR = join(process.cwd(), 'content/briefs')

export async function fetchBriefs(): Promise<BriefMetadata[]> {
  try {
    const files = readdirSync(BRIEFS_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.mdx')).sort().reverse()
    if (!mdxFiles.length) return BRIEFS as BriefMetadata[]
    const mods = await Promise.all(
      mdxFiles.map(f => import(`@/content/briefs/${f.replace('.mdx', '')}.mdx`))
    )
    const metadata: BriefMetadata[] = mods
      .map(m => m.metadata as BriefMetadata)
      .filter(Boolean)
      .sort((a, b) => b.edition - a.edition)
    return metadata.length ? metadata : (BRIEFS as BriefMetadata[])
  } catch {
    return BRIEFS as BriefMetadata[]
  }
}

export function getBriefSlugs(): string[] {
  try {
    const files = readdirSync(BRIEFS_DIR)
    return files
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
  } catch {
    return BRIEFS.map(b => b.slug)
  }
}
