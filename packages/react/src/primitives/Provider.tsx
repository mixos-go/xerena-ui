import { cssVar } from '@xerena/styling'
import { semantic as lightSemantic, semanticDark } from '@xerena/tokens'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setToastThemeMode } from '../components/feedback/Toast'
import { ThemeContext, type ThemeContextValue, type XTheme } from './ThemeContext'
import type { SemanticAlias } from '@xerena/tokens'

export interface ProviderProps {
  children: ReactNode
  theme: XTheme
}

export function Provider({ children, theme }: ProviderProps) {
  const [stored, setStored] = useState<XTheme>(theme)
  const activeTheme = theme.mode === stored.mode ? { ...stored, ...theme } : stored

  useEffect(() => {
    setToastThemeMode(activeTheme.mode)
  }, [activeTheme.mode])

  const value = useMemo<ThemeContextValue>(() => {
    const base = activeTheme.mode === 'dark' ? semanticDark.color : lightSemantic.color
    const semantic = Object.fromEntries(
      (Object.keys(base) as SemanticAlias[]).map((alias) => [
        alias,
        activeTheme.semantic?.[alias] ?? (cssVar(`semantic.color.${alias}`) as string),
      ]),
    ) as Record<SemanticAlias, string>
    return { theme: activeTheme, setTheme: (t) => setStored(t), semantic }
  }, [activeTheme])

  return (
    <ThemeContext.Provider value={value}>
      <div data-xerena-theme={value.theme.mode}>{children}</div>
    </ThemeContext.Provider>
  )
}