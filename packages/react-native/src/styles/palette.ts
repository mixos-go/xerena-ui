import { semantic, semanticDark, type SemanticAlias } from '@xerena/tokens'
import type { XTheme } from '../primitives/ThemeContext'

export function resolvePalette(theme: XTheme): Record<SemanticAlias, string> {
  const base = theme.mode === 'dark' ? semanticDark.color : semantic.color
  return Object.fromEntries(
    (Object.keys(base) as SemanticAlias[]).map((alias) => [
      alias,
      theme.semantic?.[alias] ?? base[alias],
    ]),
  ) as Record<SemanticAlias, string>
}
