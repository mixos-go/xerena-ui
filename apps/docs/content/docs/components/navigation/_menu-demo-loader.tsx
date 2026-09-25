'use client'

import dynamic from 'next/dynamic'

export const MenuDemo = dynamic(() => import('./_menu-demo').then((m) => m.MenuDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
