# React Native (`@xerena/native`)

`@xerena/native` is the React Native implementation of the Xerena design
system: all 42 web components re-implemented with React Native primitives +
`StyleSheet`, consuming raw token values from `@xerena/tokens` directly.

## Install

```bash
pnpm add @xerena/tokens @xerena/native
```

Peer dependencies: `react ^19`, `react-native ^0.78`.

**Dependency rule:** `@xerena/native` has zero runtime dependencies beyond
`@xerena/tokens`. It must never import `@xerena/react` or `@xerena/styling`
(styling is web-only: CSS variables, cubic-bezier strings, DOM hooks). This is
enforced by the native ESLint `no-restricted-imports` rule.

## Quick start

```tsx
import { Provider, Button, Text } from '@xerena/native'

export function App() {
  return (
    <Provider theme={{ mode: 'light' }}>
      <Text variant="strong">Welcome</Text>
      <Button variant="primary" onPress={() => undefined}>
        Get started
      </Button>
    </Provider>
  )
}
```

`theme` is **required**. See [Theming](#theming) for the full contract.

## Component matrix

All 42 components, grouped by the same 9 categories as the web guide.
`Component` links to the web API page where the shared API is documented;
`Native approach` describes the RN implementation; `Notes` calls out
native-only behavior.

### Actions (4)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| [Button](/guide/components/actions/button) | `variant`, `size`, `loading`, `animated`, `fullWidth`, `disabled`, `leftIcon`/`rightIcon`, `onPress` | `Pressable` + `Text`; sizes via token maps | No `asChild`; `loading` → `accessibilityState.busy` |
| [IconButton](/guide/components/actions/icon-button) | `Button` minus icons; `accessibilityLabel` | `Pressable`, fixed square hit target | No `asChild`; label required for a11y |
| [Link](/guide/components/actions/link) | `variant`, `href`, `children` | `Text` with primary/muted color | No `asChild`; `href`/`target` accepted but inert (no router) |
| ButtonGroup | `orientation`, `spacing`, `value`, `onValueChange` | Row/column flex + selection context | `as` for Link only; group itself is a `View` |

Web `asChild` has no native equivalent — these render the primitive directly;
use `accessibilityRole` / `accessibilityLabel` for semantics.

### Typography (6)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| Text | `variant`, `size`, `font`, `truncate`, `center`, `as` | RN `Text` styled from `typography.*` | `as` supported natively |
| Heading | `as` (`h1`–`h6`) | RN `Text` with `display.*` size map | `as` supported natively |
| Badge | `tone`, `size` | `View` + `Text`; tones from `semantic` palette | None |
| Divider | `orientation`, `variant` (solid/dashed), `label` | `View` line(s) + optional label row | None |
| Skeleton | `shape`, `width`, `height` | `Animated.loop` opacity pulse | Reduced motion → static |
| Kbd | `children` | `View` chip + `mono.sm` text | None |

### Layout (3)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| Container | `variant` (centered/fluid/narrow), `size`, `as` | Flexbox `View`; `maxWidth` guards | `as` supported natively |
| Stack | `orientation`, `spacing`, `alignItems`, `justifyContent`, `wrap`, `as` | Flexbox `View` with token `gap` | `as` supported natively |
| Grid | `columns` (1–12), `gap`, `auto`, `as` | Flexbox wrap `View`; `flexBasis` columns | `as` supported natively |

### Form — base (7)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| [Field](/guide/components/form/field) | `label`, `hint`, `error`, `required`, `disabled`, `htmlFor` | `View` + `Text`; error/disabled via context | No `asChild`; `htmlFor` accepted but inert |
| Input | `variant` (outlined/filled), `value`, `onChange`, `error` | `TextInput` | Field context wiring via `useFieldContext` |
| Textarea | Input + `resize`, `minHeight`, multiline | `TextInput` multiline | None |
| [Select](/guide/components/form/select) | `options`, `value`, `onValueChange`, `placeholder`, `multiple`, `disabled` | Dismissible modal option list via shared `ListOverlay` | No native `<select>`; `multiple` accepted (single-select list) |
| Checkbox | `checked`, `onCheckedChange`, `indeterminate`, `disabled` | Custom `Pressable` + check glyph | `accessibilityRole="checkbox"` |
| Radio | `value`, `checked`, `onChange`, `disabled` | Custom `Pressable` + dot | `accessibilityRole="radio"` |
| [Switch](/guide/components/form/switch) | `checked`, `onCheckedChange`, `size` (sm/md), `disabled` | Custom `Pressable` thumb + track | `accessibilityRole="switch"` |

### Form — advanced (6)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| [Slider](/guide/components/form/slider) | `value`, `min`/`max`/`step`, `orientation`, `onValueChange`, `disabled` | `PanResponder` drag, horizontal/vertical | Touch drag; no hover/keyboard stepping |
| [Combobox](/guide/components/form/combobox) | `options`, `value`, `onChange`, `onSearch`, `allowCustom`, `filterOption` | `TextInput` + `ListOverlay` filter list | Same list primitive as Select/Menu |
| RadioGroup | `value`, `onValueChange`, `orientation` + `RadioGroupItem` | Context wiring over Radio rows | None |
| CheckboxGroup | `value: string[]`, `onValueChange` + `CheckboxGroupItem` | Context toggle wiring | None |
| InputGroup | `error` + `InputGroupAddon` | Flex row; focus/error border | None |
| NumberInput | `value`, `min`/`max`/`step`, `variant` (default/compact) | `−`/`+` Pressables + text stepper | None |

### Surfaces (2)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| [Card](/guide/components/surfaces/card) | `variant`, `padding`, `onPress` | `View` + `nativeElevation`; press lift via `Animated` | No `asChild`; pressable when `onPress` set |
| Avatar | `variant` (image/initials/icon), `size`, `shape`, `src`, `alt` | `Image` / initials `Text` / icon slot | `src` maps to RN `Image` |

### Data display (2)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| [Table](/guide/components/data/table) | `variant`, `size`, `frozenHeader`, `maxHeight` + toolkit (`Head`, `Body`, `Row`, `Cell`, `TableCheckbox`, `RowActions`, `EditableCell`, `Caption`) | View-based grid (no native table) | `frozenHeader` via `ScrollView` `stickyHeaderIndices`; a11y via `role="grid"`/`"row"`/`"cell"`/`"columnheader"` + `accessibilityRole` where supported; `EditableCell` uses `TextInput` |
| [Pagination](/guide/components/data/pagination) | `total`, `pageSize`, `current`, `onChange`, `siblingCount`, `variant` (page/simple) | Page buttons + prev/next; simple `current / pages` | `renderPagePreview` removed (hover has no touch equivalent) |

### Feedback (8)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| Spinner | `size` (sm/md/lg), `label` | `Animated.loop` rotation | Reduced motion → static |
| [Progress](/guide/components/feedback/progress) | `value`, `variant`, `size`, `stroke`, `label` | `Animated.timing` width / rotation / translate | Variants: `bar`, `pageTop`, `pageBottom`, `circle`; `mouse` is web-only |
| Message | `tone`, `position`, `title`, `description`, `dismissible`, `onDismiss` | Positioned `View` stack | `position` accepted, layout-managed |
| [Tooltip](/guide/components/feedback/tooltip) | `content`, `position`, `delay` | Anchored `Modal`; press-in/hover/focus show | Trigger measured via `Anchor` + `measureInWindow` |
| [Toast](/guide/components/feedback/toast) | `toast()`, `ToastProvider`; `variant`, `title`, `description`, `action`, `autoHideDuration`, `position` | Modal stack + auto-dismiss timer | `position` accepted but unused (same as web) |
| [Dialog](/guide/components/feedback/dialog) | `Root`, `Portal`, `Content`, `Close`, `Title`, `Description` | `Overlay` (Modal) + elevated card | No portal/DOM focus trap; `accessibilityViewIsModal` |
| [Drawer](/guide/components/feedback/drawer) | `Root` (`open`, `side`, `size`), `Trigger`, `Content` | `Overlay` + slide `Animated` per `side` | Sizes xs–lg map to fixed widths |
| [Popover](/guide/components/feedback/popover) | `Root`, `Trigger`, `Content` (`side`) | Anchored `Overlay`, positioned from trigger geometry | Trigger measured via `Anchor` + `measureInWindow` |

### Navigation (4)

| Component | API summary | Native approach | Notes |
|---|---|---|---|
| [Tabs](/guide/components/navigation/tabs) | `Root` (`value`, `variant`), `List`, `Trigger`, `Panel` | `ScrollView` row + `Animated` underline indicator | Touch-first; no roving tabindex |
| [Accordion](/guide/components/navigation/accordion) | `Root` (`type` single/multiple), `Item`, `Header`, `Trigger`, `Content` | Height reveal via `Animated` | Reduced motion → instant expand |
| [Menu](/guide/components/navigation/menu) | `Root`, `Trigger`, `Content`, `Item` | Anchored modal list via shared `ListOverlay` | Custom items; `accessibilityState.expanded` on trigger |
| Breadcrumb | Items + `separator` | Flex `Text` row with separators | Links render as `Pressable` |

## Theming

The native `Provider` matches the web contract verbatim — do not invent props:

```ts
interface ProviderProps { children: ReactNode; theme: XTheme }
interface XTheme { mode: ColorMode; semantic?: Partial<Record<SemanticAlias, string>> }
```

```tsx
<Provider theme={{ mode: 'dark' }}>…</Provider>
<Provider theme={{ mode: 'light', semantic: { primary: '#7c3aed' } }}>…</Provider>
```

- `theme` is **required**. `initialMode` and `toneOverrides` do not exist on
  either platform — do not use them.
- `mode` selects the palette: `light` → `semantic.color`,
  `dark` → `semanticDark.color`. User `theme.semantic` overrides win.
- `useTheme()` returns the full context `{ theme, setTheme, semantic }`
  (web parity — not just `XTheme`).
- `useThemeMode()` returns the current `ColorMode`.
- `useNativeColors()` returns the resolved `Record<SemanticAlias, string>`
  palette — the convenient way for components to read colors.
- **Hex vs CSS var:** on web, `semantic.*` values are CSS-var strings
  (`var(--xr-semantic-color-*)`); natively they are resolved hex strings.
  Never pass a `var(...)` string into a native style.

## Motion

No CSS transitions — motion goes through `useNativeMotion()` + RN `Animated`:

```tsx
const { animate, easing, durations, reduced } = useNativeMotion()

Animated.timing(opacity, animate({ toValue: 1, duration: 'moderate', easing: 'enter' })).start()
```

- `durations` are the token `motion.duration` values in ms
  (`instant: 1`, `fast: 100`, `base: 150`, `moderate: 250`, `long: 400`,
  `emphatic: 600`).
- `easing(key)` maps token `motion.easing` bezier arrays
  (`standard`, `enter`, `exit`, `emphasis`) to `Easing.bezier(...)`.
- `animate({ toValue, duration, easing })` builds `Animated.timing` options.
- Reduced motion (via `AccessibilityInfo` / RN `useReducedMotion`) snaps
  durations to `motion.duration.instant` (1 ms); looping effects
  (Spinner, Skeleton) render static instead.

## Overlays

Three shared primitives back every overlay component (Dialog, Drawer, Popover,
Menu, Tooltip, Toast, Select, Combobox):

- `Overlay` (`{ open, onClose, children }`) — RN `Modal` wrapper:
  `transparent`, `animationType="none"` (opacity is driven entirely by
  `Animated` so token durations + reduced motion apply), `onRequestClose`
  for Android back, backdrop press to dismiss, `accessibilityViewIsModal`.
- `Anchor` — trigger measurer: wraps the trigger, records `onLayout` +
  `measureInWindow` geometry, exposes `{ x, y, width, height, open, setOpen }`.
- `ListOverlay` — shared anchored option-list primitive (`ScrollView` of items
  inside an `Overlay`, with current/highlighted index). Reused by Select,
  Combobox, and Menu.

Dismissal: Android back button (`onRequestClose` / `BackHandler`) + outside
press on the transparent backdrop, wired through the `useDismissable` hook
(an RN reimplementation — not an RN built-in). There is no portal and no tab
index; overlay content gets single-focus semantics via
`accessibilityViewIsModal`.

## Accessibility

Parity is expressed through RN accessibility props, not DOM semantics:

| Web | Native |
|---|---|
| `role`, `aria-*` | `accessibilityRole`, `accessibilityState`, `accessibilityLabel`, `accessibilityHint` |
| `aria-busy` / `aria-live` | `accessibilityState` (`{ busy: true }`) / `accessibilityLiveRegion` |
| `:focus-visible` ring | `onFocus`/`onBlur` intent in `usePressable` |
| Focus trap in overlays | `accessibilityViewIsModal` + backdrop responder |
| Table semantics | `role="grid"`/`"row"`/`"cell"`/`"columnheader"` + `accessibilityRole` where supported |

**Keyboard divergence:** React Native is touch-first — there is no DOM tab
order, so roving focus / keyboard navigation from web has no mechanical
counterpart. Arrow-key handling exists only where the platform offers it;
document per-component behavior via `accessibilityLabel`/`accessibilityHint`.

## Divergences from web

- `asChild` (web) has no native equivalent. `as` exists only on `Text`,
  `Heading`, `Container`, `Stack`, `Grid`. Components exposing `asChild` on
  web (Button, IconButton, Link, Field, Card, …) render the primitive directly
  natively; use `accessibilityRole` / `accessibilityLabel` for semantics.
- Theme values: web `semantic.*` are CSS-var strings; native resolves them to
  real hex via `useNativeColors()`.
- `Progress` `mouse` variant is web-only — not implemented natively. Native
  variants: `bar`, `pageTop`, `pageBottom`, `circle`.
- `Select` has no native `<select>`; native is a dismissible modal option list
  (shared `ListOverlay` primitive).
- `Table` is a View-based grid, not a real table. `frozenHeader` uses RN
  `ScrollView` `stickyHeaderIndices`.
- `Pagination` `renderPagePreview` was removed natively (hover preview has no
  touch equivalent).
- Keyboard / roving focus is a documented divergence: RN is touch-first;
  semantics via `accessibilityRole` / `State` / `Label` / `Hint` / `LiveRegion`.
- Motion: web CSS transitions → native `Animated` + `useNativeMotion` token
  durations/easings, honoring reduced motion (snaps to instant/static).
- Elevation: CSS `box-shadow` tokens → `nativeElevation` parser (iOS shadow
  props, Android `elevation` heuristic).
- `Toast` `position` is accepted but unused natively (same as web).
- Overlays use RN `Modal` (`transparent`, `animationType="none"` + `Animated`
  fade) anchored via `measureInWindow`; no portal / tab index.
- Provider contract: `{ children, theme: XTheme }` with `theme` **required**;
  `XTheme = { mode, semantic? }`. `useTheme()` returns the full context
  `{ theme, setTheme, semantic }`; plus `useThemeMode()` and
  `useNativeColors()`.

## Testing

- Jest + `@testing-library/react-native` **v13** (native matchers built in).
- Tests are colocated with source: `*.test.tsx` next to each component in
  `packages/react-native/src/`.
- Coverage per component: default + every variant (assert style values from
  tokens), states (disabled, loading/busy, checked/selected, controlled vs
  uncontrolled), theming (`Provider` dark → resolved palette), reduced motion
  (mock `AccessibilityInfo.isReduceMotionEnabled` → duration snap to 1 ms),
  overlays (`Modal` open/close, `onRequestClose`, outside-press dismiss),
  `Animated` via fake timers.
- Gates: test + typecheck + lint + build must all be green.
