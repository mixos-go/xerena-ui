# Pagination

Page navigation with a numbered range or a simple next-only variant.

::: tip React Native
`renderPagePreview` is removed natively (hover has no touch equivalent). See [React Native](/guide/native).
:::

## Import

```tsx
import { Pagination } from '@xerena/react'
```

## Usage

```tsx
<Pagination
  total={240}
  pageSize={20}
  current={page}
  onChange={setPage}
  siblingCount={1}
/>
<Pagination variant="simple" total={240} pageSize={20} current={page} onChange={setPage} />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `total` | `number` | required | Total row count. |
| `pageSize` | `number` | required | Rows per page. |
| `current` | `number` | required | Active page (1-based). |
| `onChange` | `(page: number) => void` | required | Page switch callback. |
| `siblingCount` | `number` | `1` | Pages shown around the current page. |
| `variant` | `'page' \| 'simple'` | `'page'` | Numbered range vs. "1 / N" with a next button. |
| `renderPagePreview` | `(page: number) => ReactNode` | — | Optional hover/focus preview popover content. |
| `className` | `string` | — | Extra class names. |

## Variants

- `page` — previous/next buttons plus a numbered range with ellipses and `aria-current="page"` on the active page.
- `simple` — "1 / N" readout with a next button.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Page hover / selection | background-color, color | `fast` | `standard` | none |

## Accessibility

- Renders `<nav aria-label="Pagination">` with labeled previous/next buttons and `aria-current="page"` for the active page.

## See also

- [Table](/guide/components/data/table)