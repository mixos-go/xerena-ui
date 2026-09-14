import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { PreviewPopover, useReducedMotionSync } from '../../primitives'

export interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: 'topStart' | 'topCenter' | 'topEnd' | 'bottomStart' | 'bottomCenter' | 'bottomEnd'
  delay?: number
  className?: string
}

export function Tooltip({ children, content, position = 'topCenter', delay = 400 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const timerRef = useRef<number>(0)
  const reduced = useReducedMotionSync()
  const show = useCallback((el: HTMLElement) => {
    setAnchor(el)
    if (reduced) { setOpen(true); return }
    timerRef.current = window.setTimeout(() => setOpen(true), delay)
  }, [delay, reduced])
  const hide = useCallback(() => { clearTimeout(timerRef.current); setOpen(false) }, [])
  const isTop = position.startsWith('top')
  return (
    <div style={{ display: 'inline-block' }}
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={hide}
      onFocus={(e) => show(e.currentTarget)}
      onBlur={hide}
    >
      {children}
      <PreviewPopover open={open} label={typeof content === 'string' ? content : ''} anchor={anchor} preferred={isTop ? 'top' : 'bottom'}>
        {content}
      </PreviewPopover>
    </div>
  )
}