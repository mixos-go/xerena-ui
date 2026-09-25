# InputGroup

Joins prefix, input, and suffix content into one bordered, radius-clipped unit.

## Import

```tsx
import { InputGroup } from '@xerena/react'
```

## Usage

```tsx
<InputGroup>
  <Input placeholder="Search" />
  <Button size="md" variant="primary">Go</Button>
</InputGroup>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | The grouped controls. |
| `className` | `string` | — | Extra class names. |

## Variants

Single appearance; child composition defines the layout (text + input, input + button, etc).

## Motion

No runtime motion; the group is a static container.

## Accessibility

- Renders a `div`; group the children with `aria-label` on an [Input](/guide/components/form/input) child or a wrapping Field label.

## See also

- [Input](/guide/components/form/input)
- [NumberInput](/guide/components/form/number-input)