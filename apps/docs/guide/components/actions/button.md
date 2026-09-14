# Button

Primary interactive action control.

## Import

```tsx
import { Button } from '@xerena/react'
```

## Usage

```tsx
<Button variant="primary" size="md" onClick={save}>
  Save
</Button>
<Button loading>Saving&hellip;</Button>
<Button variant="ghost" leftIcon={<span aria-hidden="true">&#8592;</span>}>Back</Button>
```

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'ghost' \| 'outline' \| 'soft' \| 'destructive' \| 'link'` | `'primary'` | Visual treatment. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and text scale. |
| `loading` | `boolean` | `false` | Sets `aria-busy` and disables the button. |
| `animated` | `boolean` | `false` | Add hover lift via transform. |
| `fullWidth` | `boolean` | `false` | Stretch to the container width. |
| `disabled` | `boolean` | `false` | Disable interactions. |
| `leftIcon` | `ReactNode` | — | Leading icon slot. |
| `rightIcon` | `ReactNode` | — | Trailing icon slot. |
| `asChild` | `boolean` | `false` | Merge the button styles onto a child element. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type. |
| `className` | `string` | — | Extra class names. |
| `children` | `ReactNode` | required | Button label. |

## Variants

- `primary` — filled with `--xr-semantic-color-primary`, `textOnStrong` text.
- `soft` — filled with the primary color (no border).
- `ghost` / `outline` — transparent background with `primary` text.
- `link` — transparent background with `primary` underlined text.
- `destructive` — filled with `--xr-semantic-color-danger`, `textOnStrong` text.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Hover (animated) | transform: translateY(-1px) | `fast` | `standard` | none |
| Press / active | transform: scale(0.98) | `fast` | `standard` | none |
| Background / color | background-color, color | `fast` | `standard` | none |
| Focus-visible | box-shadow focus ring | `fast` | `standard` | keep (essential focus cue) |

## Accessibility

- Native `button` semantics; `loading` renders `aria-busy` and disables the control.
- Focus is always visible via a 3px primary ring (`:focus-visible`).
- With `asChild`, the merged child must be a valid interactive element (e.g. a router link).

## See also

- [IconButton](/guide/components/actions/icon-button)
- [Link](/guide/components/actions/link)
- [ButtonGroup](/guide/components/actions/button-group)