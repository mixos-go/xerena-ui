'use client'

import dynamic from 'next/dynamic'

export const ContainerDemo = dynamic(() => import('./_container-demo').then((m) => m.ContainerDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
