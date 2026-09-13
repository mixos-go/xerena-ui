# Xerena — Web Components (Phase 5)

- **Date:** 2026-09-13
- **Status:** Approved in design discussion (full brainstorm — 6 architecture sections + 9 component categories)
- **Predecessor spec:** `docs/superpowers/specs/2026-09-12-xerena-styling-design.md` (Phase 4)
- **Depends on:** `@xerena/tokens` (foundation + brand + motion), `@xerena/styling`, `apps/docs`, `apps/storybook`
- **Makes available to:** Phase 6 (Native Components), Phase 7 (Release)

## Context

Phase 4 delivered the ergonomic layer between design tokens and components:
the utility generator (`xr-*` classes), style helper resolvers, and web motion
hooks. The Phase 4 spec promised: *"Semantic colors — `--xr-semantic-*` CSS
vars + semantic utility classes → Phase 5 (components + theming). `@xerena/react`
will also depend on `styling/react` (useMotion hooks)."*

This phase (Components) ships a **complete web component system** in
`@xerena/react` — 42 components, each brainstormed individually — plus a token
extension (status + dark palette), the semantic generator, runtime theming,
self-built headless primitives, and a versioned release at the end of the phase.

This is the **component phase**: `@xerena/react` becomes a full library.
`@xerena/react-native` receives **no changes** (Phase 6).

## Package Architecture & Boundaries

### Dependency graph after Phase 5

```
@xerena/tokens (primitive + semantic + status + dark)
   └─→ @xerena/styling (generator + css helpers + hooks)
          ├─→ styles.css: xr-* utilities + semantic + dark-aware vars
          ├─→ @xerena/react (42 components)
          │       ├─ primitives/: Slot/asChild, cn, useClassName, useVariant
          │       ├─ hooks/: headless state machines (built in-house)
          │       ├─ components/<Category>/<Name>/: component + test + variants
          │       └─ styles: import tokens.css + styles.css
          └─→ docs + storybook (consumers)
```

### Rules (enforced via ESLint `no-restricted-imports` + Nx constraints)

- `@xerena/react`: only `tokens`, `styling` (`.` + `./react`), `react`,
  `react-dom`, `react-dom/client`. **No third-party runtime UI library**
  (Radix, Base UI, etc.) — headless primitives are built in-house, informed by
  research on their APIs. Zero-dependency stays intact.
- `@xerena/react` must NOT import `@xerena/react-native` (runtime or type).
- `@xerena/styling` stays component-agnostic: no ownership from components.
- `react` `^19.0.0` peer dependency.

## Locked Architectural Decisions (brainstorm outcome)

1. **Styling consumption** — components render `xr-*` classes from `styles.css`
   as the primary source. `cssVar`/`css` (Phase 4) only for dynamic values
   (animation/override). The Provider loads `tokens.css` + `styles.css`.
2. **Theming** — runtime CSS vars in the Provider: `Provider({ theme,
   toneOverrides? })` → `useMemo` produces CSS var overrides on the theme
   scope. Dark = scope selector `[data-xerena-theme='dark']`. Components never
   know the theme — they all read vars.
3. **Variant API** — `asChild`/composition à la Radix. Union-literal props for
   simple variants; complex components (Menu, Combobox, Dialog, Tabs,
   Accordion, RadioGroup, Field) use composition parts + context.
4. **Micro-motion** — one motion core (`useMotion`/`useReducedMotion` from
   Phase 4) + a transition map per component. Motion = physical feedback
   (hover/active/focus-visible/press/enter/exit), not decorative choreography.
5. **Documentation structure** — one integral spec (this document):
   architecture → per-category detail for all 42 components. The plan splits
   into many tasks.

## Status & Dark Palette (`@xerena/tokens` extension)

### Primitive colors — status scale

Four new families, consistent `value.shade` shape (50–900) like ember/sand:

- `success` (accessible green)
- `warning` (amber)
- `danger` (red)
- `info` (blue)

`colors` **stays light-only** (no `{light,dark}` objects) — dark values live
ONLY in `semantic` (brainstorm decision); this avoids "which color is this"
ambiguity and keeps contrast math primitive.

### Semantic aliases — two modes

`semantic/index.ts` extension:

```
semantic.light / semantic.dark  (each alias → light/dark primitive value)
```

