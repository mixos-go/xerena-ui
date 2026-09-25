'use client'

import dynamic from 'next/dynamic'

export const PopoverDemo = dynamic(() => import('./_popover-demo').then((m) => m.PopoverDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
