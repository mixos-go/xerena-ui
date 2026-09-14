import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Menu } from './Menu'
describe('Menu', () => {
  it('renders menu with aria-haspopup', async () => {
    render(<Menu.Root><Menu.Trigger><button>Open</button></Menu.Trigger><Menu.Content><Menu.Item>Item 1</Menu.Item></Menu.Content></Menu.Root>)
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'menu')
  })
})