Light aliases (from the existing palette):
`primary` (ember.600), `primaryHover` (ember.700), `primaryActive` (ember.900),
`background` (sand.50), `surface` (sand.100), `surfaceHover` (sand.100 →
tinted via primary alpha), `border` (sand.100), `borderStrong` (sand.500),
`text` (sand.900), `textMuted` (sand.500), `textOnStrong` (light),
`successText`/`warningText`/`dangerText`/`infoText` (dark status shades for
contrast on light backgrounds),
`successSurface`/`warningSurface`/`dangerSurface`/`infoSurface` (soft
backgrounds),
`danger`/`dangerHover`, `info`/`infoHover`.

Dark aliases map to the matching dark palette (light background → dark, light
text; primary stays ember-tinted but brighter for accessibility on dark
backgrounds). Exact values are chosen during generator implementation —
principle: **minimum 4.5:1 contrast for text, 3:1 for non-text** (WCAG AA).

`semantic.spacing` stays (xs–xl) — unchanged.

### `@xerena/styling` generator (backward-compatible extension)

New `dist/styles.css` output:

```
:root { --xr-* primitive (existing) + --xr-semantic-* light }
[data-xerena-theme='dark'] { --xr-semantic-* dark }
```

Consumer semantic classes (not per-shade — they read vars so they follow the
theme automatically): `xr-bg-primary`, `xr-bg-primary-hover`, `xr-text-muted`,
`xr-text-danger`, `xr-border-danger`, `xr-text-success`, `xr-bg-success-soft`,
etc. — the `<utility>-<semantic-alias>` pattern expanded over all semantic
aliases.

Source: `tokens.json` + `semantic/index.ts` (via the existing
`resolveTokensPath`). Stays deterministic, DOM-free, same `require.resolve`.

## Provider & Theming

### `Provider` (expanded API)

```ts
interface ProviderProps {
  children: ReactNode
  theme: XTheme            // XTheme expanded: { mode, semantic?: DeepPartial<SemanticColors> }
  initialMode?             // deprecated → theme.mode
  toneOverrides?: partial  // alias → hex/var override value
}
```

- DOM scope: `[data-xerena-theme='light'|'dark']` (already exists).
- `useMemo` produces `--xr-semantic-*` override strings for the active scope.
- Mode stored in state; persistence (localStorage/`<html>`) NOT handled —
  pattern documented in the docs (application responsibility).
- CSS import: `@xerena/react/styles.css` (or manual `tokens.css`+`styles.css`)
  — one usage path.
- `useTheme` returns `{ mode, semantic }` (expanded).

## Headless Primitives (built in-house)

Three layers, all under `packages/react/src`:

### Layer 1 — Deformation & styling

- `Slot` + `asChild`: the child replaces the render element, props merged
  (Radix-style, no library). One subtle behavior: events/aria/styling are
  forwarded and merged into the child.
- `cn` (class merger, internal util) + `useClassName(...variants)`.
- `useVariant`, `useSize`: props → `xr-*` class mapping from `variants.ts`.
- `styles.css` re-export — `import '@xerena/react/styles.css'`.

### Layer 2 — Headless hooks (DOM-free state machines)

- `useControllableState(value, defaultValue, onChange)`.
- `useFocusRing`, `useDisabled`, `usePress` (`:active`/`:disabled`),
  `useFocusTrap` (Dialog/Drawer), `useDismissable` (Popover/Menu), `useFlushSync`.
- `useRovingFocus` (Tabs/RadioGroup/toolbars).
- `useReducedMotionSync` — one point: combines `useReducedMotion` + transition
  map → components write no logic themselves.
- `useMediaQuery` (composable with `useMotion` for responsive UX).

### Layer 3 — Composition primitives

- `Menu`, `Combobox`, `Dialog`, `Tabs`, `Accordion`, `RadioGroup/CheckboxGroup`,
  `Field`, `Popover` — each Root/Trigger|.../Content with an internal context
  provider.
- `OverlayPrimitive` internal: portal + focus-trap + dismiss-aware — ONE
  implementation reused by Dialog/Drawer/Popover/PreviewPopover.
- `PreviewPopover` internal (used by Tooltip/Pagination preview).
- **No** global state Provider beyond per-component React contexts.

## Micro-Motion System (shared, locked rules)

1. **Reduced motion is always honored** — `useReducedMotion()`/snap-to-instant
   from Phase 4 handles it; components write no logic of their own.
2. **Micro-motion is only physical feedback** — hover/active/focus-visible/
   press/enter/exit. Not decorative choreography.
