import { useContext } from 'react'
import { ThemeContext } from '../primitives/ThemeContext'

export function useNativeColors() {
  const ctx = useContext(ThemeContext)
  if (ctx === null) {
    throw new Error('useNativeColors must be used within <Provider>')
  }
  return ctx.semantic
}
