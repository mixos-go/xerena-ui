'use client'

import dynamic from 'next/dynamic'

export const BadgeDemo = dynamic(() => import('./_badge-demo').then((m) => m.BadgeDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
