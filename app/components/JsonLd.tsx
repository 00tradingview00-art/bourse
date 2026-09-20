import { safeJsonLd } from '@/lib/seo'

/** Server-rendered JSON-LD block. Pass a schema.org object (or array of objects). */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}
