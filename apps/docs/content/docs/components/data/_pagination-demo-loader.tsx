'use client'

import dynamic from 'next/dynamic'

export const PaginationDemo = dynamic(() => import('./_pagination-demo').then((m) => m.PaginationDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
