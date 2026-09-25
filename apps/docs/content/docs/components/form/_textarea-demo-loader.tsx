'use client'

import dynamic from 'next/dynamic'

export const TextareaDemo = dynamic(() => import('./_textarea-demo').then((m) => m.TextareaDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
