'use client'

import dynamic from 'next/dynamic'

export const SwitchDemo = dynamic(() => import('./_switch-demo').then((m) => m.SwitchDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
