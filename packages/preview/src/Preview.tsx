'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Provider, useTheme } from '@xerena/react'
import { previewTheme, type PreviewMode } from './theme'

function ModeSync({ mode }: { mode: PreviewMode }) {
  const { theme, setTheme } = useTheme()
  const setThemeRef = useRef(setTheme)
  setThemeRef.current = setTheme
  useEffect(() => {
    // Guarded: Provider mints a new setTheme identity per render, so an
    // unconditional call loops forever. Only sync when modes actually differ.
    if (theme.mode !== mode) {
      setThemeRef.current(previewTheme(mode))
    }
  }, [mode, theme.mode])
  return null
}

export interface PreviewProps {
  title?: string
  description?: string
  code?: string
  defaultMode?: PreviewMode
  showCode?: boolean
  children: ReactNode
}

export function Preview({ title, description, code, defaultMode = 'light', showCode = true, children }: PreviewProps) {
  const [mode, setMode] = useState<PreviewMode>(defaultMode)
  const [open, setOpen] = useState(showCode)
  const next: PreviewMode = mode === 'light' ? 'dark' : 'light'
  return (
    <section className="xr-preview" aria-label={title ?? 'Example preview'}>
      {(title !== undefined || description !== undefined) && (
        <div className="xr-preview__header">
          {title !== undefined && <p className="xr-preview__title">{title}</p>}
          {description !== undefined && <p className="xr-preview__description">{description}</p>}
        </div>
      )}
      <div className="xr-preview__toolbar" role="group" aria-label="Preview options">
        <button type="button" className="xr-preview__toggle" aria-pressed={mode === 'dark'} onClick={() => setMode(next)}>
          {mode === 'light' ? 'Dark' : 'Light'}
        </button>
        {code !== undefined && (
          <button type="button" className="xr-preview__toggle" aria-pressed={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide code' : 'Show code'}
          </button>
        )}
      </div>
      <div className="xr-preview__surface">
        <Provider theme={previewTheme(mode)}>
          <ModeSync mode={mode} />
          {children}
        </Provider>
      </div>
      {code !== undefined && open && (
        <pre className="xr-preview__code">
          <code>{code}</code>
        </pre>
      )}
    </section>
  )
}
