import { createContext, useContext } from 'react'
import type { SemanticAlias } from '@xerena/tokens'

export type ColorMode = 'light' | 'dark'

export interface XTheme {
  mode: ColorMode
  semantic?: Partial<Record<SemanticAlias, string>>
}

export interface ThemeContextValue {
  theme: XTheme
  setTheme: (theme: XTheme) => void
  semantic: Record<SemanticAlias, string>
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx === null) {
    throw new Error('useTheme must be used within <Provider>')
  }
  return ctx
}

export function useThemeMode(): ColorMode {
  const ctx = useContext(ThemeContext)
  return ctx?.theme.mode ?? 'light'
}
