import { createPortal } from 'react-dom'
import { useMemo } from 'react'
import { useDismissable, useFocusTrap } from '../hooks'
import { useThemeMode } from './ThemeContext'
import type { ReactNode } from 'react'

export interface OverlayPrimitiveProps {
  open: boolean
  onClose: () => void
  labeledBy?: string
  focusTrap?: boolean
  onOutside?: (e: PointerEvent) => void
  children: ReactNode
}

export function OverlayPrimitive({ open, onClose, labeledBy, focusTrap = false, onOutside, children }: OverlayPrimitiveProps) {
  const trapRef = useFocusTrap(open && focusTrap)
  const dismissRef = useDismissable(open, onClose, onOutside ?? onClose)
  const mode = useThemeMode()
  const mergedRef = useMemo(() => (el: HTMLDivElement | null) => {
    trapRef.current = el
    dismissRef.current = el
  }, [trapRef, dismissRef])

  if (!open) return null
  return createPortal(
    <div
      ref={mergedRef}
      className="xr-overlay xr-overlay--fixed"
      role="presentation"
      aria-modal={focusTrap ? true : undefined}
      aria-labelledby={labeledBy}
      data-xerena-overlay=""
      data-xerena-theme={mode}
    >
      {children}
    </div>,
    document.body,
  )
}
