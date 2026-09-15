# Xerena — Native Components (Phase 6)

- **Date:** 2026-09-15
- **Status:** Draft — pending architect review BEFORE implementation
- **Predecessor spec:** `docs/superpowers/specs/2026-09-13-xerena-components-design.md` (Phase 5, web)
- **Depends on:** `@xerena/tokens@0.1.0` (published), `@xerena/native` skeleton (Provider + ThemeContext, published 0.0.0)
- **Makes available to:** Phase 7 (Release)

## Context

Phase 5 shipped the complete web component system (42 components) in
`@xerena/react` and published `tokens@0.1.0`, `styling@0.1.0`,
`react@0.1.0`, `native@0.0.0`. The Phase 5 spec parked native components at
one line: *"Native components (`@xerena/react-native`) → Phase 6 (type-only
API alignment where possible; no runtime cross-import)."* **Note on naming:**
repo dir is `packages/react-native`, published package name is `@xerena/native`
(`package.json:2`) — this spec uses `@xerena/native` throughout.

This phase ships **full parity** for `@xerena/native` — all 42 components with
the same public API and visual spec as web, implemented natively with
React Native primitives + `StyleSheet`, consuming raw token values directly.
Components with web-only semantics get an honest native equivalent or an
explicitly documented web-only exemption.

**Loading pattern: foundation spec "berbagi API surface, bukan code".** Native
reads `@xerena/tokens` directly. It must NOT import `@xerena/react` or
`@xerena/styling` (styling is web-only: CSS vars, cubic-bezier strings, DOM
hooks). Enforced by the existing `no-restricted-imports` rule
(`@xerena/react` blocked in native eslint config).

## Package Architecture & Boundaries

```
@xerena/tokens (raw values: colors, semantic, semanticDark, spacing,
                typography, motion, elevation, radius)
   └─→ @xerena/native (42 components, StyleSheet-based)
           ├─ styles/: token resolvers (palette, elevation, typography,
           │            spacing, native motion) — NO DOM/CSS
           ├─ primitives/: Pressable base, Overlay (Modal-based), Slot-as
├─ hooks/: useControllableState, useReducedMotion, usePressable,
   │          useNativeMotion, useNativeColors, useDismissable
           ├─ components/<Category>/<Name>/: component + test + variants
           └─ index.ts root exports
```

### Rules (enforced via ESLint `no-restricted-imports`)

- `@xerena/native`: only `@xerena/tokens`, `react`, `react-native`, and
  `react-native` core APIs. **No third-party runtime UI library** — zero
  runtime deps beyond tokens. No `@xerena/react`, no `@xerena/styling`
  (runtime or type). Enforcement: `packages/react-native/eslint.config.mjs`
  `no-restricted-imports` blocks `@xerena/react`, `@xerena/styling`, and
  `react-dom` (this rule list is EXTENDED in Task 1 by the implementer).
  NOTE: Nx module boundaries are NOT configured (no tags / no
  `@nx/enforce-module-boundaries`) — do not claim Nx enforcement.
- `react` `^19.0.0`, `react-native` `^0.78.0` peers.
- `@xerena/tokens` stays the single source of truth. No token edits unless a
  task explicitly rules otherwise (Phase 6 does NOT need token changes —
  verified: every value required by the 42 components exists in `tokens.json`).
- Every new component ships a colocated Jest test
  (`@testing-library/react-native` v13 — native matchers built in) and gates
  green (test + typecheck + lint + build).

## Key Architectural Decisions (Phase 6)

1. **Styling consumption** — components build `StyleSheet.create` from raw
   token values at module scope, plus dynamic inline styles for runtime state.
   No CSS, no `xr-*` classes, no `data-xerena-theme` selectors.
2. **Theming — Provider matches web verbatim (DO NOT invent props).** Web
   contract (verified in `packages/react/src/primitives/Provider.tsx`):
   ```ts
   interface ProviderProps { children: ReactNode; theme: XTheme }
   interface XTheme { mode: ColorMode; semantic?: Partial<Record<SemanticAlias, string>> }
   interface ThemeContextValue { theme: XTheme; setTheme: (t: XTheme) => void; semantic: Record<SemanticAlias, string> }
   ```
   - `theme` is **required**; `initialMode` and `toneOverrides` do NOT exist
     on web and MUST NOT be added natively.
   - Native `Provider` resolves `theme.mode → palette` (light =
     `semantic.color`, dark = `semanticDark.color`, user `theme.semantic`
     overrides winning) via `useMemo` and provides the SAME
     `ThemeContextValue` shape: `{ theme, setTheme, semantic }`.
   - Divergence (documented, not "same"): web `semantic.*` values are CSS-var
     strings (`var(--xr-semantic-color-*)`); native `semantic.*` values are
     resolved hex strings. `useTheme()` returns the full
     `ThemeContextValue` (web parity) — NOT just `XTheme`.
   - `useNativeColors()` = convenience hook returning `Record<SemanticAlias,
     string>` (the resolved palette). `useThemeMode(): ColorMode` added
     (web parity, back-compat with current native `useTheme` consumers: they
     read `theme.mode`, still available via `useTheme().theme.mode`).
