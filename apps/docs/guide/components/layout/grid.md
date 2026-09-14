# Grid

CSS grid with explicit 12-column presets or auto-fit columns.

## Import

```tsx
import { Grid } from '@xerena/react'
```

## Usage

```tsx
<Grid columns={3} gap="md">
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
</Grid>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12` | — | Fixed column count (`repeat(n, minmax(0,1fr))`). |
| `gap` | `keyof typeof spacing` (spacing tokens) | `'md'` | Gap between cells in px. |
| `auto` | `boolean` | `false` | Auto-fit columns (`repeat(auto-fit, minmax(0,1fr))`). |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Grid cells. |

## Variants

- Explicit columns, `1`–`12`.
- `auto` — columns size themselves to available space and wrap responsively.

## Motion

No runtime motion; a static grid container.

## Accessibility

- A generic wrapper `div`; represent tabular data with [Table](/guide/components/data/table) instead.

## See also

- [Container](/guide/components/layout/container)
- [Stack](/guide/components/layout/stack)
- [Table](/guide/components/data/table)