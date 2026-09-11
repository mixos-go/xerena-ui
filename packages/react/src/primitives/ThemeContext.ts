import { createContext, useContext } from 'react'

export type ColorMode = 'light' | 'dark'

export interface XTheme {
  mode: ColorMode
}

export interface ThemeContextValue {
  theme: XTheme
  setTheme: (theme: XTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): XTheme {
  const ctx = useContext(ThemeContext)
  if (ctx === null) {
    throw new Error('useTheme must be used within <Provider>')
  }
  return ctx.theme
}
