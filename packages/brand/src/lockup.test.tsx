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

  it('uses the dark ink text color by default', () => {
    const { container } = render(<XerenaLockup />)
    expect(container.querySelector('span')).toHaveStyle('color: rgb(43, 38, 32)')
  })

  it('surfaces the onDark tone on the wordmark via inheritance', () => {
    const { container } = render(<XerenaLockup tone="onDark" />)
    const spans = container.querySelectorAll('span')
    expect(spans[0]).toHaveStyle('color: rgb(250, 247, 242)')
    expect(spans[1]).toHaveStyle('color: inherit')
  })
})