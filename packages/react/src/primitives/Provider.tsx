import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue, type XTheme } from './ThemeContext'

export interface ProviderProps {
  children: ReactNode
  initialMode?: 'light' | 'dark'
}

export function Provider({ children, initialMode = 'light' }: ProviderProps) {
  const [theme, setTheme] = useState<XTheme>({ mode: initialMode })

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div data-xerena-theme={theme.mode}>{children}</div>
    </ThemeContext.Provider>
  )
}