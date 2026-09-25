'use client'

import dynamic from 'next/dynamic'

export const ToastDemo = dynamic(() => import('./_toast-demo').then((m) => m.ToastDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
