'use client'

import dynamic from 'next/dynamic'

export const FieldDemo = dynamic(() => import('./_field-demo').then((m) => m.FieldDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
