import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    const media = window.matchMedia(QUERY)
    const handle = () => setReduced(media.matches)
    handle()
    media.addEventListener('change', handle)
    return () => media.removeEventListener('change', handle)
  }, [])

  return reduced
}