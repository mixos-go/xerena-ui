import { Children, cloneElement, isValidElement } from 'react'

export interface SlotProps {
  children: React.ReactNode
  [key: string]: unknown
}

export function Slot({ children, ...rest }: SlotProps) {
  const child = Children.only(children)
  if (!isValidElement(child)) return child as React.ReactNode
  const { className: childClassName, ...childRest } = child.props as Record<string, unknown>
  const merged = {
    ...childRest,
    ...rest,
    className: [rest.className, childClassName].filter(Boolean).join(' '),
  }
  return cloneElement(child, merged)
}
