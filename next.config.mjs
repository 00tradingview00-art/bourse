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
    ]
  },
}

export default withMDX(nextConfig)
