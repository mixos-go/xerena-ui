import { render, screen } from '@testing-library/react'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('slides in from right by default', () => {
    render(<Drawer.Root open><Drawer.Content>Content</Drawer.Content></Drawer.Root>)
    expect(screen.getByText('Content')).toHaveClass('xr-drawer', 'xr-drawer--right')
  })
})