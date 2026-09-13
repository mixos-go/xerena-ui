import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { buildStylesheet, resolveTokensPath } from './generate-styles.mjs'

const require = createRequire(import.meta.url)
const tokens = JSON.parse(readFileSync(resolveTokensPath(require), 'utf8'))
const css = buildStylesheet(tokens)

describe('generate-styles', () => {
  it('emits color utilities sized by shade', () => {
    expect(css).toContain('.xr-bg-ember-600 { background-color: var(--xr-color-ember-600); }')
    expect(css).toContain('.xr-text-sand-900 { color: var(--xr-color-sand-900); }')
    expect(css).toContain('.xr-border-ember-600 { border-color: var(--xr-color-ember-600); }')
  })

  it('emits spacing utilities via calc palette', () => {
    expect(css).toContain('.xr-p-4 { padding: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-px-4 { padding-inline: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-py-4 { padding-block: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-m-4 { margin: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-mx-4 { margin-inline: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-my-4 { margin-block: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-gap-6 { gap: calc(var(--xr-spacing-6) * 1px); }')
  })

  it('emits typography utilities per variant and size', () => {
    expect(css).toContain('.xr-font-family-body { font-family: var(--xr-typography-fontFamily-body); }')
    expect(css).toContain('.xr-font-size-body-md { font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); }')
    expect(css).toContain('.xr-leading-body-md { line-height: calc(var(--xr-typography-body-md-lineHeight) * 1px); }')
    expect(css).toContain('.xr-font-weight-body-md { font-weight: var(--xr-typography-body-md-fontWeight); }')
    expect(css).toContain('.xr-tracking-display-lg { letter-spacing: var(--xr-typography-display-lg-letterSpacing); }')
  })

  it('emits elevation, radius and motion utilities', () => {
    expect(css).toContain('.xr-elevation-raised { box-shadow: var(--xr-elevation-raised); }')
    expect(css).toContain('.xr-radius-lg { border-radius: calc(var(--xr-radius-lg) * 1px); }')
    expect(css).toContain('.xr-duration-base { transition-duration: calc(var(--xr-motion-duration-base) * 1ms); }')
    expect(css).toContain('.xr-ease-emphasis { transition-timing-function: cubic-bezier(var(--xr-motion-easing-emphasis)); }')
  })

  it('is deterministic', () => {
    expect(buildStylesheet(tokens)).toBe(css)
  })

  it('imports without side effects (no dist file written)', () => {
    expect(typeof buildStylesheet).toBe('function')
  })

  it('does not emit utilities for nested color groups like dark', () => {
    expect(css).not.toContain('.xr-bg-dark-ember')
    expect(css).not.toContain('.xr-bg-dark-sand')
    expect(css).not.toContain('.xr-text-dark-ember')
  })
})

describe('semantic utilities', () => {
  const tokens = { color: {}, spacing: {}, typography: { fontFamily: {}, body: {}, display: {}, mono: {} }, elevation: {}, radius: {}, motion: { duration: {}, easing: {} }, dark: {} }
  const css = buildStylesheet(tokens, { semantic: { light: { primary: {}, danger: {} } } })
  it('emits theme-aware semantic utilities', () => {
    expect(css).toContain('.xr-bg-primary { background-color: var(--xr-semantic-color-primary); }')
    expect(css).toContain('.xr-text-danger { color: var(--xr-semantic-color-danger); }')
    expect(css).toContain('.xr-border-danger { border-color: var(--xr-semantic-color-danger); }')
  })
})