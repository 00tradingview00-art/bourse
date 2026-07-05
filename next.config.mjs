import createMDX from '@next/mdx'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {},
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  async redirects() {
    return [
      { source: '/briefs/edition-025', destination: '/briefs/2026-05-26-dollar-weakness-lifts-euro-exporters-ecb', permanent: true },
      { source: '/briefs/edition-026', destination: '/briefs/2026-05-27-adyen-q1-beat-supports-payments-sector', permanent: true },
      { source: '/briefs/edition-027', destination: '/briefs/2026-05-28-venezuela-shock-reverses-european-equities-recover', permanent: true },
      { source: '/briefs/edition-028', destination: '/briefs/2026-05-29-post-fed-relief-euro-holds-rate-anxiety', permanent: true },
      { source: '/briefs/edition-029', destination: '/briefs/2026-06-02-oil-near-104-eurozone-equities-hold-ecb', permanent: true },
      { source: '/briefs/edition-030', destination: '/briefs/2026-06-04-european-equities-split-cac-leads-gains', permanent: true },
      { source: '/briefs/edition-031', destination: '/briefs/2026-06-05-european-equities-edge-higher-brent-crude', permanent: true },
      { source: '/briefs/edition-032', destination: '/briefs/2026-06-08-european-equities-diverge-brent-crude-climbs', permanent: true },
      { source: '/briefs/edition-033', destination: '/briefs/2026-06-09-european-equities-slide-brent-crude-drops', permanent: true },
      { source: '/briefs/edition-034', destination: '/briefs/2026-06-10-european-stocks-split-surging-oil-retreating', permanent: true },
      { source: '/briefs/edition-035', destination: '/briefs/2026-06-11-european-equities-climb-brent-crude-slides', permanent: true },
      { source: '/briefs/edition-036', destination: '/briefs/2026-06-12-european-stocks-surge-broadly-ibex-leads', permanent: true },
      { source: '/briefs/edition-037', destination: '/briefs/2026-06-15-european-stocks-rally-broadly-gold-surges', permanent: true },
      { source: '/briefs/edition-038', destination: '/briefs/2026-06-16-european-stocks-edge-higher-brent-crude', permanent: true },
      { source: '/briefs/edition-039', destination: '/briefs/2026-06-17-european-equities-advance-broadly-aex-ibex', permanent: true },
      { source: '/briefs/edition-040', destination: '/briefs/2026-06-18-european-equities-mixed-gold-oil-slide', permanent: true },
      { source: '/briefs/edition-041', destination: '/briefs/2026-06-19-european-stocks-edge-higher-gold-slides', permanent: true },
      { source: '/briefs/edition-042', destination: '/briefs/2026-06-22-european-equities-split-dax-cac-drag', permanent: true },
      { source: '/briefs/edition-043', destination: '/briefs/2026-06-23-european-equities-slide-broadly-aex-leads', permanent: true },
      { source: '/briefs/edition-044', destination: '/briefs/2026-06-24-european-stocks-diverge-dax-slides-76', permanent: true },
      { source: '/briefs/edition-045', destination: '/briefs/2026-06-25-european-equities-advance-broadly-aex-leads', permanent: true },
      { source: '/briefs/edition-046', destination: '/briefs/2026-06-26-european-stocks-slide-brent-crude-tumbles', permanent: true },
      { source: '/briefs/edition-047', destination: '/briefs/2026-06-29-european-stocks-drift-cac-ibex-slip', permanent: true },
      { source: '/briefs/edition-048', destination: '/briefs/2026-06-30-european-equities-rise-broadly-dax-leads', permanent: true },
      { source: '/briefs/edition-049', destination: '/briefs/2026-07-01-european-equities-drift-gold-slips-below', permanent: true },
      { source: '/briefs/edition-050', destination: '/briefs/2026-07-02-european-stocks-advance-broadly-dax-cac', permanent: true },
      { source: '/briefs/edition-051', destination: '/briefs/2026-07-03-european-stocks-advance-gold-surges-past', permanent: true },
    ]
  },
}

export default withMDX(nextConfig)
