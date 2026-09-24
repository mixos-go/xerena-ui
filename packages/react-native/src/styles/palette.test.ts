import { semantic, semanticDark } from '@xerena/tokens'
import { resolvePalette } from './palette'

describe('resolvePalette', () => {
  it('resolves light palette from semantic.color', () => {
    const palette = resolvePalette({ mode: 'light' })
    expect(palette.primary).toBe(semantic.color.primary)
    expect(palette.background).toBe(semantic.color.background)
    expect(palette.text).toBe(semantic.color.text)
  })

  it('resolves dark palette from semanticDark.color', () => {
    const palette = resolvePalette({ mode: 'dark' })
    expect(palette.primary).toBe(semanticDark.color.primary)
    expect(palette.background).toBe(semanticDark.color.background)
    expect(palette.text).toBe(semanticDark.color.text)
  })

  it('lets XTheme.semantic overrides win in light mode', () => {
    const override = '#ff0000'
    const palette = resolvePalette({ mode: 'light', semantic: { primary: override } })
    expect(palette.primary).toBe(override)
    expect(palette.background).toBe(semantic.color.background)
  })

  it('lets XTheme.semantic overrides win in dark mode', () => {
    const override = '#00ff00'
    const palette = resolvePalette({ mode: 'dark', semantic: { danger: override } })
    expect(palette.danger).toBe(override)
    expect(palette.background).toBe(semanticDark.color.background)
  })

  it('produces every semantic alias', () => {
    const palette = resolvePalette({ mode: 'light' })
    expect(Object.keys(palette).sort()).toEqual(Object.keys(semantic.color).sort())
  })
})
