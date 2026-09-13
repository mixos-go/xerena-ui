import { describe, expect, it } from 'vitest'
import { css, cssVar } from './css'

describe('cssVar', () => {
  it('builds a flat color variable', () => {
    expect(cssVar('color.ember.600')).toBe('var(--xr-color-ember-600)')
  })

  it('preserves segment case (no flattening), like the tokens generator', () => {
    expect(cssVar('typography.body.md.fontSize')).toBe('var(--xr-typography-body-md-fontSize)')
    expect(cssVar('typography.fontFamily.body')).toBe('var(--xr-typography-fontFamily-body)')
  })
})

describe('css', () => {
  it('adds px to spacing', () => {
    expect(css('spacing.4')).toBe('calc(var(--xr-spacing-4) * 1px)')
  })

  it('adds px to radius', () => {
    expect(css('radius.lg')).toBe('calc(var(--xr-radius-lg) * 1px)')
  })

  it('adds px to typography fontSize and lineHeight', () => {
    expect(css('typography.body.md.fontSize')).toBe('calc(var(--xr-typography-body-md-fontSize) * 1px)')
    expect(css('typography.body.md.lineHeight')).toBe('calc(var(--xr-typography-body-md-lineHeight) * 1px)')
  })

  it('keeps fontWeight and letterSpacing as bare variables', () => {
    expect(css('typography.body.md.fontWeight')).toBe('var(--xr-typography-body-md-fontWeight)')
    expect(css('typography.body.md.letterSpacing')).toBe('var(--xr-typography-body-md-letterSpacing)')
  })

  it('keeps fontFamily, colors and elevation as bare variables', () => {
    expect(css('typography.fontFamily.body')).toBe('var(--xr-typography-fontFamily-body)')
    expect(css('color.ember.600')).toBe('var(--xr-color-ember-600)')
    expect(css('elevation.raised')).toBe('var(--xr-elevation-raised)')
  })

  it('adds ms to motion durations', () => {
    expect(css('motion.duration.base')).toBe('calc(var(--xr-motion-duration-base) * 1ms)')
  })

  it('builds cubic-bezier for motion easings', () => {
    expect(css('motion.easing.standard')).toBe('cubic-bezier(var(--xr-motion-easing-standard))')
  })
})
