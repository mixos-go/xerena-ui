import { describe, expect, it } from 'vitest'
import { spacingValue, radiusValue, durationValue, easingValue } from './index'
import type { Bezier } from './motion'

describe('value resolvers', () => {
  it('reads spacing by key', () => {
    expect(spacingValue('4')).toBe(16)
    expect(spacingValue('1')).toBe(4)
  })

  it('reads radius by key', () => {
    expect(radiusValue('lg')).toBe(12)
    expect(radiusValue('full')).toBe(9999)
  })

  it('reads motion durations as numbers', () => {
    expect(durationValue('instant')).toBe(1)
    expect(durationValue('base')).toBe(150)
    expect(durationValue('emphatic')).toBe(600)
  })

  it('reads motion easings as 4-tuples', () => {
    expect(easingValue('standard')).toEqual([0.2, 0, 0, 1] satisfies Bezier)
    expect(easingValue('emphasis')).toEqual([0.34, 1.3, 0.64, 1] satisfies Bezier)
  })
})
