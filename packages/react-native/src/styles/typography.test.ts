import { typography as tokens } from '@xerena/tokens'
import { body, display, mono } from './typography'

describe('typography', () => {
  it('maps display sizes with display font family', () => {
    expect(display.md.fontFamily).toBe(tokens.fontFamily.display)
    expect(display.md.fontSize).toBe(tokens.display.md.fontSize)
    expect(display.md.lineHeight).toBe(tokens.display.md.lineHeight)
    expect(display.md.fontWeight).toBe(tokens.display.md.fontWeight)
    expect(display.md.letterSpacing).toBe(tokens.display.md.letterSpacing)
  })

  it('maps body sizes with body font family', () => {
    expect(body.md.fontFamily).toBe(tokens.fontFamily.body)
    expect(body.md.fontSize).toBe(tokens.body.md.fontSize)
  })

  it('maps mono sizes with mono font family', () => {
    expect(mono.md.fontFamily).toBe(tokens.fontFamily.mono)
    expect(mono.md.fontSize).toBe(tokens.mono.md.fontSize)
  })
})
