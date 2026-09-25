'use client'

import dynamic from 'next/dynamic'

export const SpinnerDemo = dynamic(() => import('./_spinner-demo').then((m) => m.SpinnerDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
