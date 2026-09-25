'use client'

import dynamic from 'next/dynamic'

export const ComboboxDemo = dynamic(() => import('./_combobox-demo').then((m) => m.ComboboxDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
