import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { XerenaWordmark } from './wordmark'

describe('XerenaWordmark', () => {
  it('renders the brand name', () => {
    render(<XerenaWordmark />)
    expect(screen.getByText('Xerena')).toBeInTheDocument()
  })

  it('applies the display font family', () => {
    const { container } = render(<XerenaWordmark />)
    expect(container.querySelector('span')).toHaveStyle('font-family: Fraunces, Georgia, serif')
  })
})