import type { Meta, StoryObj } from '@storybook/react'
import { Button, Stack, toast } from '@xerena/react'

const meta: Meta<typeof Button> = {
  title: 'Feedback/Toast',
  component: Button,
  tags: ['autodocs'],
}

export default meta
type T = StoryObj<typeof Button>

const Trigger = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button onClick={onClick}>{label}</Button>
)

export const Success: T = {
  render: () => (
    <Trigger
      label="Show success toast"
      onClick={() => toast({ variant: 'success', title: 'Saved', description: 'Your changes were saved.' })}
    />
  ),
}
export const Danger: T = {
  render: () => (
    <Trigger
      label="Show danger toast"
      onClick={() => toast({ variant: 'danger', title: 'Error', description: 'Something went wrong.' })}
    />
  ),
}
export const Warning: T = {
  render: () => (
    <Trigger
      label="Show warning toast"
      onClick={() => toast({ variant: 'warning', title: 'Careful', description: 'This cannot be undone.' })}
    />
  ),
}
export const Info: T = {
  render: () => (
    <Trigger
      label="Show info toast"
      onClick={() => toast({ variant: 'info', title: 'Update available', description: 'Reload to apply changes.' })}
    />
  ),
}
export const Neutral: T = {
  render: () => (
    <Trigger
      label="Show neutral toast"
      onClick={() => toast({ variant: 'neutral', title: 'Note', description: 'Just so you know.' })}
    />
  ),
}
export const WithAction: T = {
  render: () => (
    <Trigger
      label="Show toast with action"
      onClick={() =>
        toast({
          variant: 'info',
          title: 'Item deleted',
          description: 'You can undo this action.',
          action: { label: 'Undo', onClick: () => undefined },
        })
      }
    />
  ),
}
export const Dismissible: T = {
  render: () => (
    <Trigger
      label="Show dismissible toast"
      onClick={() => toast({ variant: 'success', title: 'Dismissible', description: 'Close me.', dismissible: true })}
    />
  ),
}
export const Variants: T = {
  render: () => (
    <Stack orientation="horizontal" spacing="sm" wrap>
      {(['success', 'danger', 'warning', 'info', 'neutral'] as const).map((variant) => (
        <Button key={variant} variant="outline" onClick={() => toast({ variant, title: variant })}>
          {variant}
        </Button>
      ))}
    </Stack>
  ),
}