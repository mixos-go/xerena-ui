'use client'

import dynamic from 'next/dynamic'

export const DrawerDemo = dynamic(() => import('./_drawer-demo').then((m) => m.DrawerDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
