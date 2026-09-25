'use client'

import dynamic from 'next/dynamic'

export const RadioDemo = dynamic(() => import('./_radio-demo').then((m) => m.RadioDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
