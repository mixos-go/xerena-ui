import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menu } from './Menu'
describe('Menu', () => {
  it('renders menu with aria-haspopup', async () => {
    render(<Menu.Root><Menu.Trigger><button>Open</button></Menu.Trigger><Menu.Content><Menu.Item>Item 1</Menu.Item></Menu.Content></Menu.Root>)
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'menu')
  })
  it('opens on trigger click and focuses the first item', async () => {
    const user = userEvent.setup()
    render(<Menu.Root><Menu.Trigger><button>Open</button></Menu.Trigger><Menu.Content><Menu.Item>Item 1</Menu.Item><Menu.Item>Item 2</Menu.Item></Menu.Content></Menu.Root>)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const first = await screen.findByRole('menuitem', { name: 'Item 1' })
    expect(first).toHaveFocus()
  })
  it('navigates items with arrows and closes on Escape returning focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Menu.Root><Menu.Trigger><button>Open</button></Menu.Trigger><Menu.Content><Menu.Item>Item 1</Menu.Item><Menu.Item>Item 2</Menu.Item><Menu.Item>Item 3</Menu.Item></Menu.Content></Menu.Root>)
    const trigger = screen.getByRole('button', { name: 'Open' })
    await user.click(trigger)
    const first = await screen.findByRole('menuitem', { name: 'Item 1' })
    expect(first).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Item 2' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Item 3' })).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('menuitem', { name: 'Item 1' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('menuitem', { name: 'Item 3' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})