'use client'

import dynamic from 'next/dynamic'

export const IconButtonDemo = dynamic(() => import('./_icon-button-demo').then((m) => m.IconButtonDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
