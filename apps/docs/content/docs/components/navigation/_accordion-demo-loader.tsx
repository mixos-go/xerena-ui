'use client'

import dynamic from 'next/dynamic'

export const AccordionDemo = dynamic(() => import('./_accordion-demo').then((m) => m.AccordionDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
