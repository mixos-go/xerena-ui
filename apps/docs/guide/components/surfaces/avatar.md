# Avatar

User identity glyph: image, initials, or icon in a square or circle.

## Import

```tsx
import { Avatar } from '@xerena/react'
```

## Usage

```tsx
<Avatar variant="image" src="user.png" alt="Ada Lovelace" />
<Avatar variant="initials" initials="AL" size="lg" />
<Avatar variant="icon" icon={<IconUser />} onClick={openProfile} />
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'image' \| 'initials' \| 'icon'` | `'initials'` | Content type. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Footprint (28 / 40 / 56 / 80). |
| `shape` | `'square' \| 'circle'` | `'circle'` | Corner shape. |
| `src` | `string` | — | Image source (for `image`). |
| `alt` | `string` | — | Image / button accessible name. |
| `initials` | `string` | — | Initials; first two letters are uppercased. |
| `icon` | `ReactNode` | — | Icon content (for `icon`). |
| `onClick` | `() => void` | — | Makes the avatar a button. |
| `className` | `string` | — | Extra class names. |

## Variants

- `image` — `src` rendered as a cover image.
- `initials` — first two characters of `initials`, uppercased.
- `icon` — arbitrary icon node; on `onClick` the avatar becomes a focusable button.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Hover (when clickable) | box-shadow | `fast` | `standard` | none |

## Accessibility

- With `onClick`, renders `role="button"` and `tabIndex=0`; `alt` becomes the button label.
- For `image`, keep `alt` descriptive (or empty for decorative avatars).

## See also

- [Card](/guide/components/surfaces/card)
- [Badge](/guide/components/typography/badge)