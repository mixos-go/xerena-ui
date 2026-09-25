'use client'

import dynamic from 'next/dynamic'

export const StackDemo = dynamic(() => import('./_stack-demo').then((m) => m.StackDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
