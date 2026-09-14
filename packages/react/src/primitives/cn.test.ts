import { describe, it, expect } from 'vitest'
import { cn } from './cn'
describe('cn', () => {
  it('joins truthy parts and skips falsy', () => {
    expect(cn('a', false, 'b', null, undefined, '')).toBe('a b')
  })
})
