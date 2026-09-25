import type { XTheme } from '@xerena/react'

export type PreviewMode = 'light' | 'dark'

export function previewTheme(mode: PreviewMode): XTheme {
  return { mode }
}
