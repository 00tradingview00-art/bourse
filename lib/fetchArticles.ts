import { readdirSync } from 'fs'
import { join } from 'path'
import type { ArticleMetadata } from '@/types'

const ARTICLES_DIR = join(process.cwd(), 'content/articles')

export async function fetchArticles(): Promise<ArticleMetadata[]> {
  try {
    const files = readdirSync(ARTICLES_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.mdx')).sort().reverse()
    if (!mdxFiles.length) return []
    const mods = await Promise.all(
      mdxFiles.map(f => import(`@/content/articles/${f.replace('.mdx', '')}.mdx`))
    )
    return mods
      .map(m => m.metadata as ArticleMetadata)
      .filter(Boolean)
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export function getArticleSlugs(): string[] {
  try {
    const files = readdirSync(ARTICLES_DIR)
    return files
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
  } catch {
    return []
  }
}
