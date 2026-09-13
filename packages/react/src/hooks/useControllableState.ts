import { useCallback, useState } from 'react'

export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | undefined,
  onChange?: (v: T) => void,
): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const set = useCallback(
    (v: T) => {
      if (!isControlled) setInternal(v)
      onChange?.(v as T)
    },
    [isControlled, onChange],
  )
  return [current as T, set]
}