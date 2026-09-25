'use client'

import dynamic from 'next/dynamic'

export const CardDemo = dynamic(() => import('./_card-demo').then((m) => m.CardDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
