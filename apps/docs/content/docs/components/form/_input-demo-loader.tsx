'use client'

import dynamic from 'next/dynamic'

export const InputDemo = dynamic(() => import('./_input-demo').then((m) => m.InputDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
