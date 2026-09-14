# ButtonGroup

Groups related buttons in a row or column with equal spacing.

## Import

```tsx
import { ButtonGroup } from '@xerena/react'
```

## Usage

```tsx
<ButtonGroup orientation="horizontal" spacing="sm">
  <Button size="sm">Day</Button>
  <Button size="sm" variant="outline">Week</Button>
  <Button size="sm" variant="outline">Month</Button>
</ButtonGroup>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Flex direction. |
| `spacing` | `keyof typeof spacing` (spacing tokens) | `'md'` | Gap between buttons in px. |
| `value` | `string` | — | Optional controlled group value. |
| `onValueChange` | `(v: string) => void` | — | Value change callback. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | The buttons to group. |

## Variants

- `horizontal` — row layout.
- `vertical` — column layout with stretched alignment.

## Motion

No runtime motion; a static flex container.

## Accessibility

- Renders `role="group"` to associate the buttons semantically.

## See also

- [Button](/guide/components/actions/button)
- [Stack](/guide/components/layout/stack)