3. **Motion** — no CSS transitions. New `useNativeMotion()` hook in the native
   package: reads `motion.duration` (ms numbers) + `motion.easing` (bezier
   point arrays) from tokens, wraps `Animated.timing` options
   (`duration`, `easing: Easing.bezier(...)`), and honors
   `AccessibilityInfo.isReduceMotionEnabled` / RN `useReducedMotion()` →
   duration snapped to `motion.duration.instant` (1ms). All micro-motion rules
   from Phase 5 carry over (physical feedback only; values from tokens; enter
   `moderate`/`enter`, exit `emphatic`/`exit`, etc.).
4. **Elevation** — RN has no box-shadow. `tokens.json` `elevation.*` are CSS
   box-shadow shorthand strings. Native resolver `nativeElevation(level)` parses
   the EXACT grammar deterministically. Real format (verified in
   `tokens.json:107-112`): `offsetX offsetY blur color` =
   `0 <ym>px <blur>px rgba(R,G,B,A)` where `offset-x` is always `0`,
   `offset-y` is the FIRST px length, `blur` is the SECOND px length, and
   `color` is the trailing `rgba(...)` (multi-layer shadows joined by `, `).
   Mapping:
   - iOS: `shadowColor` = rgb portion of the deepest (largest blur) layer,
     `shadowOffset = { width: 0, height: <offset-y> }`,
     `shadowRadius = <blur>`, `shadowOpacity` = rgba alpha (0–1).
   - Android: derive `elevation` from blur radius (≈ blur/4 px) — platform
     difference documented, not silently shipped as identical pixels.
   - `"none"` → `{}`.
   - Grammar is put verbatim in Task 1 `styles/elevation.ts`, fully tested.
5. **Composition** — no DOM, so the web `asChild`/`Slot` has no mechanical
   counterpart. Mirror the *intent* with an `as` prop on the components that
   need it (Text, Heading, Container, Stack, Grid): `as` accepts a host
   component/string and renders it with merged props.
   **Explicit `asChild` exemptions (documented divergence, per component):**
   web components whose API exposes `asChild` (Button, IconButton, Link,
   Field, Card, and any other component that forwards `asChild`) do NOT
   carry an `as` prop natively; document each in its docs page as
   "web `asChild` has no native equivalent — RN composition renders the
   primitive directly; use `accessibilityRole`/`accessibilityLabel` for
   semantics." The blanket note in Component Parity is NOT sufficient.
6. **Overlays** (Dialog, Drawer, Popover, Menu, Tooltip, Toast) — RN `Modal`
   (`transparent`, `animationType="none"`; overlay fade + optional Drawer slide
   driven by `Animated` via `useNativeMotion` so token durations + reduced
   motion apply). Trigger-anchored overlays (Popover/Menu/Tooltip) measure the
   trigger via `onLayout` + `measureInWindow`, then absolutely position
   content inside the Modal. Dismissal: `onRequestClose` (Android back) +
   outside-press via a transparent backdrop — a `useDismissable` hook
   **reimplemented for RN** (not an RN built-in; there is no RN `useDismissable`).
   No portal, no DOM
   focus trap: RN focus concepts are accessibility-based, so overlay content
   gets `accessibilityViewIsModal` + container View `onStartShouldSetResponder`
   single-focus semantics (parity intent, documented divergence).
7. **Web-only exemptions (documented)** — components whose behavior is
   impossible/harmless-to-skip on RN using honest alternatives:
   - `Progress` `mouse` variant → **web-only** (no reliable global cursor
     events; documented in docs + story). Other variants (bar/pageTop/
     pageBottom/circle) fully native (pageTop/pageBottom = absolutely
     positioned bars over the app).
