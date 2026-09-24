# Table

Data table built from Root + subcomponents, with variants, frozen headers, selection, and expandable rows.

::: tip React Native
Natively a View-based grid (no real table); `frozenHeader` uses `stickyHeaderIndices`. See [React Native](/guide/native).
:::

## Import

```tsx
import {
  Table, Head, Body, Row, Cell, RowActions, TableCheckbox, useTableSelection,
} from '@xerena/react'
```

## Usage

```tsx
<Table variant="striped" size="md">
  <Head>
    <Row>
      <Cell as="th">Name</Cell>
      <Cell as="th">Status</Cell>
    </Row>
  </Head>
  <Body>
    {rows.map((r) => (
      <Row key={r.id}>
        <Cell>{r.name}</Cell>
        <Cell>{r.status}</Cell>
      </Row>
    ))}
  </Body>
</Table>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Table` | `variant`, `size`, `frozenHeader`, `maxHeight`, `className`, `children` | Root; provides the variant/size context and optional scroll area. |
| `Head` | `children`, `className` | `thead`; becomes sticky when the root has `frozenHeader`. |
| `Body` | `children`, `className` | `tbody`. |
| `Row` | `expandable?`, `expandContent?`, `className`, `children` | `tr`; when expandable, renders a toggle cell and an expanding detail row. |
| `Cell` | `as?: 'td' \| 'th'`, td props, `className` | `td` (or `th` with `scope="col"` when `as="th"`). |
| `RowActions` | `children`, `actionsPosition?: 'left' \| 'right'`, `sticky?`, `className` | Action cell; optionally sticky to the right edge. |
| `TableCheckbox` | `checked: boolean \| 'indeterminate'`, `onCheckedChange`, `ariaLabel?`, `className` | Selection checkbox with mixed state support. |
| `useTableSelection` | `controlledIds?: string[]` | Returns `{ selected, toggle, isAllSelected, isIndeterminate }`. |

## Table props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'striped' \| 'outlined' \| 'grid' \| 'hover'` | `'outlined'` | Border / row treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Cell padding. |
| `frozenHeader` | `boolean` | `false` | Pin the header while scrolling. |
| `maxHeight` | `number \| string` | — | Constrains the scroll area height. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | `Head` and `Body`. |

## Variants

- `outlined` — outer border with row separators.
- `striped` — zebra striping on even rows.
- `grid` — full inner and outer grid lines.
- `hover` — row highlight on hover.
- Frozen header with `maxHeight` for scrollable tables.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Expand a row | transform (chevron rotate) | `fast` | `standard` | none |
| Row hover (hover variant) | background-color | `fast` | `standard` | none |

## Accessibility

- Real `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` elements with `scope="col"` on header cells; rows expose `role="row"`.
- `TableCheckbox` sets the native `indeterminate` flag for mixed selection and `aria-checked="mixed"`.
- Expandable rows toggle `aria-expanded` on the row.

## See also

- [Pagination](/guide/components/data/pagination)
- [Checkbox](/guide/components/form/checkbox)