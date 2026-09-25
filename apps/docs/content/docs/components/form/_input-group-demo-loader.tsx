'use client'

import dynamic from 'next/dynamic'

export const InputGroupDemo = dynamic(() => import('./_input-group-demo').then((m) => m.InputGroupDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
