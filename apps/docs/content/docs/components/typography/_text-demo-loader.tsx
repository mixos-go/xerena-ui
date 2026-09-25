'use client'

import dynamic from 'next/dynamic'

export const TextDemo = dynamic(() => import('./_text-demo').then((m) => m.TextDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
