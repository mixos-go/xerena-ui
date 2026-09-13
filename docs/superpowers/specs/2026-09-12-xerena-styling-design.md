# Xerena — Styling Foundation (Phase 4)

**Date:** 2026-09-12
**Status:** Approved in design discussion (sections 1–3), pending written-spec review
**Predecessor spec:** `docs/superpowers/specs/2026-09-12-xerena-motion-design.md` (Phase 3)
**Depends on:** `@xerena/tokens` (foundation + brand + motion), `apps/docs`, `apps/storybook`
**Makes available to:** Phase 5 (Web Components), Phase 6 (Native Components)

## Context

Motion phase locked principle 4 (motion is identity) and delivered the `motion`
token namespace plus written discipline. The integration section of that spec
promised: *"Runtime hooks, motion primitives, and component-level motion arrive
in the Styling and Components phases. The `@xerena/tokens` `motion` namespace is
the binding contract for all of them — web, native, and documentation read the
same values."*

This phase (Styling) delivers the styling foundation — **the ergonomic layer
between design tokens and components** — in three layers, confirmed with the
user:

1. **Utility CSS generator** — token-driven `xr-*` utility classes for web.
2. **Style helper resolvers** — small, per-family typed helpers (raw values for
   native, CSS-ready strings for web).
3. **Motion primitives & hooks** — `useReducedMotion` and `useMotion` for web.

This is **not** a component phase: no business components are built here (Phase
5). `@xerena/react` and `@xerena/react-native` receive no changes. One package,
`@xerena/styling`, is introduced, plus one docs guide page.

## Package Architecture & Boundaries

New package `packages/styling` → published name `@xerena/styling` (version
`0.0.0`, first publish in Phase 7).

**Exports (`package.json`):**

| Export | Surface | Imports |
|---|---|---|
| `.` | style helpers (raw values + CSS string builders) | only `@xerena/tokens` |
| `./react` | hooks: `useReducedMotion`, `useMotion` | `react` + `.` helpers |
| `./styles.css` | generated utility stylesheet | — |

