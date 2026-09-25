'use client'

import dynamic from 'next/dynamic'

export const GridDemo = dynamic(() => import('./_grid-demo').then((m) => m.GridDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
