'use client'

import { Accordion } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Accordion.Root type="single" defaultValue={['faq']}>
  <Accordion.Item value="faq">
    <Accordion.Header>
      <Accordion.Trigger value="faq">Frequently asked</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content value="faq">Answers live here.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="shipping">
    <Accordion.Header>
      <Accordion.Trigger value="shipping">Shipping</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content value="shipping">Ships in 2 days.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>`

export function AccordionDemo() {
  return (
    <Preview title="Expandable sections" code={code}>
      <Accordion.Root type="single" defaultValue={['faq']}>
        <Accordion.Item value="faq">
          <Accordion.Header>
            <Accordion.Trigger value="faq">Frequently asked</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="faq">Answers live here.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="shipping">
          <Accordion.Header>
            <Accordion.Trigger value="shipping">Shipping</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content value="shipping">Ships in 2 days.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Preview>
  )
}
