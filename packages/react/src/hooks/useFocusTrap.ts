import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

function focusables(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((e): e is HTMLElement => !(e as HTMLElement).hasAttribute('disabled')) as HTMLElement[]
}

export function useFocusTrap(open: boolean): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!open) return
    const el = ref.current
    if (!el) return
    const items = focusables(el)
    const first = items[0]
    const last = items[items.length - 1]
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [open, ref.current])
  return ref
}
