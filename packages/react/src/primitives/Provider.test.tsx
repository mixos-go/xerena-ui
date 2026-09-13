import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Provider } from './Provider'

describe('Provider', () => {
  it('wraps children inside the theme surface', () => {
    render(
      <Provider theme={{ mode: 'light' }}>
        <span>content</span>
      </Provider>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders data-xerena-theme attribute', () => {
    render(<Provider theme={{ mode: 'light' }}>hi</Provider>)
    expect(document.querySelector('[data-xerena-theme="light"]')).not.toBeNull()
  })

  it('provides semantic override for dark mode', () => {
    render(<Provider theme={{ mode: 'dark' }}>x</Provider>)
    expect(document.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
  })
})