3. **All values come from tokens** (`motion.duration`, `motion.easing`) — no
   magic numbers.
4. **Default transitions are light**: ≤150ms total per interaction (normal
   systems).
5. **Dismissible/popup** (Dialog, Menu, Popover, Toast, Drawer):
   enter/exit animation — `moderate`/`emphatic` duration, `enter`/`exit` easing.
6. **`animated` variant** (e.g. Button): boosted press scale/shadow — visible,
   still reduced-safe.

Every component below has a **Motion** table — event → property → duration →
easing → reduced fallback.

## Components — 42, per category

### Actions (4)

#### Button
| Aspect | Specification |
|---|---|
| Variants | `primary`(solid) · `ghost`(transparent) · `outline`(border+text-primary) · `soft`(tinted bg) · `destructive`(danger solid) · `link`(text-only) |
| Sizes | `sm`(h-8) · `md`(h-10) · `lg`(h-12) |
| States | default · hover · active(press) · focus-visible(ring) · disabled · loading(aria-busy) |
| Motion | hover `fast`/`enter` translateY(-1px)+bg tint · active `instant`/`exit` scale(0.98) · focus ring `fast` · `animated`: press scale(0.96)+shadow |
| A11y | native `<button>`, focus ring, `aria-busy`, `type="button"` default |
| API | `asChild`, `loading`, `leftIcon/rightIcon`, `fullWidth`, `variant`, `size` |

#### IconButton
Same 5 variants (minus `link`) + sizes sm/md/lg. **`aria-label` required**.
Optional tooltip. Motion: hover tint `fast`/`enter`, active scale(0.94).

#### Link
`variant`: `default`(text-primary underline-on-hover) · `muted` · `animated`
(underline slide-in). `asChild` essential. `target/rel` passthrough,
`aria-current`. Motion: underline `fast`/`enter`.

#### ButtonGroup
Orientation (`horizontal`/`vertical`), `spacing` size, optional
`value`+`onValueChange` (selection). No own motion. A11y: group roles per
context.

### Typography (6)

#### Text
`variant`: `body` · `muted` · `strong` · `error`(danger). `size`: `sm/md/lg`
(→ `typography.body.*`), family `body`/`mono`. `as`, `asChild`, `truncate`,
`center`. No motion. A11y via `as`.

#### Heading
`as` `h1–h6`; visual mapping `typography.display.xs→xl`. `asChild`. No motion.
One `h1` per view (doc pattern).

#### Badge
`tone`: `neutral` · `info` · `success` · `warning` · `danger` · `brand` —
soft bg + contrast text via `--xr-semantic-*`. Sizes `sm/md`, radius `full`.
No motion. `aria-label` when icon-only.

#### Divider
`orientation` `horizontal`/`vertical`, `variant` `solid`/`dashed`,
optional `label`("or"). A11y: `role="separator"`, `aria-orientation`.

#### Skeleton
`shape`: `line`/`circle`/`rect`/`text`. `width/height`. Motion: `base` pulse
loop (non-reduced); static fallback. A11y: `aria-hidden` + container
`role="status"`/`aria-busy`.

#### Kbd
Mono family, border+radius sm, muted text. Native `<kbd>`. No motion.

### Layout (3)

#### Container
`variant`: `centered` · `fluid` · `narrow`. `size`: `sm/md/lg/xl` → max-width
(640/768/1024/1280). No motion, no a11y semantic (>div).

#### Stack
`orientation` h/v/inline, `spacing` (gap `--xr-spacing-*`), `alignItems`,
`justifyContent`, `wrap`. `as`. No motion.

#### Grid
`variant`: `auto`(auto-fit) · `explicit`. `columns`(1–12), `gap`. `as`.
No motion.

### Form (base) (7)

Shared principles: all fields use `Field`; error → danger border/text,
`aria-invalid`+`aria-describedby`; disabled/readOnly native; `h-10` md layout,
`sm` radius, `primary` focus ring; focus motion `fast`/`enter`; errors DO NOT
shake or vibrate.

#### Field
`label`, `hint`, `error`, `required`(asterisk+aria), `asChild`. Automatic
`htmlFor`/`id`/`aria-describedby`. No motion.

#### Input
`variant`: `outlined`(default) · `filled`. Type passthrough. Addons →
InputGroup.

#### Textarea
Like Input + `rows`, `resize`(`none`/`auto`), optional `autoSize`.

