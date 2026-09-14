import { render, screen } from '@testing-library/react'
import { OverlayPrimitive } from './OverlayPrimitive'
import { Provider } from './Provider'

describe('OverlayPrimitive', () => {
  it('portals children into body when open and removes on close', () => {
    const { rerender } = render(
      <OverlayPrimitive open onClose={() => {}}>
        <div>overlay</div>
      </OverlayPrimitive>,
    )
    expect(screen.getByText('overlay')).toBeInTheDocument()
    rerender(
      <OverlayPrimitive open={false} onClose={() => {}}>
        <div>overlay</div>
      </OverlayPrimitive>,
    )
    expect(screen.queryByText('overlay')).not.toBeInTheDocument()
  })
  it('calls onClose on Escape', () => {
    const close = vi.fn()
    render(
      <OverlayPrimitive open onClose={close}>
        <div>o</div>
      </OverlayPrimitive>,
    )
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(close).toHaveBeenCalled()
  })
  it('defaults to light theme outside a Provider', () => {
    render(
      <OverlayPrimitive open onClose={() => {}}>
        <div>o</div>
      </OverlayPrimitive>,
    )
    expect(document.querySelector('[data-xerena-overlay]')).toHaveAttribute('data-xerena-theme', 'light')
  })
  it('inherits the Provider theme mode on the portal wrapper', () => {
    render(
      <Provider theme={{ mode: 'dark' }}>
        <OverlayPrimitive open onClose={() => {}}>
          <div>o</div>
        </OverlayPrimitive>
      </Provider>,
    )
    expect(document.querySelector('[data-xerena-overlay]')).toHaveAttribute('data-xerena-theme', 'dark')
  })
})
