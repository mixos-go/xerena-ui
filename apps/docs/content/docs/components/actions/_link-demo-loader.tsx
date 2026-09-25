'use client'

import dynamic from 'next/dynamic'

export const LinkDemo = dynamic(() => import('./_link-demo').then((m) => m.LinkDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