**Dependency graph** (extends foundation spec §3; every rule below is enforced
by ESLint `no-restricted-imports` in the package's eslint config):

```
@xerena/tokens        # zero-dep
   └── @xerena/styling   # root surface: zero react/DOM
          ├── (web)  @xerena/styling/react   # hooks — the ONLY entry that imports react
          ├── (web)  @xerena/react           # Phase 5 will also depend on styling/react
          └── (native) @xerena/react-native  # root surface only (pure resolvers)
```

- Files under `src/` that belong to the root surface **must not import `react`**
  or any DOM global. Only `src/react/*` (the `./react` entry) may.
- No runtime cross-import between `react` ↔ `react-native` (foundation §3).

**Build:** tsup (ESM + CJS + `.d.ts`), matching `@xerena/tokens`'s build
pipeline, plus a CSS generation step (`node scripts/generate-styles.mjs`) that
emits `dist/styles.css`. Nx target wiring ensures `@xerena/tokens` builds before
`@xerena/styling`.

**Testing:** vitest in-package (helpers, generator, hooks with jsdom + mocked
`matchMedia`). No changes to storybook test-runner or docs build beyond the new
guide page.

## Layer a — Utility CSS Generator

Build-time script `packages/styling/scripts/generate-styles.mjs`:

- Reads `@xerena/tokens` built `tokens.json` (resolved through the workspace via
  `createRequire`), the single source of truth.
- Emits `dist/styles.css`: one class per generated utility, deterministic
  ordering (JSON traversal order), header comment, `:root`-agnostic (classes
  reference the `--xr-*` vars from `@xerena/tokens/tokens.css`).
- Unitless token numbers are consumed via `calc(... * <unit>)` so overrides and
  dark mode continue to work through the CSS variable layer.

**Families and declarations:**

| Family | Classes | Declaration example |
|---|---|---|
| color | `xr-bg-{name}-{shade}`, `xr-text-{name}-{shade}`, `xr-border-{name}-{shade}` | `background-color: var(--xr-color-ember-600);` |
| spacing | `xr-p-{k}`, `xr-px-{k}`, `xr-py-{k}`, `xr-m-{k}`, `xr-mx-{k}`, `xr-my-{k}`, `xr-gap-{k}` | `padding: calc(var(--xr-spacing-4) * 1px);` |
| typography | `xr-font-family-{key}`, `xr-font-size-{variant}-{size}`, `xr-leading-{variant}-{size}`, `xr-font-weight-{variant}-{size}`, `xr-tracking-{variant}-{size}` | `font-size: calc(var(--xr-typography-body-md-fontSize) * 1px);` |
| elevation | `xr-elevation-{key}` | `box-shadow: var(--xr-elevation-raised);` |
| radius | `xr-radius-{key}` | `border-radius: calc(var(--xr-radius-lg) * 1px);` |
| motion | `xr-duration-{key}`, `xr-ease-{key}` | `transition-duration: calc(var(--xr-motion-duration-base) * 1ms);` / `transition-timing-function: cubic-bezier(var(--xr-motion-easing-standard));` |

Non-number families (color, elevation, fontFamily strings) reference the var
directly with no `calc`.

**Explicit scope boundary:** semantic colors are **not** part of this
generator. `semantic` is a TypeScript module in `@xerena/tokens` (not a
`tokens.json` key), and no `--xr-semantic-*` CSS variables exist yet. Semantic
utilities (`xr-bg-primary` etc.) and their CSS variable emission are deferred to
Phase 5 (components + theming), where the theming story is built. This keeps
`tokens.json` the sole source of truth for the generator.

## Layer b — Style Helper Resolvers

Root surface (`@xerena/styling`), split into small per-family modules following
the `motion.ts`/`typography.ts` typed-module pattern:

- `spacing.ts` — `spacingValue(key: SpaceKey) → number` (raw, for native).
- `radius.ts` — `radiusValue(key: RadiusKey) → number`.
- `motion.ts` — `durationValue(key: MotionDurationKey) → number` (milliseconds),
  `easingValue(key: MotionEasingKey) → Bezier`.
- `css.ts` — CSS string builders (pure, no DOM, safe on the root surface):
  - `cssVar(path)` — `'color.ember.600'` → `var(--xr-color-ember-600)`. The
    variable name mirrors the tokens generator's naming exactly: segments
    joined with `-`, each segment's original case preserved
    (`typography.body.md.fontSize` → `--xr-typography-body-md-fontSize`; no
    case flattening). `cssVar` is defined as "resolve a token path to the CSS
    variable that `@xerena/tokens/tokens.css` actually emits".
  - `css(path)` — CSS-ready value, applying unit inference:
    - spacing/radius paths → `calc(var(--xr-spacing-4) * 1px)`
    - typography `fontSize`/`lineHeight` → `calc(var(--xr-…) * 1px)`
    - motion duration → `calc(var(--xr-motion-duration-base) * 1ms)`
    - motion easing → `cubic-bezier(var(--xr-motion-easing-standard))`
    - color / elevation / fontFamily / letterSpacing values → bare `var(--xr-…)`
- `index.ts` — barrel with tight `keyof typeof` key types (pattern from
  `motion.ts`) and `export type Bezier = readonly [number, number, number, number]`.

Design rule: helpers **never duplicate token data**. Raw values come from
`@xerena/tokens`; the resolver layer only adds typed access, unit conversion
for web, and CSS-variable name building. This keeps one source of truth and makes
the native consumption path trivial (raw values only).

Known type boundary (same as the motion phase ruling): JSON-module arrays widen
to `number[]`, so `easingValue` performs one cast to the `Bezier` tuple type at
this module's boundary — the only cast in the resolver layer.

## Layer c — Motion Primitives & Hooks

Subpath `@xerena/styling/react` — the only entry that may import `react`; it
composes the `css` builders from the root surface.

- `useReducedMotion(): boolean`
  - System-driven: `window.matchMedia('(prefers-reduced-motion: reduce)')`,
    reactive to subsequent `change` events, SSR-safe (returns `false` where
    there is no `window`).
  - No Provider involvement; reduced motion has no context/value in this design
    (confirmed with user: system-driven).
- `useMotion(options?: { reducedMotion?: boolean }): { durations, easings, reduced }`
  - `durations: Record<MotionDurationKey, string>` — CSS-ready milliseconds
    (`'150ms'`). When reduced (system match OR the `options.reducedMotion`
    override), **every duration snaps to `'1ms'`** (the `instant` token) —
    exactly the pattern the Motion docs guide teaches.
  - `easings: Record<MotionEasingKey, string>` — `'cubic-bezier(0.2, 0, 0, 1)'`,
    built via `css('motion.easing.<key>')`. Easings are unaffected by reduced
    motion.
  - `reduced: boolean` — resolved reduced-motion state (system AND override).
  - Memoized; recompute only when the resolved state changes.
- `Provider` in `@xerena/react` is **unchanged** this phase.

## Testing Strategy

- `generate-styles.test.mjs` (vitest): emitted `styles.css` contains the expected
  classes per family; every declaration references `var(--xr-…)` or `calc`;
  deterministic output (running twice produces byte-identical content).
- `css.test.ts`: path parsing kebab-case, unit inference (px/ms/plain), edge
  cases (unknown/nested paths, deep typography paths).
- `useReducedMotion.test.tsx` (jsdom, mocked `matchMedia`): default false on
  SSR/no-window, reacts to system change, manual `reducedMotion` override.
- `useMotion.test.tsx` (jsdom, mocked `matchMedia`): snap-all-to-instant under
  reduced, easings stable, memoization returns stable references between
  renders with unchanged state.
- Existing suites must stay green (tokens, react, react-native, brand).

## Documentation

- New VitePress guide page `apps/docs/guide/styling.md` (titled "Styling"),
  sidebar entry after `Motion`:
  - Utility class reference (families table, live from the same values).
  - Helper API table (`cssVar`, `css`, per-family value resolvers) with
    cross-platform note (native consumer story in Phase 6).
  - Hooks usage (`useReducedMotion`, `useMotion`, reduced-motion behavior).
- No new storybook stories this phase (hooks are not components; the docs guide
  is the canonical example source — consistent with the walk-through pattern of
  foundation spec §6, where stories are a per-component shippable gate).

## Deferred (parked to later phases)

- **Semantic colors** — `--xr-semantic-*` CSS vars + semantic utility classes →
  Phase 5 (components + theming).
- **Native motion consumption** (`Easing.bezier(...motion.easing.X)`), native
  shadows/StyleSheet composition via `styles.css`-equivalent → Phase 6.
- **Utility on-demand purge tools** → only if a real consumption problem
  appears; full static stylesheet is tiny at current token volume.