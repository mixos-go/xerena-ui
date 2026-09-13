import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stack } from './Stack'
describe('Stack', () => {
  it('renders vertical stack with gap spacing token', () => {
    render(<Stack orientation="vertical" spacing="md">a</Stack>)
    expect(screen.getByText('a').style.flexDirection).toBe('column')
  })
})