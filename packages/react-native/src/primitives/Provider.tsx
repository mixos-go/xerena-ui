import { Fragment, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Text } from 'react-native'
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
    <Fragment>
      <Text>{`xerena-theme:${theme.mode}`}</Text>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </Fragment>
  )
}
