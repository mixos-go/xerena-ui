'use client'

import dynamic from 'next/dynamic'

export const SelectDemo = dynamic(() => import('./_select-demo').then((m) => m.SelectDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
