import { createContext } from 'react'

export type ColorMode = 'light' | 'dark'

export interface XTheme {
  mode: ColorMode
  colors?: Record<string, string>
}

export interface ThemeContextValue {
  theme: XTheme
  setTheme: (theme: XTheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)