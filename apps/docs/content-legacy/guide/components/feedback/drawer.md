# Drawer

Side- or edge-mounted panel composed from Root + Trigger + Content.

::: tip React Native
Natively an `Overlay` (`Modal`) + slide animation per `side`. See [React Native](/guide/native).
:::

## Import

```tsx
import { Drawer } from '@xerena/react'
```

## Usage

```tsx
<Drawer.Root open={open} onClose={close} side="right" size="md">
  <Drawer.Content side="right">
    <h2>Filters</h2>
    <Button onClick={close}>Apply</Button>
  </Drawer.Content>
</Drawer.Root>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Drawer.Root` | `open?`, `onClose?`, `side?`, `size?`, `children` | Owns open state and configuration; default `side="right"`, `size="md"`. |
| `Drawer.Trigger` | `children` | Wrapper span; clicking it calls `onClose`. |
| `Drawer.Content` | `children`, `side?`, `className` | Fixed-position panel, `400px` default width, portal-backed with a focus trap. |

## Root props

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge the panel slides from. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Width for left/right (240 / 320 / 400 / 560) or full edge for top/bottom. |

## Variants

- Four edges; Content may override `side` independently.
- Four sizes for left/right drawers.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Open / close | transform (slide on the edge) | `moderate` | `enter` | none |

## Accessibility

- Content mounts in a portal with a focus trap; Escape or outside interaction calls `onClose`.
- Trigger is a `span`; prefer a real button child with keyboard semantics for activation.

## See also

- [Dialog](/guide/components/feedback/dialog)
- [Popover](/guide/components/feedback/popover)