#### Select (native)
Native `<select>`+`<option>`, `multiple`, `placeholder`. Motion: chevron
`instant` rotate when open. A11y: native select (implied role), `aria-invalid`.

#### Checkbox
Variants: `default`, `mixed`(indeterminate). `checked`/`onCheckedChange`,
uncontrolled. Motion: ✓ fill `instant` + pop `fast`/`enter`. A11y:
`role="checkbox"`, `aria-checked`, native hidden input.

#### Radio
Same concept; grouped via `RadioGroup`. Motion: dot pop `fast` on select.

#### Switch
`checked`/`onCheckedChange`, sizes sm/md. Motion: thumb translate
(×27 sm / ×32 md) `base`/`enter`, bg change `base`; reduced → instant.
A11y: `role="switch"`, `aria-checked`, native checkbox input.

### Form (advanced) (6)

#### Slider
`variant`: `single` · `range`. min/max/step, orientation h/v. Motion: thumb
drag `base`/`enter`, release settle `base`/`enter`. A11y: `role="slider"`,
`aria-valuemin/max/now/text`, arrow keys.

#### Combobox
**Structure**: `Combobox`(Root) · `Input` · `List` · `Option` · Clear.
Variants: `default`(popover) · `inline`. State: search, open/close, keyboard
nav (aria-activedescendant), active/selected, loading(opt), empty state.
Motion: list fade+slide `fast`/`enter`; option highlight bg tint `fast`.
A11y: `role="combobox"` + `aria-expanded/controls/activedescendant`, listbox,
escape/blur close, focus return.

#### RadioGroup
Value context binding + layout orientation. A11y: `role="radiogroup"`,
`aria-labelledby`. No own motion.

#### CheckboxGroup
Same for Checkbox. n:1 wiring.

#### InputGroup
Combine Control + addon (icon/button/text/Select). Variant `outlined/filled`.
Unified focus ring.

#### NumberInput (Stepper)
Variants `default`(+/−) · `compact`. min/max/step, optional format (Intl).
Motion: press `instant`/scale(0.94). A11y: `role="spinbutton"`,
`aria-valuenow/min/max`, up/down keys.

### Surfaces (2)

#### Card
`variant`: `outlined`(default) · `elevated` · `soft` · `interactive` · `flat`.
`padding` sm/md/lg, `radius` md default. Motion: `interactive` hover
translateY(-2px)+shadow `base`/`enter`, focus ring `fast`.
A11y: `as`/`asChild` for semantics.

#### Avatar
`variant`: `image` · `initials` · `icon`. Sizes sm/md/lg/xl. Morph
`square`/`circle`. `onClick` → ring+focus. No AvatarGroup (Phase 5);
optional `stacked`.

### Data display (2)

#### Table (toolkit)
Structure: `Table`(Root, context) · `Head` · `Body` · `Row` · `Cell`
(th+scope passthrough). Features:

- `variant`: `striped` · `outlined` · `grid` · `hover`; `size` sm/md/lg.
- `frozenHeader` — sticky thead (scroll container `maxHeight`).
- **Checklist**: `TableCheckbox` header (select-all, tri-state) + per-row;
  `selection` controlled (`selectedRowKeys`/`onSelectionChange`) or
  uncontrolled; `aria-selected`.
- **Sub-table**: `Row expandable` → `expandContent`; chevron toggle,
  expanded controlled/uncontrolled. Motion: height reveal `moderate`/`enter`,
  reverse collapse (reduced → instant). A11y: `aria-expanded`, `aria-controls`.
- **Edit table**: `EditableCell` — text → editor
  (`Input`/`Select`/`NumberInput`), Enter save, Esc cancel, optional blur-save.
  `onCellChange(rowId, colId, value)`. A11y: cell `aria-label`, focus mgmt.
- **Row actions bar**: `RowActions` — `actionsPosition` `left`/`right`
  (default right); optional sticky col; header-cell placeholder. A11y: header
  cell with aria.
- **Search/filter**: `TableSearch` — toolbar input (custom `filterFn`, default
  prefix case-insensitive; `onSearchChange` controlled for server-side);
  `noResults` state. Selection not auto-disabled.

All optional — the base Table stays light without features.

