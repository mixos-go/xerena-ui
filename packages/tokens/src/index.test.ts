import { describe, expect, it } from 'vitest'
import { colors, darkColors, spacing, semantic, typography, elevation, radius, motion } from './index'

describe('color', () => {
  it('exposes the ember ramp', () => {
    expect(colors.ember[600]).toBe('#c04e1d')
    expect(colors.ember[50]).toBe('#fdf1e9')
  })

  it('exposes the sand ramp', () => {
    expect(colors.sand[50]).toBe('#faf7f2')
    expect(colors.sand[900]).toBe('#2b2620')
  })
})

describe('spacing', () => {
  it('exposes the spacing scale', () => {
    expect(spacing[4]).toBe(16)
  })
})

describe('typography', () => {
  it('exposes font family tokens', () => {
    expect(typography.fontFamily.display).toBe('Fraunces, Georgia, serif')
    expect(typography.fontFamily.body).toContain('Instrument Sans')
    expect(typography.fontFamily.mono).toContain('Geist Mono')
  })

  it('exposes the display scale', () => {
    expect(typography.display.xl.fontSize).toBe(60)
    expect(typography.display.xs.lineHeight).toBe(32)
  })
})

describe('elevation', () => {
  it('exposes the borderless shadow scale', () => {
    expect(elevation.none).toBe('none')
    expect(elevation.md).toContain('rgba(43,38,32,0.08)')
    expect(elevation.raised).toBe(elevation.md)
    expect(elevation.overlay).toBe(elevation.lg)
  })
})

describe('radius', () => {
  it('exposes the radius scale including large card sizes', () => {
    expect(radius.none).toBe(0)
    expect(radius['2xl']).toBe(28)
    expect(radius['4xl']).toBe(44)
    expect(radius.full).toBe(9999)
  })
})

describe('semantic', () => {
  it('resolves semantic aliases to primitives', () => {
    expect(semantic.color.primary).toBe(colors.ember[600])
    expect(semantic.color.primaryHover).toBe(colors.ember[700])
    expect(semantic.color.background).toBe(colors.sand[50])
    expect(semantic.spacing.md).toBe(spacing[4])
  })
})

describe('motion', () => {
  it('exposes the duration scale', () => {
    expect(motion.duration.instant).toBe(1)
    expect(motion.duration.base).toBe(150)
    expect(motion.duration.emphatic).toBe(600)
  })

  it('exposes the easing curves as control-point tuples', () => {
    expect(motion.easing.standard).toEqual([0.2, 0, 0, 1])
    expect(motion.easing.enter).toEqual([0.05, 0.7, 0.1, 1])
    expect(motion.easing.exit).toEqual([0.3, 0, 0.8, 0.15])
    expect(motion.easing.emphasis).toEqual([0.34, 1.3, 0.64, 1])
  })

  it('covers exactly the spec keys', () => {
    expect(Object.keys(motion.duration).sort()).toEqual(['base', 'emphatic', 'fast', 'instant', 'long', 'moderate'])
    expect(Object.keys(motion.easing).sort()).toEqual(['emphasis', 'enter', 'exit', 'standard'])
  })
})

describe('status colors', () => {
  it('exposes accessible status ramps', () => {
    expect(colors.success[600]).toBeDefined()
    expect(colors.warning[600]).toBeDefined()
    expect(colors.danger[600]).toBeDefined()
    expect(colors.info[600]).toBeDefined()
    expect(colors.success[50]).toBe('#eaf7ee')
    expect(colors.danger[600]).toBe('#c0392b')
  })
})

describe('darkColors', () => {
  it('exposes dark-tuned ember and sand ramps', () => {
    expect(darkColors.ember[900]).toBe('#f2b795')
    expect(darkColors.sand[900]).toBe('#f0ece3')
    expect(darkColors.sand[50]).toBe('#1b1712')
  })
})
