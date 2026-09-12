import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { XerenaLockup } from './lockup'

describe('XerenaLockup', () => {
  it('renders mark and wordmark together', () => {
    render(<XerenaLockup />)
    expect(screen.getByText('Xerena')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Xerena' })).toBeInTheDocument()
  })

  it('stacks vertically on request', () => {
    const { container } = render(<XerenaLockup variant="stacked" />)
    expect(container.querySelector('span')).toHaveStyle('flex-direction: column')
  })
})