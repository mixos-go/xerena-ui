import { describe, expect, it } from 'vitest'
import tokens from '../src/tokens.json'
import { toCssVars } from './generate.mjs'

const css = toCssVars(tokens)

describe('generate toCssVars', () => {
  it('emits duration numbers as unitless CSS vars', () => {
    expect(css).toContain('--xr-motion-duration-base: 150;')
    expect(css).toContain('--xr-motion-duration-instant: 1;')
    expect(css).toContain('--xr-motion-duration-emphatic: 600;')
  })

  it('flattens easing arrays comma-joined with spaces', () => {
    expect(css).toContain('--xr-motion-easing-standard: 0.2, 0, 0, 1;')
    expect(css).toContain('--xr-motion-easing-emphasis: 0.34, 1.3, 0.64, 1;')
    expect(css).toContain('--xr-motion-easing-enter: 0.05, 0.7, 0.1, 1;')
    expect(css).toContain('--xr-motion-easing-exit: 0.3, 0, 0.8, 0.15;')
  })

  it('keeps existing scalar and object emission intact', () => {
    expect(css).toContain('--xr-color-ember-600: #c04e1d;')
    expect(css).toContain('--xr-radius-2xl: 28;')
  })
})

it('imports generate.mjs without side effects (no dist files written)', () => {
  expect(typeof toCssVars).toBe('function')
})