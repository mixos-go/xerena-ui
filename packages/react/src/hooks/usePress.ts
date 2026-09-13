import { useCallback, useState } from 'react'
export function usePress() {
  const [pressed, setPressed] = useState(false)
  const onPointerDown = useCallback(() => setPressed(true), [])
  const onPointerUp = useCallback(() => setPressed(false), [])
  const onPointerLeave = useCallback(() => setPressed(false), [])
  return { pressed, onPointerDown, onPointerUp, onPointerLeave }
}