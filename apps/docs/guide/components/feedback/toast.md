# Toast

Imperative toast notification with an imperative `toast()` trigger and an auto-dismiss `Toast`.

::: tip React Native
Natively a modal stack + auto-dismiss timer; `position` is accepted but unused. See [React Native](/guide/native).
:::

## Import

```tsx
import { Toast, toast } from '@xerena/react'
```

## Usage

```tsx
toast({
  variant: 'success',
  title: 'Saved',
  description: 'Your changes are live.',
  autoHideDuration: 4000,
})

<Toast variant="danger" title="Failed" description="Try again." dismissible />
```

## API

`toast(options)` and `<Toast>` share the `ToastOptions` interface.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Tone. |
| `title` | `string` | — | Title line. |
| `description` | `string` | — | Muted description line. |
| `action` | `{ label: string; onClick: () => void }` | — | Inline action button. |
| `dismissible` | `boolean` | — | Show a close button. |
| `onDismiss` | `() => void` | — | Close callback. |
| `autoHideDuration` | `number` | `5000` | Auto-dismiss delay in ms; omit for the `toast()` stack to persist. |
| `position` | one of the six Message positions | — | Declared for placement; the current implementation renders the stack fixed bottom-right. |
| `className` | `string` | — | Extra class names. |

## Variants

- Imperative: `toast(options)` mounts a `Toast` in a stacked portal under `#xerena-toast-stack`.
- Declarative: render `<Toast />` directly.
- Tones: `success`, `danger`, `warning`, `info`, `neutral`.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Toast enter | `xr-toast-in` (translateY + fade) | `moderate` | `enter` | none |
| Exit / hover-resist | transform, opacity | `moderate` | `exit` | none |

## Accessibility

- `danger` toasts render `role="alert"`; all others render `role="status"`.
- Action and dismiss buttons are real buttons with accessible labels.

## See also

- [Message](/guide/components/feedback/message)