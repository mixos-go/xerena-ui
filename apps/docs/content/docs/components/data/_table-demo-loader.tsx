'use client'

import dynamic from 'next/dynamic'

export const TableDemo = dynamic(() => import('./_table-demo').then((m) => m.TableDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
