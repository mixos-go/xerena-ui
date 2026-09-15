import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { resolvePalette } from '../styles/palette'
import { ThemeContext, type ThemeContextValue, type XTheme } from './ThemeContext'

export interface ProviderProps {
  children: ReactNode
  theme: XTheme
}

export function Provider({ children, theme }: ProviderProps) {
  const [stored, setStored] = useState<XTheme>(theme)
  const activeTheme = theme.mode === stored.mode ? { ...stored, ...theme } : stored

  const value = useMemo<ThemeContextValue>(() => {
    const semantic = resolvePalette(activeTheme)
    return { theme: activeTheme, setTheme: (t) => setStored(t), semantic }
  }, [activeTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
