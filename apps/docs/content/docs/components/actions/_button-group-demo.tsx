'use client'

import { Button, ButtonGroup } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<ButtonGroup orientation="horizontal" spacing="sm">
  <Button size="sm" value="day">Day</Button>
  <Button size="sm" variant="outline" value="week">Week</Button>
  <Button size="sm" variant="outline" value="month">Month</Button>
</ButtonGroup>`

export function ButtonGroupDemo() {
  return (
    <Preview title="Grouped buttons" code={code}>
      <ButtonGroup orientation="horizontal" spacing="sm">
        <Button size="sm" value="day">
          Day
        </Button>
        <Button size="sm" variant="outline" value="week">
          Week
        </Button>
        <Button size="sm" variant="outline" value="month">
          Month
        </Button>
      </ButtonGroup>
    </Preview>
  )
}
