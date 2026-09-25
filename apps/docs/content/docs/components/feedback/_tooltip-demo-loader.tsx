'use client'

import dynamic from 'next/dynamic'

export const TooltipDemo = dynamic(() => import('./_tooltip-demo').then((m) => m.TooltipDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