- `Select` → no native `<select>`; native equivalent = a dismissible modal
      option list (**reuses the shared `ListOverlay` primitive**) with the same
      API (`value`, `onValueChange`, `placeholder`, `multiple`,
      disabled/readOnly).
   - `Table` → View-based grid (header row View, cells (View/Text)), same API:
     `variant`, `size`, frozenHeader (scroll container), TableCheckbox,
     RowActions, expandable rows, EditableCell (TextInput editor). No native
     table semantics; a11y via `accessibilityRole="grid"/"header"/"cell"` where
     supported.
   - `Grid`/`Stack`/`Container` map to flexbox Views (all tokens available).
   - `Switch` → custom Pressable thumb+bg (sizes sm/md, translate token math
     from web spec) for full visual parity; `accessibilityRole="switch"`.
8. **Keyboard/roving focus** — RN has no DOM tab order. Roving focus becomes
   accessible-container semantics + arrow-handler hooks where the platform
   offers it; keyboard is a documented divergence (touch-first). A11y parity
   via `accessibilityRole`, `accessibilityState`, `accessibilityLabel`,
   `accessibilityHint`, `accessibilityLiveRegion`.

## Shared Primitives & Hooks (native)

### primitives/

- `Pressable.tsx` — base interactive component (RN `Pressable` wrapped):
  hover/active/press feedback ported from usePress, `disabled`, `loading`
  (`accessibilityState.busy`), focus-visible intent via `onFocus`/`onBlur`.
  Backed by `usePressable` hook.
- `Overlay.tsx` — RN `Modal` wrapper: `animationType="none"` (NOT `"fade"` —
  opacity is driven entirely by `Animated` from `useNativeMotion` so token
  durations + reduced-motion snap actually apply; `animationType="fade"` would
  double-fade and ignore tokens). `transparent`, `onRequestClose`,
  `accessibilityViewIsModal`, rendered content slot, `backdrop` press →
  dismiss, `useDismissable` handling (Android back + outside press). One
  implementation reused by Dialog/Drawer/Popover/Menu/Tooltip/Toast + Select
  + Combobox lists.
- `Anchor.tsx` — trigger measurer for anchored overlays: wraps trigger,
  `onLayout`/`measureInWindow`, exposes `{ x, y, w, h, open, setOpen }`.
  `measureInWindow` is NOT implemented in the RN jest mock — tests
  `jest.spyOn` the trigger ref's `measureInWindow` (or `UIManager.measureInWindow`)
  to return fixed geometry (combine with RNTL `fireEvent(el, 'layout')`).
- `ListOverlay.tsx` — SHARED anchored option-list primitive (ScrollView of
  items inside an `Overlay`, keyboard/typing nav hooks, current/highlighted
  index). Created in Task 1 because Select (Task 5), Combobox (Task 6), and
  Menu (Task 10) ALL reuse it; it is NOT owned by any single component.

### hooks/

- `useControllableState` (ported logically from web).
- `useReducedMotion` — wrapper over RN `useReducedMotion()` +
  `AccessibilityInfo`.
- `usePressable` — `pressed`/`hovered`/`focused` state + reduced-safe press
  scale/shadow mapping. (Single name: `usePressable`, not `usePressed`.)
- `useNativeMotion` — `{ durations, easings: (key) => Easing, reduced, animate }`;
  `animate(config)` builds `Animated.timing` options from token keys.
- `useNativeColors` — resolved `Record<SemanticAlias, string>` from context.
- `useDismissable` — RN reimplementation (NOT an RN built-in): Android back
  via `onRequestClose`/BackHandler + outside-press via transparent backdrop
  responder; returns/open-state wiring used by `Overlay` and all overlay
  components.

## Component Parity Table (42 = web)

