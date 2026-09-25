'use client'

import dynamic from 'next/dynamic'

export const RadioGroupDemo = dynamic(() => import('./_radio-group-demo').then((m) => m.RadioGroupDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
