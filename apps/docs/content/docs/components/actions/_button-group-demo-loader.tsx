'use client'

import dynamic from 'next/dynamic'

export const ButtonGroupDemo = dynamic(() => import('./_button-group-demo').then((m) => m.ButtonGroupDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
