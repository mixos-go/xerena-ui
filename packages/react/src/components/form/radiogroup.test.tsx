import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RadioGroup } from './RadioGroup'
import { Radio } from './Radio'
describe('RadioGroup', () => {
  it('groups radios and applies role radiogroup', () => {
    render(<RadioGroup value="a" onValueChange={() => {}}>
      <Radio value="a">A</Radio><Radio value="b">B</Radio>
    </RadioGroup>)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })
})