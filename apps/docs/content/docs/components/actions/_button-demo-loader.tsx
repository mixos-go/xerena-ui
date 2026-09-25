'use client'

import dynamic from 'next/dynamic'

export const ButtonDemo = dynamic(() => import('./_button-demo').then((m) => m.ButtonDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
