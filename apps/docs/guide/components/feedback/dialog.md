# Dialog

Modal dialog composed from Root + Portal + Content + Close + Title + Description.

## Import

```tsx
import { Dialog } from '@xerena/react'
```

## Usage

```tsx
const [open, setOpen] = useState(false)

<>
  <Button onClick={() => setOpen(true)}>Open</Button>
  <Dialog.Root open={open} onClose={() => setOpen(false)}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Title>Confirm action</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Button variant="destructive" onClick={() => setOpen(false)}>Confirm</Button>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</>
```

## Composition

| Component | Props | Description |
|---|---|---|
| `Dialog.Root` | `open?: boolean`, `onClose?: () => void`, `children` | Owns open state (uncontrolled) and provides close. |
| `Dialog.Portal` | `children` | Renders into `document.body` via `OverlayPrimitive` with a focus trap. |
| `Dialog.Overlay` | — | No-op placeholder (`null`). |
| `Dialog.Content` | `children`, `className` | `role="dialog"` `aria-modal="true"`, centered, elevated surface. |
| `Dialog.Close` | `children` (default `'✕'`), `className` | Close button (`aria-label="Close"`). |
| `Dialog.Title` | `id?: string`, `children` | Dialog title heading. |
| `Dialog.Description` | `id?: string`, `children` | Muted description paragraph. |

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `Root.open` | `boolean` | — | Controlled open state. |
| `Root.onClose` | `() => void` | `() => {}` | Close callback (dismiss, escape, overlay). |

## Variants

- Controlled (`open`) or uncontrolled (Root's internal state).
- Long content scrolls inside the fixed centered panel.

## Motion

| Event | Property | Duration | Easing | Reduced fallback |
|---|---|---|---|---|
| Mount / close | none (panel renders in place) | — | — | — |

The Dialog component itself applies no transition; content mounts and unmounts with the portal.

## Accessibility

- `role="dialog"` with `aria-modal="true"`; a `focusTrap` recycles focus inside the portal while open.
- Dismiss, Escape, and the close button all call `onClose`.
- Provide a `<Dialog.Title id>` and reference it for labelling in a full ARIA wiring.

## See also

- [Drawer](/guide/components/feedback/drawer)
- [Popover](/guide/components/feedback/popover)