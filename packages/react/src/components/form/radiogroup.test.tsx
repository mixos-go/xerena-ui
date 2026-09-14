import { describe, it, expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from './RadioGroup'
import { Radio } from './Radio'
describe('RadioGroup', () => {
  it('groups radios and applies role radiogroup', () => {
    render(<RadioGroup value="a" onValueChange={() => {}}>
      <Radio value="a">A</Radio><Radio value="b">B</Radio>
    </RadioGroup>)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })
  it('keeps the checked radio as the single tab stop', () => {
    render(<RadioGroup value="a"><Radio value="a">A</Radio><Radio value="b">B</Radio></RadioGroup>)
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('tabindex', '-1')
  })
  it('selects the next radio with arrow keys', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<RadioGroup value="a" onValueChange={onValueChange} orientation="horizontal">
      <Radio value="a">A</Radio><Radio value="b">B</Radio><Radio value="c">C</Radio>
    </RadioGroup>)
    const a = screen.getByRole('radio', { name: 'A' })
    act(() => { a.focus() })
    await user.keyboard('{ArrowRight}')
    expect(onValueChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(onValueChange).toHaveBeenCalledWith('c')
    await user.keyboard('{ArrowLeft}')
    expect(onValueChange).toHaveBeenCalledWith('b')
    await user.keyboard('{Home}')
    expect(onValueChange).toHaveBeenCalledWith('a')
    await user.keyboard('{End}')
    expect(onValueChange).toHaveBeenCalledWith('c')
  })
})