#### Pagination (with preview)
`variant`: `page` · `simple`(prev/next+info). `totalPages` computed,
`pageSize`/`total`/current, `siblingPageCount`(1 default).
**Hover/focus preview**: `renderPagePreview(page)` → mini popover with first-3
rows/summary; lazy (only on hover/focus); `aria-describedby` to preview id;
does not steal focus; click still navigates directly. Motion: popover enter
`fast`/`enter`, exit `moderate`/`exit` (reduced instant). A11y:
`role="navigation"`+aria-label, `aria-current="page"`.
Uses the `PreviewPopover` primitive.

### Feedback (8)

#### Spinner
Sizes sm/md/lg, `color` currentColor. CSS rotate loop (`animation` in
styles.css, `prefers-reduced-motion` slow/instant — spinner is an indicator,
not decoration). A11y: `role="status"` + `aria-label`/visually-hidden
"Loading…", container `aria-busy`.

#### Progress (multimodal)
`variant`: `bar`(default determinate/indeterminate) · `pageTop` ·
`pageBottom` (fixed viewport, z-index overlay — page/section progress) ·
`mouse` (small **cursor-following ring**, fill tracks progress; optional % text;
reduced → ring still follows cursor, fill without animation) · `circle`
(static ring, `size`/`stroke`).
Motion: value transition `base`/`enter`; `mouse` same fill, cursor position
immediate (no lerp); reduced → all instant/static.
A11y: `role="progressbar"`, aria-valuenow; pageTop/Bottom keep info
off-screen-accessible; `mouse` + `aria-hidden` visual, value via aria.

#### Message / Alert
`tone`: `neutral` · `info` · `success` · `warning` · `danger`.
Icon+title+description+optional close. `position` in container:
`top-left/top-center/top-right/bottom-left/bottom-center/bottom-right`
(default `bottom-center`).
Motion: enter `fast`/`enter` fade+slight slide; exit on dismiss.
A11y: `role="alert"` / live region.

#### Tooltip
Trigger hover/focus. Delays: enter 400 (mouse) / 0 (kb), exit 100.
`position` with **anchor corner**: `topStart`/`topCenter`/`topEnd`(+bottom) —
default `topCenter`. Position + flip. Uses `PreviewPopover`.
Motion: fade+rise `fast`/`enter` (reduced instant). A11y: `role="tooltip"`
non-interactive, `aria-describedby`.

#### Toast
`variant`: success/danger/warning/info/neutral; `title`+`description`+
`action`+`onDismiss`; per-corner stack; `position`: 6 corners
(`top-left/top-center/top-right/bottom-left/bottom-center/bottom-right`);
auto-dismiss(4–6s, pause-on-hover).
Motion: enter `moderate`/`enter` slide-up fade, exit `emphatic`/`exit`
(reduced instant). A11y: `role="status"` / `role="alert"` for error, aria-live
polite.

#### Dialog
Structure: Root/Portal/Overlay/Content/Close/Title/Description. Variants
`center` · `bottomSheet`. Focus trap, Esc close, aria-modal, labelled-by.
Motion: overlay fade `moderate`/`enter`; content scale-in(0.97→1)+fade
`moderate`/`enter`; close `fast`/`exit` (reduced instant). Stack: 2 max,
aria-hide below. Uses `OverlayPrimitive`.

#### Drawer
Sides `left`/`right`(default)/`top`/`bottom`. Sizes xs/sm/md/lg. Structure like
Dialog. Motion: slide-in `moderate`/`enter` from side; overlay fade.
`OverlayPrimitive`.

#### Popover
Root/Trigger/Content(arrow). `trigger`: `click`/`hover`. Position+flip+boundary,
Esc/outside-click close, focus mgmt. Motion: fade+scale `fast`/`enter`, exit
`moderate`/`exit`. `OverlayPrimitive`.

### Navigation (4)

#### Tabs
`Tabs`(Root) · `List` · `Trigger` · `Panel`. Variants `underline`(default) ·
`pill` · `enclosed`. Orientation h/v. States: default/hover/active/selected/
focus/disabled.
Motion: **underline indicator sliding between tabs** `moderate`/`enter` (no
content cross-fade); reduced → instant switch.
A11y: `role="tablist"/tab/tabpanel`, `aria-selected/controls`, roving + arrows
(`useRovingFocus`), `aria-orientation`.

#### Accordion
`Accordion`(Root) · `Item` · `Header` · `Trigger` · `Content`. `type`:
`single`(default) · `multiple`.
Motion: content height reveal `moderate`/`enter`, reverse collapse; chevron
rotate `fast`; reduced instant.
A11y: `aria-expanded` (trigger), `aria-controls` (content), space/enter.

