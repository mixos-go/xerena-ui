import { spacing as tokens } from '@xerena/tokens'
import { spacing } from './spacing'

describe('spacing', () => {
  it('maps token spacing values verbatim', () => {
    expect(spacing[1]).toBe(tokens[1])
    expect(spacing[4]).toBe(tokens[4])
    expect(spacing[8]).toBe(tokens[8])
  })
})
