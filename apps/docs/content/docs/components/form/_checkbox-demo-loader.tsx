'use client'

import dynamic from 'next/dynamic'

export const CheckboxDemo = dynamic(() => import('./_checkbox-demo').then((m) => m.CheckboxDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
