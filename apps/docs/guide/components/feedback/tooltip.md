# Tooltip

Delay-triggered hover and focus label anchored to its child.

## Import

```tsx
import { Tooltip } from '@xerena/react'
```

## Usage

```tsx
<Tooltip content="Open settings" position="topCenter">
  <IconButton aria-label="Settings">&#9881;</IconButton>
</Tooltip>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | The anchor element. |
| `content` | `ReactNode` | required | Tooltip content. |
| `position` | `'topStart' \| 'topCenter' \| 'topEnd' \| 'bottomStart' \| 'bottomCenter' \| 'bottomEnd'` | `'topCenter'` | Preferred edge. |
| `delay` | `number` | `400` | Show delay in ms. |
| `className` | `string` | — | Extra class names. |

## Variants

- Six edge positions (top/bottom × start/center/end); the popover aligns to the anchor edge.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Show | appears via `delay` timer | — | — | show immediately |

No CSS transition; under reduced motion the tooltip opens immediately instead of waiting for `delay`.

## Accessibility

- The popover renders `role="tooltip"` with the string content as `aria-label`.
- Opens on hover and focus, closes on leave and blur.

## See also

- [Popover](/guide/components/feedback/popover)
- [Message](/guide/components/feedback/message)