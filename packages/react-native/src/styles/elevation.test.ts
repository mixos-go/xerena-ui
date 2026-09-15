import { Platform } from 'react-native'
import { elevation } from '@xerena/tokens'
import { nativeElevation } from './elevation'

const setPlatform = (os: 'ios' | 'android') => {
  Object.defineProperty(Platform, 'OS', { value: os, configurable: true, writable: true })
}

describe('nativeElevation', () => {
  afterEach(() => {
    setPlatform('ios')
  })

  it('returns empty style for none', () => {
    setPlatform('ios')
    expect(nativeElevation('none')).toEqual({})
  })

  it('returns empty style for 0 none', () => {
    const original = elevation.xs
    Object.defineProperty(elevation, 'xs', { value: '0 none', configurable: true })
    setPlatform('ios')
    expect(nativeElevation('xs')).toEqual({})
    Object.defineProperty(elevation, 'xs', { value: original, configurable: true })
  })

  it('parses actual xs token on iOS using deepest blur layer', () => {
    setPlatform('ios')
    const style = nativeElevation('xs')
    expect(style.shadowColor).toBe('rgb(43, 38, 32)')
    expect(style.shadowOffset).toEqual({ width: 0, height: 2 })
    expect(style.shadowRadius).toBe(4)
    expect(style.shadowOpacity).toBe(0.04)
  })

  it('parses actual md token on iOS using deepest blur layer', () => {
    setPlatform('ios')
    const style = nativeElevation('md')
    expect(style.shadowColor).toBe('rgb(43, 38, 32)')
    expect(style.shadowOffset).toEqual({ width: 0, height: 10 })
    expect(style.shadowRadius).toBe(28)
    expect(style.shadowOpacity).toBe(0.1)
  })

  it('maps actual xs token to Android elevation', () => {
    setPlatform('android')
    const style = nativeElevation('xs')
    expect(style.elevation).toBe(1)
    expect(style.shadowColor).toBeUndefined()
  })

  it('maps actual lg token to Android elevation using deepest blur layer', () => {
    setPlatform('android')
    const style = nativeElevation('lg')
    expect(style.elevation).toBe(12)
    expect(style.shadowColor).toBeUndefined()
  })

  it('matches all token keys against parsed values', () => {
    setPlatform('ios')
    const keys = Object.keys(elevation) as Array<keyof typeof elevation>
    for (const key of keys) {
      const style = nativeElevation(key)
      if (elevation[key] === 'none') {
        expect(style).toEqual({})
      } else {
        expect(style.shadowColor).toBe('rgb(43, 38, 32)')
        expect(style.shadowOpacity).toBeGreaterThan(0)
        expect(style.shadowOpacity).toBeLessThanOrEqual(1)
      }
    }
  })
})
