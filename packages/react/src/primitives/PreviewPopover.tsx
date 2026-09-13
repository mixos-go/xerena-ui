import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface PreviewPopoverProps {
  open: boolean
  label: string
  anchor: HTMLElement | null
  preferred?: 'top' | 'bottom'
  children: ReactNode
}

export function PreviewPopover({ open, label, anchor, preferred = 'bottom', children }: PreviewPopoverProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  useEffect(() => {
    if (!open || !anchor) { setCoords(null); return }
    const r = anchor.getBoundingClientRect()
    const pad = 6
    setCoords(
      preferred === 'bottom'
        ? { top: r.bottom + pad, left: r.left + r.width / 2 }
        : { top: r.top - pad, left: r.left + r.width / 2 },
    )
  }, [open, anchor, preferred])
  if (!open || !coords) return null
  return (
    <div
      role="tooltip"
      aria-label={label}
      className="xr-preview-popover"
      style={{ position: 'absolute', top: coords.top, left: coords.left, transform: 'translateX(-50%)' }}
      data-xerena-preview=""
    >
      {children}
    </div>
  )
}