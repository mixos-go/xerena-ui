import { describe, expect, it } from 'vitest'
import { colors, spacing, semantic } from './index'

describe('tokens', () => {
  it('exposes primary color', () => {
    expect(colors.blue[600]).toBe('#2563eb')
  })

  it('exposes spacing scale', () => {
    expect(spacing[4]).toBe(16)
  })

  it('resolves semantic aliases to primitives', () => {
    expect(semantic.color.primary).toBe(colors.blue[600])
    expect(semantic.spacing.md).toBe(spacing[4])
  })
})
