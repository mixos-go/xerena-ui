import { fireEvent, render, screen } from '@testing-library/react'
import { Preview } from './Preview'

test('renders children inside the preview surface', () => {
  render(<Preview title="Demo"><button type="button">Save</button></Preview>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('code panel is open by default and toggles', () => {
  const code = '<button type="button">Save</button>'
  render(<Preview title="Demo" code={code}><button type="button">Save</button></Preview>)
  expect(screen.getByText(code)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /hide code/i }))
  expect(screen.queryByText(code)).not.toBeInTheDocument()
})

test('respects showCode={false} initially', () => {
  const code = '<button type="button">Save</button>'
  render(<Preview title="Demo" code={code} showCode={false}><button type="button">Save</button></Preview>)
  expect(screen.queryByText(code)).not.toBeInTheDocument()
})

test('theme toggle is local to the preview', () => {
  render(
    <div data-testid="host">
      <Preview title="Demo" defaultMode="light"><button type="button">Save</button></Preview>
    </div>,
  )
  const host = screen.getByTestId('host')
  expect(host.querySelector('[data-xerena-theme="light"]')).not.toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /dark/i }))
  expect(host.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
  expect(host.querySelector('[data-xerena-theme="light"]')).toBeNull()
  expect(host.getAttribute('data-xerena-theme')).toBeNull()
})

test('starts in dark mode when defaultMode is dark', () => {
  render(<Preview title="Demo" defaultMode="dark"><button type="button">Save</button></Preview>)
  expect(document.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
})

test('renders an exact explicit code string verbatim', () => {
  const code = '<Button variant="primary" size="lg">Save</Button>'
  render(<Preview title="Demo" code={code}><button type="button">Save</button></Preview>)
  expect(screen.getByText(code).textContent).toBe(code)
})

test('works identically under prefers-reduced-motion (no animation dependency)', () => {
  window.matchMedia = ((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
  render(<Preview title="Demo"><button type="button">Save</button></Preview>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /dark/i }))
  expect(document.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
})
