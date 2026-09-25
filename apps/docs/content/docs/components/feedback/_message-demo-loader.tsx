'use client'

import dynamic from 'next/dynamic'

export const MessageDemo = dynamic(() => import('./_message-demo').then((m) => m.MessageDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