#### Menu / Dropdown
`Menu`(Root) · `Trigger` · `Content` · `Item` · `Separator` · `Label` ·
`SubMenu`(opt). Variants `default`(stacked) · `grid`(icon toolbar).
Motion: open `fast`/`enter` fade+scale, close `moderate`/`exit`, item hover
indicator `fast`; reduced instant.
A11y: `aria-haspopup`, keyboard (arrow + typeahead), focus return.
`OverlayPrimitive`-like dismiss.

#### Breadcrumb
`Breadcrumb` + `Item`(+`current`). `separator`: slash/chevron/dot.
A11y: `aria-label="Breadcrumb"`, `aria-current="page"`. No motion.

## Testing Strategy (per component)

Vitest + RTL + jsdom, colocated `*.test.tsx`:

- render default + every variant (table-driven; assert correct `xr-*` classes).
- states: disabled, loading, hover/active (where applicable), checked/selected,
  controlled vs uncontrolled.
- theming: Provider override → assert var (not hex).
- a11y: `getByRole`, aria assertions; `jest-axe` on the basic render of every
  component.
- reduced-motion: mock `matchMedia` reduce → assert `'1ms'` snap.
- overlay components: portal, focus trap, esc/outside-click, focus return.

Existing suites stay green (tokens, react, react-native, brand, styling).

## Storybook

- Folders follow category: `Actions/Button/*.stories.tsx`, `Data/Table/…`.
- Stories per component: Default + every variant + states + dark-mode +
  reduced-motion preview. A11y addon enabled.
- Decorator: `Provider` + `tokens.css` + `styles.css` (already exists; extended
  with dark toggle toolbar).
- **Playwright test-runner** promoted in Phase 5: basic interactions (open
  menu, toggle accordion, submit) as a visual regression gate.

## Documentation (VitePress)

- New guide per component: `guide/components/<Category>/<Name>.md` —
  purpose, API table (props), variants table, motion behavior, asChild usage,
  a11y notes, code examples.
- Update getting-started: how to use components + Provider + styling import.
- Sidebar: Components sub-group after Styling.

## Deferred (parked to later phases)

- **Native components** (`@xerena/react-native`) → Phase 6 (type-only API
  alignment where possible; no runtime cross-import).
- **i18n / RTL layout** (no infra; `ltr` default, `rtl` in button/icon CSS where
  easy).
- **Data virtualization** (large Table, large Combobox) — not built in.
- **Drag & drop** — no DnD components.
- **DatePicker/TimePicker/Calendar** — none; `NumberInput`/`Combobox`/`Field`
  cover common needs.
- **Theming persistence** (localStorage/`<html>`) — application
  responsibility; documented pattern.
- **Complex motion choreography** (page transitions, spring 3D) —
  micro only.

## Versioning & Release (end of Phase 5)

Once all components, testing, and docs are green AND **the whole-phase review
is approved**: all packages get version bumps + changesets, and a release is
performed (`@xerena/*@x.y.z` tags) as the phase's final step. This includes
`@xerena/styling` leaving `0.0.0`.

- Environment: per foundation (Node 22, pnpm 10, `NPM_TOKEN`).
- Merge quality gate: green typecheck+lint+test+build; changeset; stories;
  docs; minimum 1 approver.

## Decision History (brainstorm summary)

| # | Decision |
|---|---|
| 1 | Full kit ≈ 42 components; explicit variants per component |
| 2 | `asChild`/composition; headless built in-house (research Radix/Base UI) |
| 3 | Styling consumption: `xr-*` classes primary, `cssVar` for dynamic |
| 4 | Runtime theming: CSS vars in Provider (theme + toneOverrides) |
| 5 | Micro-motion: useMotion core + per-component transition map; motion = premium UX feel |
| 6 | One integral spec; plan split into many tasks |
| 7 | Extend generator: emit `--xr-semantic-*` + semantic classes |
| 8 | Status colors + dark palette added to tokens |
| 9 | Dark ONLY in semantic (colors stay light-only) |
| 10 | Multimodal Progress (bar/pageTop/pageBottom/mouse-ring/circle) |
| 11 | Tooltip/Message/Toast corner positioning |
| 12 | Table toolkit (checklist/sub-table/edit/frozen/row-actions/search+filter) |
| 13 | Pagination hover/focus preview popover |
| 14 | Bump + release at end of phase (after review) |