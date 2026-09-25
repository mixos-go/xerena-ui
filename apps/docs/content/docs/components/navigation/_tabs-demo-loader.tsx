'use client'

import dynamic from 'next/dynamic'

export const TabsDemo = dynamic(() => import('./_tabs-demo').then((m) => m.TabsDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
