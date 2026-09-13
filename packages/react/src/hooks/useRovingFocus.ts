import { useRef } from 'react'
import type { KeyboardEvent, RefObject } from 'react'
export function useRovingFocus(): {
  handleKeydown: (e: KeyboardEvent<HTMLElement>, items: HTMLElement[]) => void
  rovingRef: RefObject<HTMLElement | null>
} {
  const rovingRef = useRef<HTMLElement | null>(null)
  const handleKeydown = (e: KeyboardEvent<HTMLElement>, items: HTMLElement[]) => {
    const index = items.indexOf(e.currentTarget as HTMLElement)
    let next = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index + 1
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = items.length - 1
    if (next >= 0 && next < items.length) {
      e.preventDefault()
      items[next]?.focus()
    }
  }
  return { handleKeydown, rovingRef }
}