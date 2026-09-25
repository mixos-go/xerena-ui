'use client'

import dynamic from 'next/dynamic'

export const DialogDemo = dynamic(() => import('./_dialog-demo').then((m) => m.DialogDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
