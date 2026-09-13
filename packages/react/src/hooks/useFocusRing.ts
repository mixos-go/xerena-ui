import { useCallback, useState } from 'react'
export function useFocusRing() {
  const [focusWithin, setFocusWithin] = useState(false)
  const onFocus = useCallback(() => setFocusWithin(true), [])
  const onBlur = useCallback(() => setFocusWithin(false), [])
  return { focusWithin, onFocus, onBlur }
}