| Category | Components | Native approach |
|---|---|---|
| Actions (4) | Button, IconButton, Link, ButtonGroup | Pressable/Text; variants/sizes via token values + `StyleSheet` maps; `aria-busy`→`accessibilityState`. `as` for Link. ButtonGroup: row/col flex + selection context |
| Typography (6) | Text, Heading, Badge, Divider, Skeleton, Kbd | `Text` styled from `typography.*` (display/body/mono sizes+weight+spacing). Skeleton: `Animated.loop` pulse (reduced→static). Dividers: View/Text. Badge tones from `semantic` palette |
| Layout (3) | Container, Stack, Grid | flexbox Views; Container max-width guards (RN `maxWidth`), centered/fluid/narrow |
| Form base (7) | Field, Input, Textarea, Select, Checkbox, Radio, Switch | `TextInput` (Input/Textarea/Field wiring via context); Select→modal list; Checkbox/Radio custom Pressable+icon; Switch custom Pressable thumb |
| Form advanced (6) | Slider, Combobox, RadioGroup, CheckboxGroup, InputGroup, NumberInput | Slider: `PanResponder`/`GestureResponder` drag (single+range, h/v). Combobox: TextInput + list overlay + filter + select. RadioGroup/CheckboxGroup: context wiring. InputGroup: flex row + focus border. NumberInput: +/- Pressables + text steerer |
| Surfaces (2) | Card, Avatar | View styled + `nativeElevation`; Avatar: Image/initials/icon + sizes/morph |
| Data display (2) | Table (toolkit), Pagination | View grid + scroll container; TableCheckbox/RowActions/expandable/EditableCell. Pagination: pages + prev/next + simple |
| Feedback (8) | Spinner, Progress, Message, Tooltip, Toast, Dialog, Drawer, Popover | Spinner: `Animated.loop` rotate (reduced→static). Progress bar/circle/page: `Animated.timing` width/rotate/translate; mouse **web-only**. Message: View+position prop inert-ok. Tooltip: anchored Modal, show delays. Toast: modal stack + auto-dismiss timer + onDismiss. Dialog/Drawer/Popover: `Overlay` + slides |
| Navigation (4) | Tabs, Accordion, Menu, Breadcrumb | Tabs: ScrollView row + underline indicator `Animated` translate. Accordion: height reveal (`Animated`), single/multiple. Menu: anchored Modal list, custom items. Breadcrumb: flex Text row + separators |

## Testing Strategy (per component)

Jest + `@testing-library/react-native` (v13, native matchers built in),
colocated `*.test.tsx` in `packages/react-native/src/`:

- render default + every variant (table-driven; assert style values from
  tokens, e.g. bg color, radius).
- states: disabled, loading/busy, checked/selected, controlled vs
  uncontrolled.
- theming: Provider `dark` → assert resolved palette flows
  (`useNativeColors().background === semanticDark…`).
- reduced-motion: mock `AccessibilityInfo.isReduceMotionEnabled` → assert
  duration snap to 1ms / static fallback.
- overlay components: Modal open/close, `onRequestClose` fires, outside-press
  dismiss, focus/accessibilityViewIsModal set.
- Animated: jest fake timers to flush `timing`.

Existing suites stay green (tokens, react, react-native, brand, styling).

## Documentation (VitePress)

**Decided at plan review (not deferred):** ONE navigation page
`guide/native.md` — a single matrix: all 42 components × { API summary, native
approach, divergence notes (asChild exemptions, web-only exemptions, palette
vs CSS-var values) } — plus short per-category divergence notes inline. Web
docs get a "React Native" note where API diverges (`as` vs `asChild`,
web-only exemptions). Sidebar: "native" group added. (Rationale: per-component
pages for 42/42 is disproportionate; the matrix is the maintainable surface.)

## Versioning & Release (Phase 7)

Release is a **Phase 7 gate, NOT part of Phase 6's plan**. Phase 6 acceptance =
docs (`guide/native.md`) + all native gates green. At start of Phase 7:
`@xerena/native` bump 0.0.0 → 0.1.0 with changeset + release workflow (NPM_TOKEN
already configured). User already chose to publish `@xerena/native`. No changes
to web packages unless reviews demand fixes.

## Decision History

| # | Decision |
|---|---|
| 1 | Full parity: all 42 web components, same API, native impl |
| 2 | Native consumes tokens directly; zero runtime deps; no @xerena/react or @xerena/styling imports |
| 3 | Theming via context-resolved palette (`useNativeColors`); no CSS vars |
| 4 | Motion via `useNativeMotion` + RNS `Animated`/`Easing.bezier`, reduced-motion honored |
| 5 | Elevation: deterministic parser of token shadow strings → RN shadow props + Android elevation heuristic |
| 6 | Provider/`useTheme` web-verbatim: `theme: XTheme` required; no `toneOverrides`/`initialMode`; `useTheme()→ThemeContextValue`; `useNativeColors()→Record<SemanticAlias,string>`; `useThemeMode` added |
| 7 | Native eslint `no-restricted-imports` extended: `@xerena/react`, `@xerena/styling`, `react-dom` (no Nx boundaries — not configured) |
| 8 | Shared `ListOverlay` primitive created in Task 1 (Select/Combobox/Menu all reuse) |
| 9 | `Overlay` uses `animationType="none"` + `Animated` fade/slide (token durations + reduced motion apply); `useDismissable` is an RN reimplementation |
| 10 | Docs = single `guide/native.md` matrix; Release deferred to Phase 7 gate |