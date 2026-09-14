# Breadcrumb

Hierarchy trail composed from the Breadcrumb container and its Item.

## Import

```tsx
import { Breadcrumb } from '@xerena/react'
```

## Usage

```tsx
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/guides">Guides</Breadcrumb.Item>
  <Breadcrumb.Item current>Components</Breadcrumb.Item>
</Breadcrumb>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Breadcrumb` | `children`, `className` | `nav aria-label="Breadcrumb"` with an ordered list. |
| `Breadcrumb.Item` | `href?`, `current?`, `children`, `separator?: string` | A trail entry with a separator. |

## Item props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Link destination. |
| `current` | `boolean` | — | Marks the current page (`aria-current="page"`). |
| `separator` | `'slash' \| 'chevron' \| 'dot' \| string` | `'slash'` | Trailing separator character. |
| `children` | `ReactNode` | required | The crumb label. |

## Variants

- Link crumb (`href`, primary underlined unless current).
- Current crumb (no separator, `aria-current="page"`, bold text).
- Custom `separator` characters: `/`, `›`, `·`, or any string.

## Motion

No runtime motion.

## Accessibility

- Renders `<nav aria-label="Breadcrumb">` wrapping a real `<ol>` / `<li>` structure.
- The current page uses `aria-current="page"`; separators are `aria-hidden`.

## See also

- [Link](/guide/components/actions/link)
- [Tabs](/guide/components/navigation/tabs)
- [Menu](/guide/components/navigation/menu)