import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('slides in from right by default', () => {
    render(<Drawer.Root open><Drawer.Content>Content</Drawer.Content></Drawer.Root>)
    expect(screen.getByText('Content')).toHaveClass('xr-drawer', 'xr-drawer--right')
  })
  it('toggles open when the trigger is clicked', async () => {
    render(<Drawer.Root><Drawer.Trigger><button>Open</button></Drawer.Trigger><Drawer.Content>Panel</Drawer.Content></Drawer.Root>)
    expect(screen.queryByText('Panel')).not.toBeInTheDocument()
    await userEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Panel')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Open'))
    expect(screen.queryByText('Panel')).not.toBeInTheDocument()
  })
  it('lets Content side override the root default', () => {
    render(<Drawer.Root open side="right"><Drawer.Content side="left">Left panel</Drawer.Content></Drawer.Root>)
    expect(screen.getByText('Left panel')).toHaveClass('xr-drawer--left')
  })
  it('applies a height for top and bottom sides', () => {
    const { rerender } = render(<Drawer.Root open side="top"><Drawer.Content side="top">Top</Drawer.Content></Drawer.Root>)
    expect(screen.getByText('Top').style.height).toBe('400px')
    expect(screen.getByText('Top').style.width).toBe('')
    rerender(<Drawer.Root open side="right"><Drawer.Content>Right</Drawer.Content></Drawer.Root>)
    expect(screen.getByText('Right').style.width).toBe('400px')
    expect(screen.getByText('Right').style.height).toBe('')
  })
})
