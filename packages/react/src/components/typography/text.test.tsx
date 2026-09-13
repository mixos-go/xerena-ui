import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Text } from './Text'
describe('Text', () => {
  it('renders body variant', () => {
    render(<Text>hello</Text>)
    expect(screen.getByText('hello')).toHaveClass('xr-text', 'xr-text--body')
  })
  it('maps error variant to danger text color', () => {
    render(<Text variant="error">err</Text>)
    expect(screen.getByText('err')).toHaveClass('xr-text--error')
  })
  it('respects asChild', () => {
    render(<Text asChild><a href="#">link</a></Text>)
    expect(screen.getByText('link').tagName).toBe('A')
  })
})