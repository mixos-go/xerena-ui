import type { ReactNode } from 'react'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

export interface AnchorState {
  x: number
  y: number
  width: number
  height: number
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<View | null>
}

export interface AnchorProps {
  children: (state: AnchorState) => ReactNode
}

export function Anchor({ children }: AnchorProps) {
  const triggerRef = useRef<View>(null)
  const [geometry, setGeometry] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [open, setOpen] = useState(false)

  const measure = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setGeometry({ x: x ?? 0, y: y ?? 0, width: width ?? 0, height: height ?? 0 })
    })
  }, [])

  return (
    <View ref={triggerRef} onLayout={measure} collapsable={false}>
      {children({ ...geometry, open, setOpen, triggerRef })}
    </View>
  )
}
