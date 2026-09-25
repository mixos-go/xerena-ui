'use client'

import dynamic from 'next/dynamic'

export const SliderDemo = dynamic(() => import('./_slider-demo').then((m) => m.SliderDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})
