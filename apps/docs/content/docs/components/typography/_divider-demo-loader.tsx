'use client'

import dynamic from 'next/dynamic'

export const DividerDemo = dynamic(() => import('./_divider-demo').then((m) => m.DividerDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
