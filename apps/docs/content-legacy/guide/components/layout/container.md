# Container

Centers and caps the width of page-level content.

## Import

```tsx
import { Container } from '@xerena/react'
```

## Usage

```tsx
<Container size="lg">
  <MainContent />
</Container>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'centered' \| 'fluid' \| 'narrow'` | `'centered'` | Width behavior. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'lg'` | Max width when centered: 640 / 768 / 1024 / 1280. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Page content. |

## Variants

- `centered` — fixed `maxWidth` per `size`, horizontally centered.
- `fluid` — full width (`100%`).
- `narrow` — centered at 720px, ignoring `size`.

## Motion

No runtime motion; a static wrapper.

## Accessibility

- A generic wrapper `div`; any semantic meaning comes from the children.

## See also

- [Stack](/guide/components/layout/stack)
- [Grid](/guide/components/layout/grid)