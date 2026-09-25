'use client'

import dynamic from 'next/dynamic'

export const SkeletonDemo = dynamic(() => import('./_skeleton-demo').then((m) => m.SkeletonDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
