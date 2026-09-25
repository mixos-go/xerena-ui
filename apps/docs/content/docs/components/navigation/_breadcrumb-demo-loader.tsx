'use client'

import dynamic from 'next/dynamic'

export const BreadcrumbDemo = dynamic(() => import('./_breadcrumb-demo').then((m) => m.BreadcrumbDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
