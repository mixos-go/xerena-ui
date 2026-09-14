# ButtonGroup

Groups related buttons in a row or column with equal spacing.

## Import

```tsx
import { ButtonGroup } from '@xerena/react'
```

## Usage

```tsx
<ButtonGroup orientation="horizontal" spacing="sm" value={range} onValueChange={setRange}>
  <Button size="sm" value="day">Day</Button>
  <Button size="sm" variant="outline" value="week">Week</Button>
  <Button size="sm" variant="outline" value="month">Month</Button>
</ButtonGroup>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Flex direction. |
| `spacing` | `keyof typeof spacing` (spacing tokens) | `'md'` | Gap between buttons in px. |
| `value` | `string` | — | Controlled selection value; the matching child Button becomes selected. |
| `onValueChange` | `(v: string) => void` | — | Selection callback. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | The buttons to group. |

## Variants

- `horizontal` — row layout.
- `vertical` — column layout with stretched alignment.

## Motion

No runtime motion; a static flex container.

## Accessibility

- Renders `role="group"` to associate the buttons semantically.
- Child Buttons with a `value` participate in selection: the selected one gets `aria-pressed="true"` and the `xr-button--selected` class.

## See also

- [Button](/guide/components/actions/button)
- [Stack](/guide/components/layout/stack)