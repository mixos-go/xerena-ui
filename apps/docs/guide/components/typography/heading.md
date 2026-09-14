# Heading

Display-scale headings from h1 through h6.

## Import

```tsx
import { Heading } from '@xerena/react'
```

## Usage

```tsx
<Heading as="h1">Page title</Heading>
<Heading as="h2">Section title</Heading>
<Heading as="h3">Subsection</Heading>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h2'` | Rendered heading level. |
| `asChild` | `boolean` | `false` | Merge the styles onto a single child element. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | The heading content. |

## Variants

The level maps to the display type scale: `h1` → `display-xl`, `h2` → `display-lg`, `h3` → `display-md`, `h4` → `display-sm`, `h5` → `display-xs`, and `h6` → `display-xs` at weight 600.

## Motion

No runtime motion; headings are static.

## Accessibility

- Renders a real `h1`–`h6` element by default, preserving the document outline.
- With `asChild`, apply the heading style to an existing child; keep one `h1` per page as usual.

## See also

- [Text](/guide/components/typography/text)
- [Badge](/guide/components/typography/badge)