# Stack

One-directional flex container spaced by design tokens.

## Import

```tsx
import { Stack } from '@xerena/react'
```

## Usage

```tsx
<Stack orientation="horizontal" spacing="md" alignItems="center">
  <Button>Save</Button>
  <Button variant="ghost">Cancel</Button>
</Stack>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical' \| 'inline'` | `'vertical'` | Flex direction. |
| `spacing` | `keyof typeof spacing` (spacing tokens) | `'md'` | Gap between children in px. |
| `alignItems` | `CSSProperties['alignItems']` | — | Cross-axis alignment. |
| `justifyContent` | `CSSProperties['justifyContent']` | — | Main-axis distribution. |
| `wrap` | `boolean` | `false` | Allow children to wrap. |
| `as` | `ElementType` | `'div'` | Rendered element. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Stacked content. |

## Variants

- `vertical` — column direction.
- `horizontal` / `inline` — row direction; `inline` is the semantic alias for horizontal stacking.

## Motion

No runtime motion; a static layout container.

## Accessibility

- Renders a `div` (or the element from `as`); order and grouping come from the children.

## See also

- [Container](/guide/components/layout/container)
- [Grid](/guide/components/layout/grid)
- [ButtonGroup](/guide/components/actions/button-group)