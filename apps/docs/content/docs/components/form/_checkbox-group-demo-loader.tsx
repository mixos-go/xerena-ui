'use client'

import dynamic from 'next/dynamic'

export const CheckboxGroupDemo = dynamic(() => import('./_checkbox-group-demo').then((m) => m.CheckboxGroupDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
