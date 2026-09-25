# Kbd

Keyboard key cap for shortcut documentation.

## Import

```tsx
import { Kbd } from '@xerena/react'
```

## Usage

```tsx
<Kbd>⌘</Kbd><Kbd>K</Kbd>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Key label. |

## Variants

Single style with no variants.

## Motion

No runtime motion; key caps are static.

## Accessibility

- Renders a real `<kbd>` element; pair with explanatory text or a visible shortcut list for context.

## See also

- [Text](/guide/components/typography/text)