'use client'

import dynamic from 'next/dynamic'

export const NumberInputDemo = dynamic(() => import('./_number-input-demo').then((m) => m.NumberInputDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
