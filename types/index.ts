export interface MarketData {
  name: string
  ticker: string
  value: string
  change: string
  changePct: string
  direction: 'up' | 'down' | 'flat'
  country?: string
  flag?: string
}

export interface Brief {
  edition: number
  date: string
  dateShort: string
  headline: string
  excerpt: string
  tags: { label: string; variant: 'green' | 'gold' | 'red' | 'default' }[]
  readTime: number
  slug: string
}

export interface Exchange {
  flag: string
  name: string
  index: string
  country: string
}

export interface Feature {
  num: string
  icon: string
  title: string
  description: string
  href?: string
}

export interface BriefMetadata {
  edition: number
  date: string
  dateShort: string
  headline: string
  excerpt: string
  tags: { label: string; variant: 'green' | 'gold' | 'red' | 'default' }[]
  readTime: number
  slug: string
  generationMethod?: string
  humanReviewed?: boolean
  generatedAt?: string
}

export interface ArticleMetadata {
  title: string
  description: string
  date: string
  slug: string
  keywords: string[]
  tags: string[]
  topic: string
}
