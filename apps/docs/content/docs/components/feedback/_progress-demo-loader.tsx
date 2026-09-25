'use client'

import dynamic from 'next/dynamic'

export const ProgressDemo = dynamic(() => import('./_progress-demo').then((m) => m.ProgressDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
