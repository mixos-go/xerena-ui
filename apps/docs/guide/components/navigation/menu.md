# Menu

Dropdown menu composed from Root + Trigger + Content + Item + Separator + Label.

::: tip React Native
Natively an anchored modal list via `ListOverlay`. See [React Native](/guide/native).
:::

## Import

```tsx
import { Menu } from '@xerena/react'
```

## Usage

```tsx
<Menu.Root>
  <Menu.Trigger>
    <Button variant="outline">Account</Button>
  </Menu.Trigger>
  <Menu.Content>
    <Menu.Label>Account</Menu.Label>
    <Menu.Item onClick={goProfile}>Profile</Menu.Item>
    <Menu.Item onClick={goBilling}>Billing</Menu.Item>
    <Menu.Separator />
    <Menu.Item onClick={signOut}>Sign out</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Menu.Root` | `children` | Owns open state. |
| `Menu.Trigger` | `children` | Slot trigger; `aria-haspopup="menu"` + `aria-expanded`, toggles on click. |
| `Menu.Content` | `children`, `className` | `role="menu"` panel; portal-backed, closes on outside interaction. |
| `Menu.Item` | `children`, `onClick?`, `disabled?`, `className` | `role="menuitem"` entry. |
| `Menu.Separator` | — | `role="separator"` rule. |
| `Menu.Label` | `children` | Section label. |

## Variants

- Items with optional `disabled` (dimmed, non-interactive).
- Label + separator grouping.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Open | `xr-menu-in` (fade + scale) | `fast` | `enter` | none |
| Item hover | background-color | `instant` | — | none |

`useReducedMotionSync` removes the open animation under reduced motion.

## Accessibility

- `role="menu"` with `menuitem` children; trigger exposes `aria-haspopup` and `aria-expanded`.
- Escape and outside click close the menu; disabled items are non-interactive (no `onClick`).

## See also

- [Popover](/guide/components/feedback/popover)
- [Tabs](/guide/components/navigation/tabs)
- [Breadcrumb](/guide/components/navigation/breadcrumb)