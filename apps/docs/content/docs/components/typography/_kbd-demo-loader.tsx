'use client'

import dynamic from 'next/dynamic'

export const KbdDemo = dynamic(() => import('./_kbd-demo').then((m) => m.KbdDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
