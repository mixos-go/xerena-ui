import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/xerena-ui',
  trailingSlash: true,
  // Dev server is accessed through a forwarded host; Next 16 blocks
  // cross-origin dev hosts unless listed here (see dev log suggestion).
  allowedDevOrigins: ['16.79.68.224'],
}

export default withMDX(config)
