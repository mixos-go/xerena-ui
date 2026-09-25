'use client'

import dynamic from 'next/dynamic'

export const HeadingDemo = dynamic(() => import('./_heading-demo').then((m) => m.HeadingDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
