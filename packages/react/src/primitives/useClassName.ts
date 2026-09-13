import { useMemo } from 'react'
import { cn } from './cn'

export function useClassName(
  props: { className?: string },
  variantClasses?: Array<string | false | null | undefined>,
): string {
  return useMemo(() => cn(props.className, ...(variantClasses ?? [])), [props.className, variantClasses])
}