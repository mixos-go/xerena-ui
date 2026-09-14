import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, Message } from '@xerena/react'

const meta: Meta<typeof Message> = {
  title: 'Feedback/Message',
  component: Message,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Message>

export const Neutral: T = {
  args: { tone: 'neutral', title: 'Note', description: 'Something to keep in mind.' },
}
export const Info: T = { args: { tone: 'info', title: 'Heads up', description: 'A new version is available.' } }
export const Success: T = { args: { tone: 'success', title: 'Saved', description: 'Your changes were saved.' } }
export const Warning: T = { args: { tone: 'warning', title: 'Storage low', description: 'Only 10% of space remains.' } }
export const Danger: T = { args: { tone: 'danger', title: 'Upload failed', description: 'The file could not be uploaded.' } }
export const Dismissible: T = {
  render: () => {
    const [visible, setVisible] = useState(true)
    if (!visible) return <Button onClick={() => setVisible(true)}>Show message</Button>
    return (
      <Message
        tone="info"
        title="Dismissible"
        description="Close this message."
        dismissible
        onDismiss={() => setVisible(false)}
      />
    )
  },
}
export const Positions: T = {
  render: () => (
    <>
      <Message tone="neutral" position="top-left" title="Top left" description="Corner message" />
      <Message tone="info" position="top-center" title="Top center" description="Corner message" />
      <Message tone="success" position="top-right" title="Top right" description="Corner message" />
      <Message tone="warning" position="bottom-left" title="Bottom left" description="Corner message" />
      <Message tone="danger" position="bottom-center" title="Bottom center" description="Corner message" />
      <Message tone="neutral" position="bottom-right" title="Bottom right" description="Corner message" />
    </>
  ),
  parameters: { layout: 'fullscreen' },
}