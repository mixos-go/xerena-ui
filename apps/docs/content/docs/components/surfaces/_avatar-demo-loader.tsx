'use client'

import dynamic from 'next/dynamic'

export const AvatarDemo = dynamic(() => import('./_avatar-demo').then((m) => m.AvatarDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
