# Message

Fixed-position alert banner with a tone, title, description, icon, and optional dismiss.

## Import

```tsx
import { Message } from '@xerena/react'
```

## Usage

```tsx
<Message
  position="top-right"
  tone="success"
  title="Saved"
  description="Your changes are live."
  dismissible
  onDismiss={close}
/>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Color treatment and default icon. |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-center'` | Fixed viewport corner. |
| `title` | `string` | — | Bold title line. |
| `description` | `string` | — | Muted description line. |
| `icon` | `ReactNode` | — | Overrides the tone default icon. |
| `dismissible` | `boolean` | `false` | Show a close button. |
| `onDismiss` | `() => void` | — | Close callback. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | — | Extra content in the body. |

## Variants

- `neutral` / `info` / `success` / `warning` / `danger` tones, each with a default icon (✓, ℹ, ⚠, ✕).
- Six viewport positions.
- Dismissible vs. persistent.

## Motion

No runtime motion; the message mounts in place.

## Accessibility

- Renders `role="alert"` so the content is announced when it appears.
- The close button has `aria-label="Dismiss"`.

## See also

- [Toast](/guide/components/feedback/toast)