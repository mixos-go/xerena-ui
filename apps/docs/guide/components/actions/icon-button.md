# IconButton

Square button that contains an icon instead of a text label.

## Import

```tsx
import { IconButton } from '@xerena/react'
```

## Usage

```tsx
<IconButton aria-label="Close" onClick={close}>
  &times;
</IconButton>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | required | Accessible name; there is no visible text label. |
| `variant` | `'primary' \| 'ghost' \| 'outline' \| 'soft' \| 'destructive' \| 'link'` | `'primary'` | Same treatments as [Button](/guide/components/actions/button). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size scale applied to the square footprint. |
| `loading` | `boolean` | `false` | Indicates busy state and disables. |
| `animated` | `boolean` | `false` | Add hover lift. |
| `disabled` | `boolean` | `false` | Disable interactions. |
| `asChild` | `boolean` | `false` | Merge styles onto a child element. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | The icon content. |

IconButton omits `leftIcon`, `rightIcon`, and `fullWidth` from Button's API and extends the rest.

## Variants

Same variant treatments as [Button](/guide/components/actions/button), applied to a fixed square footprint (`xr-iconbutton`).

## Motion

Identical to Button: hover lift and press scale use `fast` / `standard`; reduced fallback is none.

## Accessibility

- `aria-label` is required because there is no visible text.
- All other ARIA behavior (focus ring, disabled, busy) matches [Button](/guide/components/actions/button).

## See also

- [Button](/guide/components/actions/button)
- [ButtonGroup](/guide/components/actions/button-group)