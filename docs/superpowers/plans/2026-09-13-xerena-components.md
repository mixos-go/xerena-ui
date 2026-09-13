# Xerena Web Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the complete `@xerena/react` web component system — 42 components, status + dark token ramps, semantic CSS vars, runtime theming, headless primitives, tests, Storybook stories, docs — then version + release.

**Architecture:** Three headless layers under `@xerena/react/src` (Layer 1: Slot/asChild + class/ variant helpers; Layer 2: DOM-free state hooks; Layer 3: composition primitives incl. internal `OverlayPrimitive` + `PreviewPopover`), one shared component stylesheet (authored, token-var-driven, reduced-motion aware), runtime theming via Provider CSS vars, and a backward-compatible generator extension for `--xr-semantic-*` + semantic utility classes.

**Tech Stack:** TypeScript, React 19, Vite/vitest/tsup, jsdom, @testing-library/react, jest-axe, Nx, VitePress, Storybook (+ Playwright test-runner), changesets.

**Spec:** `docs/superpowers/specs/2026-09-13-xerena-components-design.md` — the plan argues from this spec.

## Global Constraints

- English only in all docs/commits (no Indonesian or mixed terms).
- Dependency boundaries (enforced by eslint `no-restricted-imports` in `packages/react/eslint.config.js`): `@xerena/react` may import only `@xerena/tokens`, `@xerena/styling` (`.` + `./react`), `react`, `react-dom`, `react-dom/client`. No third-party runtime UI library. MUST NOT import `@xerena/react-native`.
- `@xerena/styling` stays component-agnostic — no changes to its API surface.
- React `^19.0.0` peer dependency; pnpm 10 workspace; gate = lint + typecheck + test + build green per package (existing per-package scripts; root `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`).
- All motion values come from tokens (`--xr-motion-duration-*`, `--xr-motion-easing-*`); no magic numbers. Reduced motion honored globally via `@media (prefers-reduced-motion: reduce)` in the component stylesheet + `useReducedMotion` hooks.
- GitHub identity when committing: `git -c user.name="Xerena" -c user.email="xerena@local" commit -m ...`.
- Commit early, small, one logical unit per commit.

## Task Map (execution order)

| # | Task | Files (primary) |
|---|---|---|
| 1 | Tokens: status + dark color ramps | `packages/tokens/src/tokens.json`, `colors.ts`, `index.test.ts` |
| 2 | Tokens: semantic light/dark (JSON + TS) | `packages/tokens/src/semantic.json`, `semantic/index.ts`, tests |
| 3 | Tokens generator: `--xr-semantic-*` CSS vars | `packages/tokens/scripts/generate.mjs`, `dist/tokens.css` |
| 4 | Styling generator: semantic utility classes | `packages/styling/scripts/generate-styles.mjs`, styles test |
| 5 | React Layer 1: Slot, cn, useClassName, useVariant/useSize, styles.css | `packages/react/src/primitives/*` |
| 6 | React Layer 2: headless hooks | `packages/react/src/hooks/*` |
| 7 | React Layer 3: OverlayPrimitive + PreviewPopover | `packages/react/src/primitives/*` |
| 8 | Provider theming expansion + useTheme | `packages/react/src/primitives/Provider.tsx`, `ThemeContext.ts` |
| 9 | Typography: Text, Heading, Badge, Divider, Skeleton, Kbd | `components/typography/*` |
| 10 | Layout: Container, Stack, Grid | `components/layout/*` |
| 11 | Actions: Button, IconButton, Link, ButtonGroup | `components/actions/*` |
| 12 | Form base: Field, Input, Textarea, Select, Checkbox, Radio, Switch | `components/form/*` |
| 13 | Form advanced: Slider, Combobox, RadioGroup, CheckboxGroup, InputGroup, NumberInput | `components/form/*` |
| 14 | Surfaces: Card, Avatar | `components/surfaces/*` |
| 15 | Data: Table toolkit | `components/data/table/*` |
| 16 | Data: Pagination (preview popover) | `components/data/pagination/*` |
| 17 | Feedback: Spinner, Progress (multimodal) | `components/feedback/*` |
| 18 | Feedback: Message/Alert, Tooltip, Toast | `components/feedback/*` |
| 19 | Feedback: Dialog, Drawer, Popover | `components/feedback/*` |
| 20 | Navigation: Tabs, Accordion, Menu, Breadcrumb | `components/navigation/*` |
| 21 | Storybook stories for all components | `apps/storybook/stories/**` |
| 22 | Docs pages + sidebar + theming guide | `apps/docs/guide/**` |
| 23 | Version bump, changeset, release | root `package.json`, `.changeset/*` |

---

### Task 1: Tokens — status + dark color ramps

**Files:**
- Modify: `packages/tokens/src/tokens.json` (add `color.success|warning|danger|info` ramps; extend `color.ember`/`color.sand` with dark values under `color.ember`… no — keep ramps single-mode)
- Modify: `packages/tokens/src/colors.ts` (extend `ColorName`; dark values exposed via `darkColors`)
- Modify: `packages/tokens/src/index.test.ts` (assert new ramps + dark accessor)
- Modify: `packages/tokens/src/index.ts` / new `packages/tokens/src/dark.ts`

**Interfaces:**
- Produces: `colors.success[600]` etc.; new export `darkColors: Record<ColorName, Record<ColorShade, string>>`; `ColorName` union gains `'success'|'warning'|'danger'|'info'`.

**Design:** Ramps keep the existing 6-shade shape (`50|100|500|600|700|900`). Dark mode is NOT a second set of ramp keys — it is a separate `color.dark` object in `tokens.json` holding an ember + sand ramp tuned for dark surfaces, resolved via `darkColors`. Status colors are mode-independent primitives (their semantic usage darkens in dark mode only through `semantic`).

- [ ] **Step 1: Write the failing tests** — add to `packages/tokens/src/index.test.ts` (append a new `describe('status colors')` + `describe('darkColors')`):

```ts
describe('status colors', () => {
  it('exposes accessible status ramps', () => {
    expect(colors.success[600]).toBeDefined()
    expect(colors.warning[600]).toBeDefined()
    expect(colors.danger[600]).toBeDefined()
    expect(colors.info[600]).toBeDefined()
    expect(colors.success[50]).toBe('#eaf7ee')
    expect(colors.danger[600]).toBe('#c0392b')
  })
})

describe('darkColors', () => {
  it('exposes dark-tuned ember and sand ramps', () => {
    expect(darkColors.ember[900]).toBe('#f2b795')
    expect(darkColors.sand[900]).toBe('#f0ece3')
    expect(darkColors.sand[50]).toBe('#1b1712')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @xerena/tokens test`
Expected: FAIL — `success`/`darkColors` not defined.

- [ ] **Step 3: Add color ramps to `tokens.json`**

Inside the existing `"color"` object add these four families (mode-independent, accessible against sand backgrounds; 50 = surface tint, 600 = default, 700 = hover, 900 = contrast text):

```json
"success": {
  "50": "#eaf7ee",
  "100": "#c8eccf",
  "500": "#2e9e4f",
  "600": "#1f7a3d",
  "700": "#175f30",
  "900": "#0f3d1f"
},
"warning": {
  "50": "#fdf3e0",
  "100": "#fae2b0",
  "500": "#d99a06",
  "600": "#b37f05",
  "700": "#8a6004",
  "900": "#593d02"
},
"danger": {
  "50": "#fdeeec",
  "100": "#f8d2cc",
  "500": "#d64533",
  "600": "#c0392b",
  "700": "#992e21",
  "900": "#5e1c14"
},
"info": {
  "50": "#e9f4fd",
  "100": "#c8e3f9",
  "500": "#2e7cc4",
  "600": "#21639f",
  "700": "#1a4b79",
  "900": "#102f4d"
}
```

Then add a sibling `"dark"` object (dark-adapted ember + sand for dark surfaces — light on dark semantics):

```json
"dark": {
  "ember": {
    "50": "#3a2418",
    "100": "#523019",
    "500": "#d97a45",
    "600": "#da854f",
    "700": "#e49668",
    "900": "#f2b795"
  },
  "sand": {
    "50": "#1b1712",
    "100": "#262019",
    "500": "#9a9184",
    "600": "#aca496",
    "700": "#c6bead",
    "900": "#f0ece3"
  }
}
```

- [ ] **Step 4: Expose ramps in TS**

Modify `packages/tokens/src/colors.ts`:

```ts
import tokens from './tokens.json'

export type ColorShade = 50 | 100 | 500 | 600 | 700 | 900
export type ColorName = Exclude<keyof typeof tokens.color, 'dark'>

export const colors = tokens.color as Record<ColorName, Record<ColorShade, string>>
export const darkColors = tokens.color.dark as Record<'ember' | 'sand', Record<ColorShade, string>>
```

- [ ] **Step 5: Run tests to verify pass**

Run: `pnpm --filter @xerena/tokens test`
Expected: PASS (all assertions incl. the new status/dark ones).

- [ ] **Step 6: Lint + typecheck + commit**

Run: `pnpm --filter @xerena/tokens lint` and `pnpm --filter @xerena/tokens typecheck`
Expected: clean.
```bash
git add packages/tokens/src/tokens.json packages/tokens/src/colors.ts packages/tokens/src/index.test.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(tokens): add status and dark color ramps"
```

---

### Task 2: Tokens — semantic light/dark (JSON source + TS API)

**Files:**
- Create: `packages/tokens/src/semantic.json` (source of truth for generator + TS)
- Modify: `packages/tokens/src/semantic/index.ts` (light aliases flat, incl. new status aliases; `ColorShade`-safe)
- Modify: `packages/tokens/src/semantic/index.test.ts`
- Modify: `packages/tokens/src/index.ts`

**Interfaces:**
- Produces: `semantic.color` flat light aliases (existing shape preserved: `semantic.color.primary`, `.primaryHover`, `.background`, … plus `.surface`, `.surfaceHover`, `.border`, `.borderStrong`, `.text`, `.textMuted`, `.textOnStrong`, `.success`, `.successHover`, `.successText`, `.successSurface`, `.warning`, `.warningHover`, `.warningText`, `.warningSurface`, `.danger`, `.dangerHover`, `.dangerText`, `.dangerSurface`, `.info`, `.infoHover`, `.infoText`, `.infoSurface`), `semantic.spacing` unchanged. Also emits `semantic.json` shape consumed by generators: `{ light: {...}, dark: {...} }` where each value is `{ name: ColorName, shade: ColorShade }`.
- Consumes: `colors`, `darkColors` from Task 1.

**Design:** Alias resolution is a `{ name, shade }` pointer so the TS side resolves through `colors`/`darkColors` and generators emit the matching CSS var (`--xr-color-<name>-<shade>`). This keeps one source of truth with zero duplication.

- [ ] **Step 1: Write the failing tests** — append to `packages/tokens/src/semantic/index.test.ts`:

```ts
import { darkColors } from '../colors'

describe('semantic status aliases', () => {
  it('resolves new aliases to primitives', () => {
    expect(semantic.color.danger).toBe(colors.danger[600])
    expect(semantic.color.successSurface).toBe(colors.success[50])
    expect(semantic.color.dangerText).toBe(colors.danger[900])
    expect(semantic.color.surfaceHover).toBe(colors.ember[50])
    expect(semantic.color.textOnStrong).toBe(colors.sand[50])
  })
})

describe('semantic dark aliases', () => {
  it('resolves dark aliases through darkColors', () => {
    expect(semanticDark.color.background).toBe(darkColors.sand[50])
    expect(semanticDark.color.text).toBe(darkColors.sand[900])
    expect(semanticDark.color.primary).toBe(darkColors.ember[600])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @xerena/tokens test`
Expected: FAIL — `semanticDark` undefined, new aliases missing.

- [ ] **Step 3: Create `semantic.json`**

```json
{
  "light": {
    "primary": { "name": "ember", "shade": 600 },
    "primaryHover": { "name": "ember", "shade": 700 },
    "primaryActive": { "name": "ember", "shade": 900 },
    "background": { "name": "sand", "shade": 50 },
    "surface": { "name": "sand", "shade": 100 },
    "surfaceHover": { "name": "ember", "shade": 50 },
    "border": { "name": "sand", "shade": 100 },
    "borderStrong": { "name": "sand", "shade": 500 },
    "text": { "name": "sand", "shade": 900 },
    "textMuted": { "name": "sand", "shade": 500 },
    "textOnStrong": { "name": "sand", "shade": 50 },
    "success": { "name": "success", "shade": 600 },
    "successHover": { "name": "success", "shade": 700 },
    "successText": { "name": "success", "shade": 900 },
    "successSurface": { "name": "success", "shade": 50 },
    "warning": { "name": "warning", "shade": 600 },
    "warningHover": { "name": "warning", "shade": 700 },
    "warningText": { "name": "warning", "shade": 900 },
    "warningSurface": { "name": "warning", "shade": 50 },
    "danger": { "name": "danger", "shade": 600 },
    "dangerHover": { "name": "danger", "shade": 700 },
    "dangerText": { "name": "danger", "shade": 900 },
    "dangerSurface": { "name": "danger", "shade": 50 },
    "info": { "name": "info", "shade": 600 },
    "infoHover": { "name": "info", "shade": 700 },
    "infoText": { "name": "info", "shade": 900 },
    "infoSurface": { "name": "info", "shade": 50 }
  },
  "dark": {
    "primary": { "name": "ember", "shade": 600 },
    "primaryHover": { "name": "ember", "shade": 700 },
    "primaryActive": { "name": "ember", "shade": 900 },
    "background": { "name": "sand", "shade": 50 },
    "surface": { "name": "sand", "shade": 100 },
    "surfaceHover": { "name": "sand", "shade": 600 },
    "border": { "name": "sand", "shade": 100 },
    "borderStrong": { "name": "sand", "shade": 500 },
    "text": { "name": "sand", "shade": 900 },
    "textMuted": { "name": "sand", "shade": 500 },
    "textOnStrong": { "name": "sand", "shade": 900 },
    "success": { "name": "success", "shade": 500 },
    "successHover": { "name": "success", "shade": 600 },
    "successText": { "name": "success", "shade": 100 },
    "successSurface": { "name": "success", "shade": 50 },
    "warning": { "name": "warning", "shade": 500 },
    "warningHover": { "name": "warning", "shade": 600 },
    "warningText": { "name": "warning", "shade": 100 },
    "warningSurface": { "name": "warning", "shade": 50 },
    "danger": { "name": "danger", "shade": 500 },
    "dangerHover": { "name": "danger", "shade": 600 },
    "dangerText": { "name": "danger", "shade": 100 },
    "dangerSurface": { "name": "danger", "shade": 50 },
    "info": { "name": "info", "shade": 500 },
    "infoHover": { "name": "info", "shade": 600 },
    "infoText": { "name": "info", "shade": 100 },
    "infoSurface": { "name": "info", "shade": 50 }
  }
}
```

- [ ] **Step 4: Retype `semantic/index.ts`**

```ts
import { colors, darkColors, type ColorName, type ColorShade } from '../colors'
import { spacing } from '../spacing'
import alias from '../semantic.json'

export type SemanticAlias = keyof typeof alias.light
type AliasMap = Record<SemanticAlias, { name: ColorName; shade: ColorShade }>

function resolve(map: AliasMap, palettes: Record<ColorName, Record<ColorShade, string>>) {
  return Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, palettes[v.name as ColorName][v.shade as ColorShade]]),
  ) as Record<SemanticAlias, string>
}

export const semantic = {
  color: resolve(alias.light as AliasMap, colors),
  spacing: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
} as const

export const semanticDark = {
  color: resolve(alias.dark as AliasMap, { ...colors, ...darkColors } as Record<ColorName, Record<ColorShade, string>>),
} as const
```

- [ ] **Step 5: Update the old assertions** — the pre-existing test `expect(semantic.color.primary).toBe(colors.ember[600])` and the `semantic.spacing.md` check MUST still pass unchanged. Verify `packages/tokens/src/index.test.ts` status tests from Task 1 remain green.
- [ ] **Step 6: Run tests to verify pass**

Run: `pnpm --filter @xerena/tokens test` then `pnpm --filter @xerena/tokens lint && pnpm --filter @xerena/tokens typecheck`
Expected: all green.

- [ ] **Step 7: Commit**

```bash
git add packages/tokens/src/semantic.json packages/tokens/src/semantic packages/tokens/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(tokens): add semantic light/dark alias maps"
```

---

### Task 3: Tokens generator — emit semantic CSS vars

**Files:**
- Modify: `packages/tokens/scripts/generate.mjs`
- Modify: `packages/tokens/project.json` (build command stays `node scripts/generate.mjs`)

**Interfaces:**
- Produces: `dist/tokens.css` now also emits, inside `:root`: `--xr-semantic-color-<alias>: <hex>` after the primitive vars; and a new block `[data-xerena-theme='dark'] { --xr-semantic-color-<alias>: <dark hex> }`. Keeps the existing `--xr-*` primitive output byte-for-byte stable.
- Consumes: `src/tokens.json` + `src/semantic.json` (Task 2).

- [ ] **Step 1: Write the failing test** — new `packages/tokens/scripts/generate.test.mjs`:

```js
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('tokens.css semantic output', () => {
  const css = readFileSync(resolve(import.meta.dirname, '../dist/tokens.css'), 'utf8')
  it('emits light semantic vars in :root', () => {
    expect(css).toContain('--xr-semantic-color-primary: ')
    expect(css).toContain('--xr-semantic-color-danger: ')
  })
  it('emits dark semantic vars scoped to dark attribute', () => {
    expect(css).toContain("[data-xerena-theme='dark']")
    expect(css.slice(css.indexOf("data-xerena-theme='dark'"))).toContain('--xr-semantic-color-primary: ')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @xerena/tokens build && pnpm --filter @xerena/tokens test`
Expected: FAIL — semantic vars absent.

- [ ] **Step 3: Extend `generate.mjs`**

Replace the tail of `generate.mjs` (from the `import` block through the existing `if (isMain)` block) with:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'))
const semantic = JSON.parse(readFileSync(resolve(root, 'src/semantic.json'), 'utf8'))

function toCssVars(obj, prefix = '--xr') {
  const lines = []
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      lines.push(`${prefix}-${key}: ${value.join(', ')};`)
    } else if (value && typeof value === 'object') {
      lines.push(toCssVars(value, `${prefix}-${key}`))
    } else {
      lines.push(`${prefix}-${key}: ${value};`)
    }
  }
  return lines.join('\n  ')
}

export { toCssVars }

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  const lightLines = [':root {', `  ${toCssVars(tokens)}`]
  for (const [alias, ref] of Object.entries(semantic.light)) {
    lightLines.push(`  --xr-semantic-color-${alias}: ${tokens.color[ref.name][ref.shade]};`)
  }
  lightLines.push('}')
  const darkLines = [`[data-xerena-theme='dark'] {`]
  for (const [alias, ref] of Object.entries(semantic.dark)) {
    const resolved = tokens.color.dark[ref.name]?.[ref.shade] ?? tokens.color[ref.name][ref.shade]
    darkLines.push(`  --xr-semantic-color-${alias}: ${resolved};`)
  }
  darkLines.push('}')
  writeFileSync(resolve(root, 'dist/tokens.css'), `${lightLines.join('\n')}\n${darkLines.join('\n')}\n`)
  writeFileSync(resolve(root, 'dist/tokens.json'), JSON.stringify(tokens, null, 2))
  console.log('generated dist/tokens.css and dist/tokens.json')
}
```

Note: `semantic.dark` references `name: 'success'` (mode-independent status ramp), which has no `dark` sub-object, so the nullish fallback `tokens.color[ref.name][ref.shade]` resolves it from the base ramp; ember/sand dark refs resolve from `tokens.color.dark`.

```js
if (isMain) {
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  const lightLines = []
  lightLines.push(':root {')
  lightLines.push(`  ${toCssVars(tokens)}`)
  for (const [alias, ref] of Object.entries(semantic.light)) {
    lightLines.push(`  --xr-semantic-color-${alias}: ${palette[ref.name][ref.shade]};`)
  }
  lightLines.push('}')
  const darkLines = []
  darkLines.push(`[data-xerena-theme='dark'] {`)
  for (const [alias, ref] of Object.entries(semantic.dark)) {
    const resolved = palette.dark[ref.name]?.[ref.shade] ?? palette[ref.name][ref.shade]
    darkLines.push(`  --xr-semantic-color-${alias}: ${resolved};`)
  }
  darkLines.push('}')
  writeFileSync(resolve(root, 'dist/tokens.css'), `${lightLines.join('\n')}\n${darkLines.join('\n')}\n`)
  writeFileSync(resolve(root, 'dist/tokens.json'), JSON.stringify(tokens, null, 2))
  console.log('generated dist/tokens.css and dist/tokens.json')
}
```

(`semantic.dark` references `name: 'success'` — not present in `palette.dark` — so `palette[ref.name][ref.shade]` resolves the mode-independent status ramp.)

- [ ] **Step 4: Re-run test to verify pass**

Run: `pnpm --filter @xerena/tokens build && pnpm --filter @xerena/tokens test`
Expected: PASS; existing visual primitives unchanged.

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/scripts/generate.mjs packages/tokens/scripts/generate.test.mjs
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(tokens): emit semantic css vars for light and dark"
```

---

### Task 4: Styling generator — semantic utility classes

**Files:**
- Modify: `packages/styling/scripts/generate-styles.mjs`
- Create: `packages/styling/scripts/generate-styles.test.mjs`

**Interfaces:**
- Produces: in `dist/styles.css` (generated) the semantic utilities `xr-bg-<alias>`, `xr-text-<alias>`, `xr-border-<alias>` for every semantic alias, each pointing at the CSS var (theme-aware, no hex). Existing `xr-*` output unchanged.
- Consumes: `@xerena/tokens` `semantic.json` via a new `resolveSemanticPath` helper + existing `resolveTokensPath`.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { buildStylesheet } from './generate-styles.mjs'

describe('semantic utilities', () => {
  const tokens = { color: {}, spacing: {}, typography: { fontFamily: {}, body: {}, display: {}, mono: {} }, elevation: {}, radius: {}, motion: { duration: {}, easing: {} }, dark: {} }
  const css = buildStylesheet(tokens, { semantic: { light: { primary: {}, danger: {} } } })
  it('emits theme-aware semantic utilities', () => {
    expect(css).toContain('.xr-bg-primary { background-color: var(--xr-semantic-color-primary); }')
    expect(css).toContain('.xr-text-danger { color: var(--xr-semantic-color-danger); }')
    expect(css).toContain('.xr-border-danger { border-color: var(--xr-semantic-color-danger); }')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @xerena/styling test`
Expected: FAIL — semantic utilities missing.

- [ ] **Step 3: Modify `buildStylesheet`**

Add a second parameter and a semantic loop:

```js
export function buildStylesheet(tokens, semanticMap = null) {
  const lines = []
  // ... existing blocks unchanged ...
  if (semanticMap) {
    for (const alias of Object.keys(semanticMap.light)) {
      const v = `var(--xr-semantic-color-${alias})`
      add(`xr-bg-${alias}`, `background-color: ${v}`)
      add(`xr-text-${alias}`, `color: ${v}`)
      add(`xr-border-${alias}`, `border-color: ${v}`)
    }
  }
  return `${lines.join('\n')}\n`
}
```

And the `isMain` block loads both token + semantic sources:

```js
export function resolveSemanticPath(require) {
  return resolve(dirname(require.resolve('@xerena/tokens/package.json')), 'src/semantic.json')
}

if (isMain) {
  const require = createRequire(import.meta.url)
  const tokens = JSON.parse(readFileSync(resolveTokensPath(require), 'utf8'))
  const semantic = JSON.parse(readFileSync(resolveSemanticPath(require), 'utf8'))
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  writeFileSync(resolve(root, 'dist/styles.css'), buildStylesheet(tokens, semantic))
  console.log('generated dist/styles.css')
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `pnpm --filter @xerena/styling build && pnpm --filter @xerena/styling test`
Expected: PASS. Verify `rg 'xr-bg-primary' packages/styling/dist/styles.css` finds output.

- [ ] **Step 5: Commit**

```bash
git add packages/styling/scripts/generate-styles.mjs packages/styling/scripts/generate-styles.test.mjs
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(styling): generate semantic utility classes"
```

---

### Task 5: React Layer 1 — Slot, cn, useClassName, variant/size helpers + base.css expansion

**Files:**
- Create: `packages/react/src/primitives/Slot.tsx`, `packages/react/src/primitives/cn.ts`, `packages/react/src/primitives/useClassName.ts`, `packages/react/src/primitives/variants.ts`
- Modify: `packages/react/src/primitives/index.ts` (new barrel for primitives), `packages/react/src/index.ts` (re-export primitives + hooks), `packages/react/src/styles/base.css` (component base + reduced-motion global block)
- Test: per-file `.test.tsx`

**Interfaces:**
- Produces, exported from `@xerena/react`:
  - `Slot: React.FC<{ children: ReactElement; [k: string]: unknown }>` — merges parent props onto a single child element (Radix-style `asChild`).
  - `cn(...parts: Array<string | false | null | undefined>): string`
  - `useClassName(props, variantsClass?)` — returns merged className (variants applied when no explicit override).
  - `useVariant`, `useSize` (Task 11+ components) drive `xr-<component> xr-<component>--<variant> xr-<component>--<size>` naming.
- Consumes: react core only.

- [ ] **Step 1: Write the failing tests**

`cn.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { cn } from './cn'
describe('cn', () => {
  it('joins truthy parts and skips falsy', () => {
    expect(cn('a', false, 'b', null, undefined, '')).toBe('a b')
  })
})
```

`Slot.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Slot } from './Slot'
describe('Slot', () => {
  it('merges props onto child element', () => {
    render(<Slot as="button" data-testid="slot" aria-label="hi"><span>go</span></Slot>)
    const el = screen.getByTestId('slot')
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveAttribute('aria-label', 'hi')
  })
  it('combines className from both parent and child', () => {
    render(<Slot className="xr-parent"><button className="xr-child">b</button></Slot>)
    expect(screen.getByRole('button')).toHaveClass('xr-parent', 'xr-child')
  })
})
```

`useClassName.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { useClassName } from './useClassName'
const C = (p: { className?: string }) => <div data-testid="x" className={useClassName(p)} />
it('uses explicit className when provided', () => {
  render(<C className="mine" />)
  expect(document.querySelector('[data-testid="x"]')).toHaveClass('mine')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @xerena/react test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `cn.ts`, `Slot.tsx`, `useClassName.ts`**

```ts
// cn.ts
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
```

```tsx
// Slot.tsx
import { Children, cloneElement, isValidElement } from 'react'

export interface SlotProps {
  children: React.ReactNode
  [key: string]: unknown
}

export function Slot({ children, ...rest }: SlotProps) {
  const child = Children.only(children)
  if (!isValidElement(child)) return child as React.ReactNode
  const { className: childClassName, ...childRest } = child.props as Record<string, unknown>
  const merged = {
    ...childRest,
    ...rest,
    className: [rest.className, childClassName].filter(Boolean).join(' '),
  }
  return cloneElement(child, merged)
}
```

```ts
// useClassName.ts
import { useMemo } from 'react'
import { cn } from './cn'

export function useClassName(
  props: { className?: string },
  variantClasses?: Array<string | false | null | undefined>,
): string {
  return useMemo(() => cn(props.className, ...(variantClasses ?? [])), [props.className, variantClasses])
}
```

- [ ] **Step 4: Add variant/size naming helper**

`variants.ts`:
```ts
export type VariantName = string
export function variantClass(base: string, variant?: string): string {
  return variant ? `${base}--${variant}` : base
}
export function sizeClass(base: string, size?: string): string {
  return size ? `${base}--${size}` : base
}
```

- [ ] **Step 5: Expand `base.css` — component foundation + reduced motion**

Append to `packages/react/src/styles/base.css`:
```css
@layer xerena-components {
  .xr-focus-ring { outline: none; }
  .xr-focus-ring:focus-visible { box-shadow: 0 0 0 3px var(--xr-semantic-color-primary); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```
(All later component stylesheet insertions happen inside `@layer xerena-components`; the reduced-motion block is project-wide and overrides every token-driven transition automatically.)

- [ ] **Step 6: Wire barrels**

`packages/react/src/primitives/index.ts`:
```ts
export * from './Slot'
export * from './cn'
export * from './useClassName'
export * from './variants'
export * from './Provider'
export * from './ThemeContext'
export * from './OverlayPrimitive'
export * from './PreviewPopover'
export * from '../hooks'
```
`packages/react/src/index.ts`:
```ts
export * from './primitives'
```

- [ ] **Step 7: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add headless layer 1 primitives"
```

---

### Task 6: React Layer 2 — headless hooks

**Files:**
- Create: `packages/react/src/hooks/index.ts` + one file per hook under `packages/react/src/hooks/`
- Test: per-hook `*.test.{ts,tsx}` (jsdom)

**Interfaces:** (produced; later tasks consume)
- `useControllableState<T>(value?: T, defaultValue?: T, onChange?: (v: T) => void): [T, (v: T) => void]`
- `useFocusRing(): { focusWithin: boolean; onFocus: () => void; onBlur: () => void }`
- `useDisabled(disabled?: boolean): { disabled: boolean; 'aria-disabled': boolean | undefined }`
- `usePress(): { pressed: boolean; onPointerDown: () => void; onPointerUp: () => void; onPointerLeave: () => void }`
- `useFocusTrap(open: boolean, deps: unknown[]): React.RefObject<HTMLElement | null>`
- `useDismissable(open: boolean, onEscape: () => void, onOutside: () => void): { ref }`
- `useRovingFocus(firstRef): { handleKeydown: (e: React.KeyboardEvent) => void; rovingRef }`
- `useReducedMotionSync(): boolean` (aliases `@xerena/styling`'s `useReducedMotion` re-export)
- `useMediaQuery(query: string): boolean`

- [ ] **Step 1: Write the failing tests** (representative set):

`useControllableState.test.tsx`:
```tsx
import { act, renderHook } from '@testing-library/react'
import { useControllableState } from './useControllableState'
describe('useControllableState', () => {
  it('is uncontrolled with defaultValue', () => {
    const { result } = renderHook(() => useControllableState(undefined, 'a'))
    expect(result.current[0]).toBe('a')
    act(() => result.current[1]('b'))
    expect(result.current[0]).toBe('b')
  })
  it('is controlled when value provided', () => {
    const { result } = renderHook(() => useControllableState('x', 'a'))
    act(() => result.current[1]('y'))
    expect(result.current[0]).toBe('x')
  })
  it('fires onChange only for controlled', () => {
    const on = vi.fn()
    const { result } = renderHook(() => useControllableState('x', undefined, on))
    act(() => result.current[1]('y'))
    expect(on).toHaveBeenCalledWith('y')
  })
})
```

`usePress.test.tsx`:
```tsx
import { act, renderHook } from '@testing-library/react'
import { usePress } from './usePress'
describe('usePress', () => {
  it('tracks active pointer state', () => {
    const { result } = renderHook(() => usePress())
    expect(result.current.pressed).toBe(false)
    act(() => result.current.onPointerDown())
    expect(result.current.pressed).toBe(true)
    act(() => result.current.onPointerUp())
    expect(result.current.pressed).toBe(false)
  })
})
```

`useMediaQuery.test.tsx`:
```tsx
import { renderHook } from '@testing-library/react'
import { useMediaQuery } from './useMediaQuery'
describe('useMediaQuery', () => {
  it('reads matchMedia with change listener', () => {
    const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 600px)'))
    expect(result.current).toBe(false)
    ;(window.matchMedia as unknown as { listeners: Array<() => void> }).listeners?.forEach((l) => l())
    expect(result.current).toBe(false)
    unmount()
  })
})
```

`useFocusTrap.test.tsx` (smoke — asserts the hook returns a ref and cycles focus when tabbing beyond the last focusable):
```tsx
import { createElement, useRef } from 'react'
import { render } from '@testing-library/react'
import { useFocusTrap } from './useFocusTrap'
describe('useFocusTrap', () => {
  it('focuses the first element when opened', () => {
    const Probe = () => {
      const ref = useFocusTrap(true)
      return (
        <div ref={ref}>
          <button>A</button>
          <button>B</button>
        </div>
      )
    }
    const { getByRole } = render(createElement(Probe))
    expect(document.activeElement).toBe(getByRole('button', { name: 'A' }))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @xerena/react test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the hooks**

```ts
// useControllableState.ts
import { useCallback, useState } from 'react'

export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | undefined,
  onChange?: (v: T) => void,
): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const set = useCallback(
    (v: T) => {
      if (!isControlled) setInternal(v)
      onChange?.(v as T)
    },
    [isControlled, onChange],
  )
  return [current as T, set]
}
```

```ts
// usePress.ts
import { useCallback, useState } from 'react'
export function usePress() {
  const [pressed, setPressed] = useState(false)
  const onPointerDown = useCallback(() => setPressed(true), [])
  const onPointerUp = useCallback(() => setPressed(false), [])
  const onPointerLeave = useCallback(() => setPressed(false), [])
  return { pressed, onPointerDown, onPointerUp, onPointerLeave }
}
```

```ts
// useFocusRing.ts
import { useCallback, useState } from 'react'
export function useFocusRing() {
  const [focusWithin, setFocusWithin] = useState(false)
  const onFocus = useCallback(() => setFocusWithin(true), [])
  const onBlur = useCallback(() => setFocusWithin(false), [])
  return { focusWithin, onFocus, onBlur }
}
```

```ts
// useDisabled.ts
export function useDisabled(disabled?: boolean) {
  return disabled ? { disabled: true, 'aria-disabled': true as const } : { disabled: false, 'aria-disabled': undefined }
}
```

```ts
// useMediaQuery.ts
import { useEffect, useState } from 'react'
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])
  return matches
}
```

```ts
// useFocusTrap.ts
import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

function focusables(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((e): e is HTMLElement => !(e as HTMLElement).hasAttribute('disabled')) as HTMLElement[]
}

export function useFocusTrap(open: boolean): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!open) return
    const el = ref.current
    if (!el) return
    const items = focusables(el)
    const first = items[0]
    const last = items[items.length - 1]
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [open, ref.current])
  return ref
}
```

- [ ] **Step 5: Implement remaining hooks + barrel**

```ts
// useRovingFocus.ts
import { useRef } from 'react'
import type { KeyboardEvent, RefObject } from 'react'
export function useRovingFocus(): {
  handleKeydown: (e: KeyboardEvent<HTMLElement>, items: HTMLElement[]) => void
  rovingRef: RefObject<HTMLElement | null>
} {
  const rovingRef = useRef<HTMLElement | null>(null)
  const handleKeydown = (e: KeyboardEvent<HTMLElement>, items: HTMLElement[]) => {
    const index = items.indexOf(e.currentTarget as HTMLElement)
    let next = -1
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = index + 1
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = items.length - 1
    if (next >= 0 && next < items.length) {
      e.preventDefault()
      items[next]?.focus()
    }
  }
  return { handleKeydown, rovingRef }
}
```

```ts
// useDismissable.ts
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
export function useDismissable(
  open: boolean,
  onEscape: () => void,
  onOutside: () => void,
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
    }
    const onPointer = (e: PointerEvent) => {
      const el = ref.current
      if (el && e.target instanceof Node && !el.contains(e.target)) onOutside()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, onEscape, onOutside])
  return ref
}
```

```ts
// useReducedMotionSync.ts
export { useReducedMotion as useReducedMotionSync } from '@xerena/styling/react'
```

```ts
// hooks/index.ts
export * from './useControllableState'
export * from './useFocusRing'
export * from './useDisabled'
export * from './usePress'
export * from './useFocusTrap'
export * from './useDismissable'
export * from './useRovingFocus'
export * from './useReducedMotionSync'
export * from './useMediaQuery'
```

Note: `@xerena/react` already depends on `@xerena/styling` in the plan's dependency graph (spec section 1). Add `"@xerena/styling": "workspace:*"` to `packages/react/package.json` `dependencies`.

- [ ] **Step 6: Verify + commit**

Run: `pnpm install && pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green (matchMedia mock may be needed in `vitest.setup.ts`; add if jsdom lacks it).
```bash
git add packages/react/src/hooks packages/react/package.json pnpm.lock
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add headless layer 2 hooks"
```

---

### Task 7: React Layer 3 — OverlayPrimitive + PreviewPopover

**Files:**
- Create: `packages/react/src/primitives/OverlayPrimitive.tsx`, `packages/react/src/primitives/PreviewPopover.tsx`, tests
- Modify: `packages/react/src/primitives/index.ts` (export new)

**Interfaces:**
- `OverlayPrimitive` (internal, NOT exported to consumers):

```ts
interface OverlayPrimitiveProps {
  open: boolean
  onClose: () => void
  labeledBy?: string
  focusTrap?: boolean
  children: React.ReactNode
}
```
  Renders: whenever `open`, a `createPortal`-ed div with class `xr-overlay xr-overlay--fixed` containing `children`; handles Escape + outside-pointerdown via `useDismissable`, focus trap via `useFocusTrap` (when `focusTrap`), `aria-modal="true"` + `aria-labelledby`.
- `PreviewPopover` (internal): `{ open, label, anchor: HTMLElement | null, children }` → renders a positioned/labelled popover used by Tooltip + Pagination preview.
- Consumes: hooks from Task 6, `useReducedMotionSync`, tokens motion vars via `css`/`cssVar` from `@xerena/styling`.

- [ ] **Step 1: Write failing tests**

`OverlayPrimitive.test.tsx` (uses `document.body`; portal):
```tsx
import { render, screen } from '@testing-library/react'
import { OverlayPrimitive } from './OverlayPrimitive'
describe('OverlayPrimitive', () => {
  it('portals children into body when open and removes on close', () => {
    const { rerender } = render(
      <OverlayPrimitive open onClose={() => {}}><div>overlay</div></OverlayPrimitive>,
    )
    expect(screen.getByText('overlay')).toBeInTheDocument()
    rerender(<OverlayPrimitive open={false} onClose={() => {}}><div>overlay</div></OverlayPrimitive>)
    expect(screen.queryByText('overlay')).not.toBeInTheDocument()
  })
  it('calls onClose on Escape', () => {
    const close = vi.fn()
    render(<OverlayPrimitive open onClose={close}><div>o</div></OverlayPrimitive>)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(close).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify fail**

Run: `pnpm --filter @xerena/react test`
Expected: FAIL.

- [ ] **Step 3: Implement**

```tsx
// OverlayPrimitive.tsx
import { createPortal } from 'react-dom'
import { useMemo } from 'react'
import { useDismissable, useFocusTrap } from '../hooks'
import type { ReactNode } from 'react'

export interface OverlayPrimitiveProps {
  open: boolean
  onClose: () => void
  labeledBy?: string
  focusTrap?: boolean
  children: ReactNode
}

export function OverlayPrimitive({ open, onClose, labeledBy, focusTrap = false, children }: OverlayPrimitiveProps) {
  const trapRef = useFocusTrap(open && focusTrap)
  const dismissRef = useDismissable(open, onClose, onClose)
  const mergedRef = useMemo(() => (el: HTMLDivElement | null) => {
    trapRef.current = el
    dismissRef.current = el
  }, [trapRef, dismissRef])

  if (!open) return null
  return createPortal(
    <div
      ref={mergedRef}
      className="xr-overlay xr-overlay--fixed"
      role="presentation"
      aria-modal={focusTrap ? true : undefined}
      aria-labelledby={labeledBy}
      data-xerena-overlay=""
    >
      {children}
    </div>,
    document.body,
  )
}
```

- [ ] **Step 4: Add `PreviewPopover`**

```tsx
// PreviewPopover.tsx
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ccsVar } from '@xerena/styling'   // fix below
export interface PreviewPopoverProps {
  open: boolean
  label: string
  anchor: HTMLElement | null
  preferred?: 'top' | 'bottom'
  children: ReactNode
}
export function PreviewPopover({ open, label, anchor, preferred = 'bottom', children }: PreviewPopoverProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  useEffect(() => {
    if (!open || !anchor) { setCoords(null); return }
    const r = anchor.getBoundingClientRect()
    const pad = 6
    setCoords(
      preferred === 'bottom'
        ? { top: r.bottom + pad, left: r.left + r.width / 2 }
        : { top: r.top - pad, left: r.left + r.width / 2 },
    )
  }, [open, anchor, preferred])
  if (!open || !coords) return null
  return (
    <div
      role="tooltip"
      aria-label={label}
      className="xr-preview-popover"
      style={{ position: 'absolute', top: coords.top, left: coords.left, transform: 'translateX(-50%)' }}
      data-xerena-preview=""
    >
      {children}
    </div>
  )
}
```

Note: `ccsVar` is a typo — import is `import { cssVar } from '@xerena/styling'` and it is used inside the tooltip style if needed; simplest is to remove the import entirely here (positioning via inline style) — the Tooltip component uses `cssVar` directly.

- [ ] **Step 5: Style the primitives in `base.css`** (append inside `@layer xerena-components`):

```css
.xr-overlay { position: fixed; inset: 0; z-index: 40; }
.xr-overlay * { pointer-events: auto; }
.xr-preview-popover { z-index: 50; background: var(--xr-semantic-color-surface); color: var(--xr-semantic-color-text); border: 1px solid var(--xr-semantic-color-border); border-radius: calc(var(--xr-radius-sm) * 1px); padding: calc(var(--xr-spacing-1) * 1px) calc(var(--xr-spacing-2) * 1px); box-shadow: var(--xr-elevation-md); font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); }
```

- [ ] **Step 6: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/primitives packages/react/src/styles/base.css
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add overlay and preview popover primitives"
```

---

### Task 8: Provider theming expansion + semantic accessors

**Files:**
- Modify: `packages/react/src/primitives/Provider.tsx`, `packages/react/src/primitives/ThemeContext.ts`
- Modify: `packages/react/src/primitives/Provider.test.tsx`

**Interfaces:**
- Consumes: `semantic`/`semanticDark` from `@xerena/tokens`, `cssVar` from `@xerena/styling`.
- Produces:
  - `ProviderProps = { children; theme: XTheme }` (breaking) where `XTheme = { mode: ColorMode; semantic?: Record<SemanticAlias, string> }` (per-mode override).
  - `useTheme(): { theme, setTheme, semantic }` — semantic returns the fully resolved alias value map for the current mode.
  - Dark scope: `[data-xerena-theme='dark']` virtual DOM overlay (append divs for both scopes when dark, or rely on provider).

- [ ] **Step 1: Write the failing test**

```tsx
it('provides semantic override for dark mode', () => {
  render(<Provider theme={{ mode: 'dark' }}>x</Provider>)
  expect(document.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
})
```

- [ ] **Step 2: Run to verify fail**

Run: `pnpm --filter @xerena/react test`
Expected: FAIL (existing test uses `initialMode`, which will be removed).

- [ ] **Step 3: Update `ThemeContext.ts`**

```ts
import { createContext, useContext } from 'react'
import type { SemanticAlias } from '@xerena/tokens'

export type ColorMode = 'light' | 'dark'
export interface XTheme {
  mode: ColorMode
  semantic?: Partial<Record<SemanticAlias, string>>
}
export interface ThemeContextValue {
  theme: XTheme
  setTheme: (theme: XTheme) => void
  semantic: Record<SemanticAlias, string>
}
export const ThemeContext = createContext<ThemeContextValue | null>(null)
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx === null) throw new Error('useTheme must be used within <Provider>')
  return ctx
}
```

- [ ] **Step 4: Update `Provider.tsx`**

```tsx
import { cssVar } from '@xerena/styling'
import { semantic as lightSemantic, semanticDark } from '@xerena/tokens'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext, type ThemeContextValue, type XTheme } from './ThemeContext'
import type { SemanticAlias } from '@xerena/tokens'

export interface ProviderProps {
  children: ReactNode
  theme: XTheme
}

export function Provider({ children, theme }: ProviderProps) {
  const [stored, setStored] = useState<XTheme>(theme)
  const activeTheme = theme.mode === stored.mode ? { ...stored, ...theme } : stored

  const value = useMemo<ThemeContextValue>(() => {
    const base = activeTheme.mode === 'dark' ? semanticDark.color : lightSemantic.color
    const semantic = Object.fromEntries(
      (Object.keys(base) as SemanticAlias[]).map((alias) => [
        alias,
        activeTheme.semantic?.[alias] ?? (cssVar(`semantic.color.${alias}`) as string),
      ]),
    ) as Record<SemanticAlias, string>
    return { theme: activeTheme, setTheme: (t) => setStored(t), semantic }
  }, [activeTheme])

  return (
    <ThemeContext.Provider value={value}>
      <div data-xerena-theme={value.theme.mode}>{children}</div>
    </ThemeContext.Provider>
  )
}
```

- [ ] **Step 5: Fix existing Provider tests** — replace `initialMode` usage with `theme={{ mode: 'light' }}`.

- [ ] **Step 6: Also update Storybook preview decorator** — `apps/storybook/.storybook/preview.tsx` uses `<Provider>` with no props; add `theme={{ mode: 'light' }}` there.

- [ ] **Step 7: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck && pnpm --filter storybook build`
Expected: green.
```bash
git add packages/react/src apps/storybook/.storybook/preview.tsx
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): expand provider theming with semantic overrides"
```

---

## Component Tasks

All component tasks follow the same skeleton. Each produces one or more files under
`packages/react/src/components/<Category>/<Name>/` plus tests, styled via the `base.css`
(component layer) added in Task 5, exporting through barrels, and finishing with the standard
verification + commit. Every component must:

- accept `className` (merged via `useClassName`), `asChild` where the spec lists it,
- render `xr-*` classes and read colors via `var(--xr-semantic-color-*)`,
- be reduced-motion safe (global CSS handles most; JS-driven motions check
  `useReducedMotionSync()`),
- include `role`/`aria-*` per its spec line.

The class naming convention throughout:

```
xr-<component>
xr-<component>--<variant>
xr-<component>--<size>
xr-<component>__<part>      (internal part, e.g. xr-dialog__overlay)
```

Tasks 9–20 define the 42 components (spec-listed). Each task lists exact public API, the
`base.css` block (inside `@layer xerena-components`), the component implementation, and the
test file. The pattern is identical across components — repeat it fully rather than
abstracting.

---

### Task 9: Typography — Text, Heading, Badge, Divider, Skeleton, Kbd

**Files:**
- Create: `packages/react/src/components/typography/Text.tsx`, `Heading.tsx`, `Badge.tsx`, `Divider.tsx`, `Skeleton.tsx`, `Kbd.tsx`
- Create: `packages/react/src/components/typography/index.ts`
- Modify: `packages/react/src/index.ts`
- Test: `text.test.tsx`, `heading.test.tsx`, `badge.test.tsx`, `divider.test.tsx`, `skeleton.test.tsx`, `kbd.test.tsx`

**Interfaces (produced):**
- `Text: { variant?: 'body'|'muted'|'strong'|'error'; size?: 'sm'|'md'|'lg'; font?: 'body'|'mono'; asChild?: boolean }`
- `Heading: { as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'}`
- `Badge: { tone?: 'neutral'|'info'|'success'|'warning'|'danger'|'brand'; size?: 'sm'|'md' }`
- `Divider: { orientation?: 'horizontal'|'vertical'; variant?: 'solid'|'dashed'; label?: string }`
- `Skeleton: { shape?: 'line'|'circle'|'rect'|'text'; width?: number|string; height?: number|string }`
- `Kbd: {}`

- [ ] **Step 1: Write failing tests**

`text.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Text } from './Text'
describe('Text', () => {
  it('renders body variant', () => {
    render(<Text>hello</Text>)
    expect(screen.getByText('hello')).toHaveClass('xr-text', 'xr-text--body')
  })
  it('maps error variant to danger text color', () => {
    render(<Text variant="error">err</Text>)
    expect(screen.getByText('err')).toHaveClass('xr-text--error')
  })
  it('respects asChild', () => {
    render(<Text asChild><a href="#">link</a></Text>)
    expect(screen.getByText('link').tagName).toBe('A')
  })
})
```

`heading.test.tsx`:
```tsx
it('renders the requested heading level', () => {
  render(<Heading as="h2">Title</Heading>)
  const h = screen.getByText('Title')
  expect(h.tagName).toBe('H2')
  expect(h).toHaveClass('xr-heading', 'xr-heading--h2')
})
```

`badge.test.tsx`:
```tsx
it('renders tone and size classes', () => {
  render(<Badge tone="success">Done</Badge>)
  const b = screen.getByText('Done')
  expect(b).toHaveClass('xr-badge', 'xr-badge--success')
  expect(b).toHaveStyle({ backgroundColor: 'var(--xr-semantic-color-successSurface)' })
})
```

`divider.test.tsx`:
```tsx
it('renders horizontal separator', () => {
  render(<Divider />)
  expect(document.querySelector('[role="separator"]')).not.toBeNull()
})
```

`skeleton.test.tsx`:
```tsx
it('renders line skeleton with role status wrapper', () => {
  const { container } = render(<Skeleton shape="line" width={100} height={12} />)
  expect(container.querySelector('.xr-skeleton')).not.toBeNull()
  expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
})
```

`kbd.test.tsx`:
```tsx
it('renders a kbd element', () => {
  render(<Kbd>⌘K</Kbd>)
  expect(document.querySelector('kbd')).toHaveClass('xr-kbd')
})
```

- [ ] **Step 2: Run tests to verify fail**

Run: `pnpm --filter @xerena/react test`
Expected: FAIL — modules missing.

- [ ] **Step 3: Implement `Text.tsx`**

```tsx
import { Slot } from '../../primitives/Slot'
import { useClassName } from '../../primitives/useClassName'
import type { CSSProperties } from 'react'

export interface TextProps {
  variant?: 'body' | 'muted' | 'strong' | 'error'
  size?: 'sm' | 'md' | 'lg'
  font?: 'body' | 'mono'
  truncate?: boolean
  center?: boolean
  asChild?: boolean
  style?: CSSProperties
  className?: string
  children: React.ReactNode
}

export function Text({ variant = 'body', size = 'md', font = 'body', truncate, center, asChild, className, children, ...rest }: TextProps) {
  const cls = useClassName(
    { className },
    ['xr-text', `xr-text--${variant}`, `xr-text--${size}`, `xr-text--${font}`, truncate && 'xr-text--truncate', center && 'xr-text--center'],
  )
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp className={cls} {...rest}>
      {children}
    </Comp>
  )
}
```

- [ ] **Step 4: Implement `Heading.tsx`, `Badge.tsx`, `Divider.tsx`, `Skeleton.tsx`, `Kbd.tsx`**

```tsx
// Heading.tsx
import { Slot } from '../../primitives/Slot'
import { useClassName } from '../../primitives/useClassName'
export interface HeadingProps { as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'; asChild?: boolean; className?: string; children: React.ReactNode }
export function Heading({ as = 'h2', asChild, className, children, ...rest }: HeadingProps) {
  const Comp = asChild ? Slot : as
  return <Comp className={useClassName({ className }, [`xr-heading`, `xr-heading--${as}`])} {...rest}>{children}</Comp>
}
```

```tsx
// Badge.tsx
import { useClassName } from '../../primitives/useClassName'
export interface BadgeProps { tone?: 'neutral'|'info'|'success'|'warning'|'danger'|'brand'; size?: 'sm'|'md'; className?: string; children: React.ReactNode }
export function Badge({ tone = 'neutral', size = 'md', className, children }: BadgeProps) {
  return <span className={useClassName({ className }, ['xr-badge', `xr-badge--${tone}`, `xr-badge--${size}`])}>{children}</span>
}
```

```tsx
// Divider.tsx
import { useClassName } from '../../primitives/useClassName'
export interface DividerProps { orientation?: 'horizontal'|'vertical'; variant?: 'solid'|'dashed'; label?: string; className?: string }
export function Divider({ orientation = 'horizontal', variant = 'solid', label, className }: DividerProps) {
  if (label) {
    return (
      <div role="separator" aria-orientation={orientation} className={useClassName({ className }, [`xr-divider xr-divider--${variant} xr-divider--label`])}>
        <span className="xr-divider__line xr-divider__line--left" />
        <span className="xr-divider__label">{label}</span>
        <span className="xr-divider__line xr-divider__line--right" />
      </div>
    )
  }
  return <hr role="separator" aria-orientation={orientation} className={useClassName({ className }, [`xr-divider xr-divider--${orientation} xr-divider--${variant}`])} />
}
```

```tsx
// Skeleton.tsx
import { useClassName } from '../../primitives/useClassName'
export interface SkeletonProps { shape?: 'line'|'circle'|'rect'|'text'; width?: number|string; height?: number|string; style?: React.CSSProperties; className?: string }
export function Skeleton({ shape = 'line', width, height, style, className }: SkeletonProps) {
  return (
    <span role="status" className="xr-skeleton-host">
      <span
        aria-hidden="true"
        style={{ width, height, ...style }}
        className={useClassName({ className }, [`xr-skeleton xr-skeleton--${shape}`])}
      />
    </span>
  )
}
```

```tsx
// Kbd.tsx
import { useClassName } from '../../primitives/useClassName'
export function Kbd({ className, children, ...rest }: { className?: string; children: React.ReactNode }) {
  return <kbd className={useClassName({ className }, ['xr-kbd'])} {...rest}>{children}</kbd>
}
```

- [ ] **Step 5: Typography CSS block** (append to `base.css` inside `@layer xerena-components`):

```css
.xr-text--body { color: var(--xr-semantic-color-text); }
.xr-text--muted { color: var(--xr-semantic-color-textMuted); }
.xr-text--strong { color: var(--xr-semantic-color-text); font-weight: 600; }
.xr-text--error { color: var(--xr-semantic-color-dangerText); }
.xr-text--truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.xr-text--center { text-align: center; }
.xr-heading { color: var(--xr-semantic-color-text); margin: 0; }
.xr-heading--h1 { font-size: calc(var(--xr-typography-display-xl-fontSize) * 1px); line-height: 1.2; }
.xr-heading--h2 { font-size: calc(var(--xr-typography-display-lg-fontSize) * 1px); line-height: 1.25; }
.xr-heading--h3 { font-size: calc(var(--xr-typography-display-md-fontSize) * 1px); line-height: 1.3; }
.xr-heading--h4 { font-size: calc(var(--xr-typography-display-sm-fontSize) * 1px); line-height: 1.35; }
.xr-heading--h5 { font-size: calc(var(--xr-typography-display-xs-fontSize) * 1px); line-height: 1.4; }
.xr-heading--h6 { font-size: calc(var(--xr-typography-display-xs-fontSize) * 1px); line-height: 1.4; font-weight: 600; }
.xr-badge { display: inline-flex; align-items: center; gap: calc(var(--xr-spacing-1) * 1px); border-radius: var(--xr-radius-full); font-weight: 600; line-height: 1; }
.xr-badge--sm { font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); padding: calc(var(--xr-spacing-1) * 1px) calc(var(--xr-spacing-2) * 1px); }
.xr-badge--md { font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); padding: calc(var(--xr-spacing-1) * 1px) calc(var(--xr-spacing-3) * 1px); }
.xr-badge--neutral { background: var(--xr-semantic-color-surface); color: var(--xr-semantic-color-textMuted); }
.xr-badge--brand { background: var(--xr-semantic-color-primary); color: var(--xr-semantic-color-textOnStrong); }
.xr-badge--info { background: var(--xr-semantic-color-infoSurface); color: var(--xr-semantic-color-infoText); }
.xr-badge--success { background: var(--xr-semantic-color-successSurface); color: var(--xr-semantic-color-successText); }
.xr-badge--warning { background: var(--xr-semantic-color-warningSurface); color: var(--xr-semantic-color-warningText); }
.xr-badge--danger { background: var(--xr-semantic-color-dangerSurface); color: var(--xr-semantic-color-dangerText); }
.xr-divider { border: 0; background: var(--xr-semantic-color-border); }
.xr-divider--horizontal { width: 100%; height: 1px; }
.xr-divider--vertical { height: auto; width: 1px; align-self: stretch; }
.xr-divider--dashed { background: repeating-linear-gradient(90deg, var(--xr-semantic-color-border) 0 6px, transparent 6px 12px); }
.xr-divider--label { display: flex; align-items: center; gap: calc(var(--xr-spacing-3) * 1px); border: none; }
.xr-divider__line { flex: 1; height: 1px; background: var(--xr-semantic-color-border); }
.xr-divider__label { color: var(--xr-semantic-color-textMuted); font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); }
.xr-skeleton { display: block; background: var(--xr-semantic-color-surface); animation: xr-skeleton-pulse 1.6s ease-in-out infinite; border-radius: calc(var(--xr-radius-sm) * 1px); }
.xr-skeleton--circle { border-radius: var(--xr-radius-full); }
.xr-skeleton--text { height: calc(var(--xr-typography-body-md-lineHeight) * 1px); }
@keyframes xr-skeleton-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.xr-kbd { font-family: var(--xr-typography-fontFamily-mono); font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); padding: calc(var(--xr-spacing-1) * 1px) calc(var(--xr-spacing-2) * 1px); border: 1px solid var(--xr-semantic-color-border); border-bottom-width: 2px; border-radius: calc(var(--xr-radius-sm) * 1px); background: var(--xr-semantic-color-surface); color: var(--xr-semantic-color-text); }
```

Note: Vite/vitest CSS handling — `@testing-library/react` tests don't load CSS by default; tests assert classes and (for Badge) the `background-color` style reference. To make the Badge style assertion pass, apply it inline in the component instead:

`Badge.tsx` → add `style={{ backgroundColor: badgeColors[Tone], color: badge Texts[tone] }}`? Simpler: assert the CSS var via inline style from the component. Update `Badge` to set `color: var(--xr-semantic-color-...)` inline:
- neutral → `{ backgroundColor: 'var(--xr-semantic-color-surface)', color: 'var(--xr-semantic-color-textMuted)' }`
- brand → `{ backgroundColor: 'var(--xr-semantic-color-primary)', color: 'var(--xr-semantic-color-textOnStrong)' }`
- info/success/warning/danger → `{ backgroundColor: 'var(--xr-semantic-color-<tone>Surface)', color: 'var(--xr-semantic-color-<tone>Text)' }`

- [ ] **Step 6: Add Badge inline style** (as above), keeping the test assertion.

- [ ] **Step 7: Add category barrel + root export**

`components/typography/index.ts`:
```ts
export * from './Text'
export * from './Heading'
export * from './Badge'
export * from './Divider'
export * from './Skeleton'
export * from './Kbd'
```
`packages/react/src/index.ts` append:
```ts
export * from './components/typography'
```

- [ ] **Step 8: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add typography components"
```

---

### Task 10: Layout — Container, Stack, Grid

**Files:**
- Create: `packages/react/src/components/layout/{Container,Stack,Grid}.tsx`, `index.ts`
- Modify: `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces:**
- `Container: { variant?: 'centered'|'fluid'|'narrow'; size?: 'sm'|'md'|'lg'|'xl' }`
- `Stack: { orientation?: 'horizontal'|'vertical'|'inline'; spacing?: SpacingKey; alignItems?; justifyContent?; wrap?: boolean; as?: React.ElementType }`
- `Grid: { columns?: 1|2|3|4|5|6|7|8|9|10|11|12; gap?: SpacingKey; auto?: boolean }`

- [ ] **Step 1: Failing tests**

```tsx
// container.test.tsx
it('renders centered md container with max-width token', () => {
  render(<Container size="md">c</Container>)
  expect(screen.getByText('c')).toHaveClass('xr-container', 'xr-container--md')
  expect(screen.getByText('c').style.maxWidth).toBe('calc(var(--xr-semantic-spacing-lg) ...)')
})
// stack.test.tsx
it('renders vertical stack with gap spacing token', () => {
  render(<Stack orientation="vertical" spacing="md">a</Stack>)
  expect(screen.getByText('a').style.flexDirection).toBe('column')
})
// grid.test.tsx
it('renders 3-column grid', () => {
  render(<Grid columns={3}>g</Grid>)
  expect(screen.getByText('g').style.gridTemplateColumns).toBe('repeat(3, minmax(0,1fr))')
})
```

- [ ] **Step 2: Run to verify fail**

Run: `pnpm --filter @xerena/react test`
Expected: FAIL.

- [ ] **Step 3: Implement (inline token styles — simplest and testable)**

```tsx
// Container.tsx
import { css } from '@xerena/styling'
export interface ContainerProps { variant?: 'centered'|'fluid'|'narrow'; size?: 'sm'|'md'|'lg'|'xl'; className?: string; children: React.ReactNode }
const WIDTH = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const
export function Container({ variant = 'centered', size = 'lg', className, children, ...rest }: ContainerProps) {
  const style: React.CSSProperties = variant === 'fluid' ? { width: '100%' } : { maxWidth: WIDTH[size], marginInline: 'auto' }
  if (variant === 'narrow') style.maxWidth = 720
  return <div className={useClassName({ className }, ['xr-container', `xr-container--${variant}`, `xr-container--${size}`])} style={style} {...rest}>{children}</div>
}
```

```tsx
// Stack.tsx
import { spacing } from '@xerena/tokens'
export interface StackProps { orientation?: 'horizontal'|'vertical'|'inline'; spacing?: keyof typeof spacing; alignItems?: React.CSSProperties['alignItems']; justifyContent?: React.CSSProperties['justifyContent']; wrap?: boolean; as?: React.ElementType; className?: string; children: React.ReactNode }
export function Stack({ orientation = 'vertical', spacing: sp = 'md', alignItems, justifyContent, wrap, as: Comp = 'div', className, children, ...rest }: StackProps) {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : orientation === 'vertical' ? 'column' : 'row',
    gap: spacing[sp] ? `${spacing[sp]}px` : undefined,
    alignItems, justifyContent,
    flexWrap: wrap ? 'wrap' : undefined,
  }
  return <Comp className={useClassName({ className }, [`xr-stack xr-stack--${orientation}`])} style={style} {...rest}>{children}</Comp>
}
```

```tsx
// Grid.tsx
export interface GridProps { columns?: 1|2|3|4|5|6|7|8|9|10|11|12; gap?: keyof typeof spacing; auto?: boolean; className?: string; children: React.ReactNode }
export function Grid({ columns, gap: g = 'md', auto, className, children, ...rest }: GridProps) {
  const style: React.CSSProperties = {
    display: 'grid',
    gap: `${spacing[g]}px`,
    gridTemplateColumns: auto ? 'repeat(auto-fit, minmax(0, 1fr))' : columns ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
  }
  return <div className={useClassName({ className }, [`xr-grid xr-grid--${columns ?? 'auto'}`])} style={style} {...rest}>{children}</div>
}
```

- [ ] **Step 4: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green (import `useClassName` from `../../primitives` in each file).
```bash
git add packages/react/src/components/layout packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add layout components"
```

---

### Task 11: Actions — Button, IconButton, Link, ButtonGroup

**Files:**
- Create: `packages/react/src/components/actions/{Button,IconButton,Link,ButtonGroup}.tsx`, `index.ts`
- Modify: `packages/react/src/index.ts`, `packages/react/src/styles/base.css`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Button: { variant?: 'primary'|'ghost'|'outline'|'soft'|'destructive'|'link'; size?: 'sm'|'md'|'lg'; loading?: boolean; animated?: boolean; fullWidth?: boolean; leftIcon?: ReactNode; rightIcon?: ReactNode; asChild?: boolean }`
- `IconButton: { variant?: 'primary'|'ghost'|'outline'|'soft'|'destructive'; size?: 'sm'|'md'|'lg'; 'aria-label': string; animated?: boolean; asChild?: boolean }`
- `Link: { variant?: 'default'|'muted'|'animated'; target?: '_blank'; rel?: string; asChild?: boolean }`
- `ButtonGroup: { orientation?: 'horizontal'|'vertical'; spacing?: SpacingKey; value?: string; onValueChange?: (v) => void; className?: string; children: ReactNode }`

- [ ] **Step 1: Failing tests**

```tsx
// button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'
describe('Button', () => {
  it('renders primary variant by default with correct aria attributes', () => {
    render(<Button>Click</Button>)
    const btn = screen.getByRole('button', { name: 'Click' })
    expect(btn).toHaveClass('xr-button', 'xr-button--primary', 'xr-button--md')
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveAttribute('type', 'button')
  })
  it('applies animated class when animated is set', () => {
    render(<Button animated>Go</Button>)
    expect(screen.getByText('Go')).toHaveClass('xr-button--animated')
  })
  it('shows aria-busy when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })
  it('wires leftIcon and rightIcon around children', () => {
    render(<Button leftIcon={<span>←</span>} rightIcon={<span>→</span>}>Go</Button>)
    expect(screen.getByText('←')).toBeInTheDocument()
    expect(screen.getByText('→')).toBeInTheDocument()
  })
  it('renders as anchor via asChild', () => {
    render(<Button asChild><a href="/go">Go</a></Button>)
    expect(screen.getByText('Go').tagName).toBe('A')
  })
})
```

```tsx
// iconbutton.test.tsx
describe('IconButton', () => {
  it('requires aria-label', () => {
    render(<IconButton aria-label="Close">×</IconButton>)
    expect(screen.getByLabelText('Close')).toHaveClass('xr-iconbutton', 'xr-iconbutton--primary')
  })
})
```

```tsx
// link.test.tsx
describe('Link', () => {
  it('renders animated underline class for animated variant', () => {
    render(<Link variant="animated" href="/p">Page</Link>)
    expect(screen.getByText('Page')).toHaveClass('xr-link', 'xr-link--animated')
  })
  it('respects target and rel', () => {
    render(<Link href="/e" target="_blank" rel="noopener noreferrer">ext</Link>)
    const a = screen.getByText('ext')
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
```

```tsx
// buttongroup.test.tsx
describe('ButtonGroup', () => {
  it('renders a horizontal group with gap', () => {
    render(<ButtonGroup spacing="md">a</ButtonGroup>)
    expect(screen.getByText('a')).toHaveClass('xr-button-group', 'xr-button-group--horizontal')
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Button.tsx`**

```tsx
import { Slot } from '../../primitives/Slot'
import { useClassName, useDisabled, usePress } from '../../primitives'
import { loading: cssLoading } from '../../primitives/cn'
import type { CSSProperties, ReactNode } from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'outline' | 'soft' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  animated?: boolean
  fullWidth?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
  className?: string
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
}

const COLORS: Record<string, string> = {
  primary: 'var(--xr-semantic-color-primary)',
  destructive: 'var(--xr-semantic-color-danger)',
  outline: 'transparent',
  ghost: 'transparent',
  soft: 'var(--xr-semantic-color-primary)',
  link: 'transparent',
}
const HOVER_COLORS: Record<string, string> = {
  primary: 'var(--xr-semantic-color-primaryHover)',
  destructive: 'var(--xr-semantic-color-dangerHover)',
}
const TEXT_COLORS: Record<string, string> = {
  primary: 'var(--xr-semantic-color-textOnStrong)',
  destructive: 'var(--xr-semantic-color-textOnStrong)',
  outline: 'var(--xr-semantic-color-primary)',
  ghost: 'var(--xr-semantic-color-primary)',
  soft: 'var(--xr-semantic-color-primary)',
  link: 'var(--xr-semantic-color-primary)',
}

export function Button({
  variant = 'primary', size = 'md', loading = false, animated, fullWidth, disabled,
  leftIcon, rightIcon, asChild, className, children, type = 'button', ...rest
}: ButtonProps) {
  const { pressed, onPointerDown, onPointerUp, onPointerLeave } = usePress()
  const { disabled: isDisabled, 'aria-disabled': ariaDisabled } = useDisabled(disabled || loading)
  const Comp = asChild ? Slot : 'button'
  const base = animated ? 'xr-button xr-button--animated' : 'xr-button'
  const cls = useClassName(
    { className },
    [base, `xr-button--${variant}`, `xr-button--${size}`, isDisabled && 'xr-button--disabled',
     pressed && 'xr-button--active', fullWidth && 'xr-button--full-width'],
  )
  const style: CSSProperties = { backgroundColor: COLORS[variant], color: TEXT_COLORS[variant] }
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cls}
      aria-disabled={ariaDisabled}
      aria-busy={loading}
      disabled={isDisabled}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      style={style}
      {...rest}
    >
      {leftIcon && <span className="xr-button__icon xr-button__icon--left">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="xr-button__icon xr-button__icon--right">{rightIcon}</span>}
    </Comp>
  )
}
```

- [ ] **Step 4: Implement `IconButton.tsx`**

```tsx
import { Button, type ButtonProps } from './Button'
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children' | 'fullWidth'> { 'aria-label': string; children: React.ReactNode }
export function IconButton({ children, variant = 'primary', size = 'md', ...rest }: IconButtonProps) {
  return <Button variant={variant} size={size} className="xr-iconbutton" {...rest}>{children}</Button>
}
```

- [ ] **Step 5: Implement `Link.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
export interface LinkProps { variant?: 'default' | 'muted' | 'animated'; href?: string; target?: '_blank'; rel?: string; asChild?: boolean; className?: string; children: React.ReactNode }
export function Link({ variant = 'default', className, children, ...rest }: LinkProps) {
  return <a className={useClassName({ className }, [`xr-link`, `xr-link--${variant}`])} {...rest}>{children}</a>
}
```

- [ ] **Step 6: Implement `ButtonGroup.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
import { spacing } from '@xerena/tokens'
export interface ButtonGroupProps { orientation?: 'horizontal' | 'vertical'; spacing?: keyof typeof spacing; value?: string; onValueChange?: (v: string) => void; className?: string; children: React.ReactNode }
export function ButtonGroup({ orientation = 'horizontal', spacing: sp = 'md', className, children, ...rest }: ButtonGroupProps) {
  const style: React.CSSProperties = { display: 'flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: spacing[sp] ? `${spacing[sp]}px` : undefined }
  return <div role="group" className={useClassName({ className }, [`xr-button-group xr-button-group--${orientation}`])} style={style} {...rest}>{children}</div>
}
```

- [ ] **Step 7: Button CSS** (append inside `@layer xerena-components` in `base.css`):

```css
.xr-button { display: inline-flex; align-items: center; justify-content: center; gap: calc(var(--xr-spacing-2) * 1px); border: none; border-radius: calc(var(--xr-radius-md) * 1px); cursor: pointer; font-weight: 600; white-space: nowrap; transition: background-color var(--xr-motion-duration-fast) var(--xr-motion-easing-standard), color var(--xr-motion-duration-fast) var(--xr-motion-easing-standard), transform var(--xr-motion-duration-fast) var(--xr-motion-easing-standard); outline: none; }
.xr-button:focus-visible { box-shadow: 0 0 0 3px var(--xr-semantic-color-primary); }
.xr-button--sm { height: 32px; font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); padding-inline: calc(var(--xr-spacing-2) * 1px); }
.xr-button--md { height: 40px; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); padding-inline: calc(var(--xr-spacing-4) * 1px); }
.xr-button--lg { height: 48px; font-size: calc(var(--xr-typography-body-lg-fontSize) * 1px); padding-inline: calc(var(--xr-spacing-6) * 1px); }
.xr-button--disabled { opacity: 0.5; pointer-events: none; }
.xr-button--full-width { width: 100%; }
.xr-button--link { padding: 0; text-decoration: underline; text-underline-offset: 2px; }
.xr-button--link:hover { opacity: 0.8; }
.xr-button--active { transform: scale(0.98); }
.xr-button--animated:hover { transform: translateY(-1px); }
.xr-button--animated.xr-button--active { transform: scale(0.96); }
.xr-button__icon { display: inline-flex; }
.xr-iconbutton { padding: 0; width: 40px; height: 40px; }
.xr-iconbutton--sm { width: 32px; height: 32px; }
.xr-iconbutton--lg { width: 48px; height: 48px; }
.xr-link { color: var(--xr-semantic-color-primary); text-decoration: none; }
.xr-link--animated { position: relative; text-decoration: underline; text-decoration-color: var(--xr-semantic-color-primary); text-underline-offset: 4px; }
.xr-link--muted { color: var(--xr-semantic-color-textMuted); }
.xr-button-group--vertical { align-items: stretch; }
.xr-button-group--horizontal { align-items: center; }
```

Note: `usePress` is wired in Button for `xr-button--active` state. The CSS transitions use `var(--xr-motion-duration-fast)` and `var(--xr-motion-easing-standard)` (token vars in `tokens.css` as `--xr-motion-duration-fast` = `100ms`). Validate the var name: `tokens.css` emits `--xr-motion-duration-fast: 100;` (unitless — px added in the CSS layer). So `transition: ... var(--xr-motion-duration-fast)ms ...` is wrong; use `calc(var(--xr-motion-duration-fast) * 1ms)`.

- [ ] **Step 8: Fix transition lines in CSS to use `calc(... * 1ms)` for duration and `cubic-bezier(var(...))` for easing:**

Replace all transition declarations in the above CSS with:
```css
transition: background-color calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), color calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), transform calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard));
```

- [ ] **Step 9: Add barrel + root export, verify + commit**

```bash
git add packages/react/src/components/actions packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add action components"
```

---

### Task 12: Form base — Field, Input, Textarea, Select, Checkbox, Radio, Switch

**Files:**
- Create: `packages/react/src/components/form/{Field,Input,Textarea,Select,Checkbox,Radio,Switch}.tsx`, `index.ts`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Field: { label?: string; hint?: string; error?: string; required?: boolean; asChild?: boolean; htmlFor?: string; children: React.ReactNode }`
- `Input: { variant?: 'outlined'|'filled'; type?: string; error?: boolean; disabled?: boolean; readOnly?: boolean }`
- `Textarea: { rows?: number; resize?: 'none'|'auto'; error?: boolean; disabled?: boolean }`
- `Select: { multiple?: boolean; placeholder?: string; error?: boolean; disabled?: boolean; children: ReactNode }`
- `Checkbox: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean }`
- `Radio: { value?: string; disabled?: boolean }`
- `Switch: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; size?: 'sm'|'md'; disabled?: boolean }`

- [ ] **Step 1: Failing tests**

```tsx
// field.test.tsx
describe('Field', () => {
  it('auto-assigns htmlFor/id between label and input', () => {
    render(<Field label="Email" htmlFor="email"><Input id="email" /></Field>)
    expect(screen.getByLabelText('Email').tagName).toBe('INPUT')
  })
  it('renders error message with danger color', () => {
    render(<Field label="Name" error="Required"><Input /></Field>)
    expect(screen.getByText('Required')).toHaveClass('xr-field__error')
  })
})
```

```tsx
// checkbox.test.tsx
describe('Checkbox', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })
  it('toggles on click', async () => {
    render(<Checkbox />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })
})
```

```tsx
// switch.test.tsx
describe('Switch', () => {
  it('passes size to thumb translate var', () => {
    render(<Switch size="md" />)
    const sw = screen.getByRole('switch')
    expect(sw.style['--xr-switch-thumb-size']).toBe('32px')
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Field.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
import { useDisabled } from '../../primitives/useDisabled'
import { Children, cloneElement, isValidElement } from 'react'
import type { ReactNode } from 'react'
export interface FieldProps { label?: string; hint?: string; error?: string; required?: boolean; asChild?: boolean; htmlFor?: string; children: ReactNode; disabled?: boolean; className?: string }
export function Field({ label, hint, error, required, htmlFor, children, disabled, className }: FieldProps) {
  const id = htmlFor ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  return (
    <div className={useClassName({ className }, ['xr-field', error && 'xr-field--error'])}>
      {label && <label htmlFor={id} className="xr-field__label">{label}{required && <span className="xr-field__required"> *</span>}</label>}
      <div className="xr-field__control">{children}</div>
      {hint && !error && <span className="xr-field__hint">{hint}</span>}
      {error && <span className="xr-field__error" role="alert">{error}</span>}
    </div>
  )
}
```

- [ ] **Step 4: Implement `Input.tsx`**

```tsx
import { forwardRef } from 'react'
import { useClassName, useDisabled } from '../../primitives'
import type { CSSProperties } from 'react'
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> { variant?: 'outlined' | 'filled' }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ variant = 'outlined', error, disabled, readOnly, className, style, ...rest }, ref) {
  const { disabled: isDisabled } = useDisabled(disabled)
  return (
    <input
      ref={ref}
      disabled={isDisabled}
      readOnly={readOnly}
      aria-invalid={error}
      className={useClassName({ className }, [`xr-input xr-input--${variant}`, error && 'xr-input--error'])}
      style={{ backgroundColor: variant === 'filled' ? 'var(--xr-semantic-color-surface)' : 'transparent', color: 'var(--xr-semantic-color-text)', borderColor: error ? 'var(--xr-semantic-color-danger)' : 'var(--xr-semantic-color-border)', ...style } as CSSProperties}
      {...rest}
    />
  )
})
```

- [ ] **Step 5: Implement `Textarea.tsx`**

```tsx
import { forwardRef } from 'react'
import { useClassName, useDisabled } from '../../primitives'
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { resize?: 'none' | 'auto'; error?: boolean }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ error, resize = 'none', disabled, className, style, ...rest }, ref) {
  return <textarea ref={ref} disabled={disabled} aria-invalid={error}
    className={useClassName({ className }, ['xr-textarea', error && 'xr-textarea--error'])}
    style={{ resize, color: 'var(--xr-semantic-color-text)', ...style } as React.CSSProperties}
    {...rest} />
})
```

- [ ] **Step 6: Implement `Select.tsx`**

```tsx
import { forwardRef } from 'react'
import { useClassName, useDisabled } from '../../primitives'
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ error, disabled, children, className, style, ...rest }, ref) {
  return <select ref={ref} disabled={disabled} aria-invalid={error}
    className={useClassName({ className }, ['xr-select', error && 'xr-select--error'])}
    style={{ color: 'var(--xr-semantic-color-text)', ...style } as React.CSSProperties}
    {...rest}>{children}</select>
})
```

- [ ] **Step 7: Implement `Checkbox.tsx`**

```tsx
import { useCallback, useState } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
export interface CheckboxProps { checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean; className?: string; children?: React.ReactNode }
export function Checkbox({ checked: controlled, onCheckedChange, disabled, className }: CheckboxProps) {
  const [uncontrolled, setUncontrolled] = useState(false)
  const checked = controlled ?? uncontrolled
  const onChange = useCallback(() => {
    if (onCheckedChange) onCheckedChange(!checked)
    else setUncontrolled(!checked)
  }, [checked, onCheckedChange])
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  return (
    <button role="checkbox" aria-checked={checked} disabled={disabled}
      className={useClassName({ className }, ['xr-checkbox', focusWithin && 'xr-checkbox--focus'])}
      style={{ borderColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' }}
      onClick={onChange} onFocus={onFocus} onBlur={onBlur}
      type="button"
    >
      {checked && <span className="xr-checkbox__check" aria-hidden="true">✓</span>}
    </button>
  )
}
```

- [ ] **Step 8: Implement `Radio.tsx`**

```tsx
import { useContext, useCallback } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
export interface RadioProps { value?: string; checked?: boolean; onChange?: () => void; disabled?: boolean; className?: string; name?: string }
export function Radio({ value, checked, onChange, disabled, className }: RadioProps) {
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  return (
    <button role="radio" aria-checked={checked} disabled={disabled} type="button"
      className={useClassName({ className }, ['xr-radio', focusWithin && 'xr-radio--focus'])}
      onClick={onChange} onFocus={onFocus} onBlur={onBlur}
      style={{ borderColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' }}
    >
      {checked && <span className="xr-radio__dot" />}
    </button>
  )
}
```

- [ ] **Step 9: Implement `Switch.tsx`**

```tsx
import { useCallback, useState } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
export interface SwitchProps { checked?: boolean; onCheckedChange?: (checked: boolean) => void; size?: 'sm' | 'md'; disabled?: boolean; className?: string }
export function Switch({ checked: controlled, onCheckedChange, size = 'md', disabled, className }: SwitchProps) {
  const [uncontrolled, setUncontrolled] = useState(false)
  const checked = controlled ?? uncontrolled
  const toggle = useCallback(() => { onCheckedChange ? onCheckedChange(!checked) : setUncontrolled(!checked) }, [checked, onCheckedChange])
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  const thumbPx = size === 'sm' ? 27 : 32
  return (
    <button role="switch" aria-checked={checked} disabled={disabled} type="button"
      className={useClassName({ className }, ['xr-switch', `xr-switch--${size}`, focusWithin && 'xr-switch--focus'])}
      style={{ '--xr-switch-thumb': `${thumbPx}px`, backgroundColor: checked ? 'var(--xr-semantic-color-primary)' : 'var(--xr-semantic-color-border)' } as React.CSSProperties}
      onClick={toggle} onFocus={onFocus} onBlur={onBlur}
    >
      <span className="xr-switch__thumb" style={{ transform: checked ? `translateX(${thumbPx}px)` : 'translateX(0)' }} />
    </button>
  )
}
```

- [ ] **Step 10: Form CSS** (append inside `@layer xerena-components` in `base.css`):

```css
.xr-field { display: flex; flex-direction: column; gap: calc(var(--xr-spacing-1) * 1px); }
.xr-field__label { font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); font-weight: 600; color: var(--xr-semantic-color-text); }
.xr-field__required { color: var(--xr-semantic-color-danger); }
.xr-field__error { font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); color: var(--xr-semantic-color-dangerText); }
.xr-field__hint { font-size: calc(var(--xr-typography-body-sm-fontSize) * 1px); color: var(--xr-semantic-color-textMuted); }
.xr-input { height: 40px; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); padding-inline: calc(var(--xr-spacing-3) * 1px); border-radius: calc(var(--xr-radius-md) * 1px); border: 1px solid var(--xr-semantic-color-border); transition: border-color calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)); }
.xr-input:focus-visible { outline: none; border-color: var(--xr-semantic-color-primary); box-shadow: 0 0 0 3px var(--xr-semantic-color-primary); }
.xr-input--error { border-color: var(--xr-semantic-color-danger); }
.xr-textarea { min-height: 80px; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); padding: calc(var(--xr-spacing-2) * 1px) calc(var(--xr-spacing-3) * 1px); border-radius: calc(var(--xr-radius-md) * 1px); border: 1px solid var(--xr-semantic-color-border); }
.xr-textarea:focus-visible { outline: none; border-color: var(--xr-semantic-color-primary); }
.xr-textarea--error { border-color: var(--xr-semantic-color-danger); }
.xr-select { height: 40px; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); padding-inline: calc(var(--xr-spacing-3) * 1px); border-radius: calc(var(--xr-radius-md) * 1px); border: 1px solid var(--xr-semantic-color-border); appearance: none; background-image: url("data:image/svg+xml,..."); }
.xr-select--error { border-color: var(--xr-semantic-color-danger); }
.xr-checkbox { width: 20px; height: 20px; border-radius: calc(var(--xr-radius-sm) * 1px); border: 2px solid var(--xr-semantic-color-border); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color calc(var(--xr-motion-duration-instant) * 1ms), transform calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-emphasis)); }
.xr-checkbox--focus { box-shadow: 0 0 0 3px var(--xr-semantic-color-primary); }
.xr-checkbox__check { color: var(--xr-semantic-color-textOnStrong); font-size: 14px; line-height: 1; }
.xr-radio { width: 20px; height: 20px; border-radius: var(--xr-radius-full); border: 2px solid var(--xr-semantic-color-border); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.xr-radio--focus { box-shadow: 0 0 0 3px var(--xr-semantic-color-primary); }
.xr-radio__dot { width: 10px; height: 10px; border-radius: var(--xr-radius-full); background: var(--xr-semantic-color-primary); animation: xr-radio-pop calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-emphasis)) 1; }
@keyframes xr-radio-pop { 0% { transform: scale(0); } 100% { transform: scale(1); } }
.xr-switch { width: 44px; height: 24px; border-radius: var(--xr-radius-full); border: none; cursor: pointer; position: relative; transition: background-color calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)); }
.xr-switch--sm { width: 36px; height: 20px; }
.xr-switch--focus { box-shadow: 0 0 0 3px var(--xr-semantic-color-primary); }
.xr-switch__thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: var(--xr-radius-full); background: white; box-shadow: var(--xr-elevation-xs); transition: transform calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)); }
.xr-switch--sm .xr-switch__thumb { width: 14px; height: 14px; }
```

- [ ] **Step 11: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/components/form packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add base form components"
```

---

### Task 13: Form advanced — Slider, Combobox, RadioGroup, CheckboxGroup, InputGroup, NumberInput

**Files:**
- Create: `packages/react/src/components/form/{Slider,Combobox,RadioGroup,CheckboxGroup,InputGroup,NumberInput}.tsx`
- Modify: `packages/react/src/styles/base.css`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Slider: { min?: number; max?: number; step?: number; value?: number; onValueChange?: (v: number) => void; orientation?: 'horizontal'|'vertical'; disabled?: boolean }`
- `Combobox: { Root, Input, List, Option, Clear }` (composition)
- `RadioGroup: { value?: string; onValueChange?: (v: string) => void; orientation?: 'horizontal'|'vertical'; disabled?: boolean; children: ReactNode }`
- `CheckboxGroup: { value?: string[]; onValueChange?: (v: string[]) => void; disabled?: boolean; children: ReactNode }`
- `InputGroup: { children: ReactNode }`
- `NumberInput: { value?: number; onValueChange?: (n: number) => void; min?: number; max?: number; step?: number; variant?: 'default'|'compact'; disabled?: boolean }`

- [ ] **Step 1: Failing tests**

```tsx
// slider.test.tsx
describe('Slider', () => {
  it('renders aria slider with value in aria-valuenow', () => {
    render(<Slider value={40} min={0} max={100} />)
    const el = screen.getByRole('slider')
    expect(el).toHaveAttribute('aria-valuenow', '40')
    expect(el).toHaveAttribute('aria-valuemin', '0')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })
})
```

```tsx
// combobox.test.tsx
describe('Combobox', () => {
  it('renders combobox with aria-expanded', () => {
    render(
      <Combobox.Root>
        <Combobox.Input placeholder="Search" />
        <Combobox.List open={false}><Combobox.Option value="one">One</Combobox.Option></Combobox.List>
      </Combobox.Root>
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })
})
```

```tsx
// radiogroup.test.tsx
describe('RadioGroup', () => {
  it('groups radios and applies role radiogroup', () => {
    render(<RadioGroup value="a" onValueChange={() => {}}>
      <Radio value="a">A</Radio><Radio value="b">B</Radio>
    </RadioGroup>)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Slider.tsx`**

```tsx
import { useCallback, useRef } from 'react'
import { useDisabled, useClassName } from '../../primitives'
export interface SliderProps { value?: number; defaultValue?: number; min?: number; max?: number; step?: number; orientation?: 'horizontal'|'vertical'; onValueChange?: (v: number) => void; disabled?: boolean; className?: string }
export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, orientation = 'horizontal', onValueChange, disabled, className }: SliderProps) {
  const { disabled: isDisabled } = useDisabled(disabled)
  const pct = ((value ?? defaultValue) - min) / (max - min) * 100
  const set = useCallback((n: number) => { if (onValueChange) onValueChange(n) }, [onValueChange])
  return (
    <div className={useClassName({ className }, ['xr-slider', `xr-slider--${orientation}`])} role="presentation"
      style={{ position: 'relative', width: orientation === 'horizontal' ? '100%' : 20, height: orientation === 'horizontal' ? 20 : 100 }}>
      <div className="xr-slider__track" style={{ position: 'absolute', inset: 0, borderRadius: 4, background: 'var(--xr-semantic-color-border)' }} />
      <div className="xr-slider__fill" style={{ position: 'absolute', borderRadius: 4, background: 'var(--xr-semantic-color-primary)', ...(orientation === 'horizontal' ? { left: 0, width: `${pct}%`, top: 0, bottom: 0 } : { top: 0, height: `${pct}%`, left: 0, right: 0 }) }} />
      <input type="range" min={min} max={max} step={step} value={value ?? defaultValue} disabled={isDisabled}
        onChange={(e) => set(Number(e.target.value))}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: 'pointer' }}
        aria-label="Slider" role="slider"
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value ?? defaultValue}
      />
    </div>
  )
}
```

- [ ] **Step 4: Implement `Combobox.tsx`** (composition primitive — stub with internal context)

```tsx
import { createContext, useCallback, useContext, useState } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
const Ctx = createContext<{ open: boolean; setOpen: (o: boolean) => void; active: string; setActive: (a: string) => void; selected: string[]; setSelected: (s: string[]) => void }>({ open: false, setOpen: () => {}, active: '', setActive: () => {}, selected: [], setSelected: () => {} })

function Root({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [active, setActive] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  return <Ctx.Provider value={{ open, setOpen, active, setActive, selected, setSelected }}>{children}</Ctx.Provider>
}
function Input({ placeholder, value, onChange, className, ...rest }: { placeholder?: string; value?: string; onChange?: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { open, setOpen } = useContext(Ctx)
  const { onFocus, onBlur, focusWithin } = useFocusRing()
  return <input className={useClassName({ className }, ['xr-combobox__input', focusWithin && 'xr-combobox__input--focus'])} placeholder={placeholder} value={value}
    onChange={(e) => { onChange?.(e.target.value); setOpen(true) }}
    onFocus={onFocus} onBlur={() => { onBlur(); setTimeout(() => setOpen(false), 150) }}
    role="combobox" aria-expanded={open} aria-autocomplete="list" {...rest} />
}
function List({ open, children, className }: { open?: boolean; children: React.ReactNode; className?: string }) {
  const { open: ctxOpen } = useContext(Ctx)
  const isOpen = open ?? ctxOpen
  if (!isOpen) return null
  return <ul className={useClassName({ className }, ['xr-combobox__list'])} role="listbox">{children}</ul>
}
function Option({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { selected, setSelected, setOpen } = useContext(Ctx)
  return <li role="option" aria-selected={selected.includes(value)}
    className={useClassName({ className }, ['xr-combobox__option'])}
    onMouseDown={() => { setSelected([...selected, value]); setOpen(false) }}
  >{children}</li>
}
function Clear({ onClear }: { onClear?: () => void }) {
  const { setSelected } = useContext(Ctx)
  return <button type="button" aria-label="Clear" onClick={() => { onClear?.(); setSelected([]) }} className="xr-combobox__clear">×</button>
}
export const Combobox = { Root, Input, List, Option, Clear }
```

- [ ] **Step 5: Implement `RadioGroup.tsx`**

```tsx
import { useCallback, useContext, createContext } from 'react'
import type { ReactNode } from 'react'
const GroupCtx = createContext<{ value: string; onChange: (v: string) => void }>({ value: '', onChange: () => {} })
export const useRadioGroupCtx = () => useContext(GroupCtx)
export interface RadioGroupProps { value?: string; onValueChange?: (v: string) => void; orientation?: 'horizontal'|'vertical'; disabled?: boolean; children: ReactNode; className?: string }
export function RadioGroup({ value = '', onValueChange, orientation = 'vertical', disabled, children, className }: RadioGroupProps) {
  const onChange = useCallback((v: string) => { onValueChange?.(v) }, [onValueChange])
  return (
    <GroupCtx.Provider value={{ value, onChange }}>
      <div role="radiogroup" aria-orientation={orientation}
        className={`xr-radiogroup xr-radiogroup--${orientation} ${className ?? ''}`}
        style={{ display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column', gap: '8px' }}>
        {children}
      </div>
    </GroupCtx.Provider>
  )
}
```

Wire into `Radio.tsx`: import `useRadioGroupCtx` and call `onChange` from it.

- [ ] **Step 6: Implement `CheckboxGroup.tsx`**

```tsx
import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
const Ctx = createContext<{ value: string[]; toggle: (v: string) => void }>({ value: [], toggle: () => {} })
export const useCheckboxGroupCtx = () => useContext(Ctx)
export interface CheckboxGroupProps { value?: string[]; onValueChange?: (v: string[]) => void; disabled?: boolean; children: ReactNode; className?: string }
export function CheckboxGroup({ value, onValueChange, disabled, children, className }: CheckboxGroupProps) {
  const [internal, setInternal] = useState<string[]>([])
  const val = value ?? internal
  const toggle = useCallback((v: string) => { const next = val.includes(v) ? val.filter(x => x !== v) : [...val, v]; onValueChange ? onValueChange(next) : setInternal(next) }, [val, onValueChange])
  return <Ctx.Provider value={{ value: val, toggle }}><div className={`xr-checkbox-group ${className ?? ''}`} role="group">{children}</div></Ctx.Provider>
}
```

- [ ] **Step 7: Implement `InputGroup.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
import type { ReactNode } from 'react'
export interface InputGroupProps { children: ReactNode; className?: string }
export function InputGroup({ children, className }: InputGroupProps) {
  return <div className={useClassName({ className }, ['xr-input-group'])} style={{ display: 'flex', gap: 0, borderRadius: 'var(--xr-radius-md)', overflow: 'hidden', border: '1px solid var(--xr-semantic-color-border)' }}>{children}</div>
}
```

- [ ] **Step 8: Implement `NumberInput.tsx`**

```tsx
import { useState, useCallback } from 'react'
import { useDisabled, useClassName } from '../../primitives'
export interface NumberInputProps { value?: number; onValueChange?: (n: number) => void; min?: number; max?: number; step?: number; variant?: 'default'|'compact'; disabled?: boolean; className?: string }
export function NumberInput({ value, onValueChange, min = -Infinity, max = Infinity, step = 1, variant = 'default', disabled, className }: NumberInputProps) {
  const [internal, setInternal] = useState(value ?? 0)
  const current = value ?? internal
  const change = useCallback((n: number) => { const clamped = Math.min(max, Math.max(min, n)); setInternal(clamped); onValueChange?.(clamped) }, [min, max, onValueChange])
  return (
    <div className={useClassName({ className }, ['xr-number-input', `xr-number-input--${variant}`])} style={{ display: 'inline-flex', gap: 0 }}>
      {variant === 'compact' && <button type="button" disabled={disabled || current <= min} onClick={() => change(current - step)} aria-label="Decrease" className="xr-number-input__btn xr-number-input__btn--minus">−</button>}
      <input type="number" value={current} min={min} max={max} step={step} disabled={disabled}
        onChange={(e) => change(Number(e.target.value))} role="spinbutton" aria-valuenow={current} aria-valuemin={min} aria-valuemax={max}
        className="xr-number-input__input" style={{ width: 56, textAlign: 'center', border: 'none', background: 'transparent' }} />
      {variant === 'compact' && <button type="button" disabled={disabled || current >= max} onClick={() => change(current + step)} aria-label="Increase" className="xr-number-input__btn xr-number-input__btn--plus">+</button>}
      {variant === 'default' && (
        <div className="xr-number-input__steppers" style={{ display: 'flex', flexDirection: 'column' }}>
          <button type="button" disabled={disabled || current >= max} onClick={() => change(current + step)} aria-label="Increase" className="xr-number-input__btn">↑</button>
          <button type="button" disabled={disabled || current <= min} onClick={() => change(current - step)} aria-label="Decrease" className="xr-number-input__btn">↓</button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 9: Form advanced CSS** (append inside `@layer xerena-components` in `base.css`):

```css
.xr-slider { touch-action: none; user-select: none; }
.xr-combobox__list { list-style: none; padding: 0; margin: 0; border: 1px solid var(--xr-semantic-color-border); border-radius: calc(var(--xr-radius-md) * 1px); max-height: 240px; overflow: auto; background: var(--xr-semantic-color-background); }
.xr-combobox__option { padding: calc(var(--xr-spacing-2) * 1px) calc(var(--xr-spacing-3) * 1px); cursor: pointer; }
.xr-combobox__option:hover, .xr-combobox__option[aria-selected="true"] { background: var(--xr-semantic-color-surfaceHover); }
.xr-combobox__input--focus { border-color: var(--xr-semantic-color-primary); }
.xr-combobox__clear { background: none; border: none; cursor: pointer; font-size: 16px; padding-inline: calc(var(--xr-spacing-1) * 1px); }
.xr-input-group > input { flex: 1; border: none; padding-inline: calc(var(--xr-spacing-3) * 1px); height: 40px; }
.xr-input-group > input:focus-visible { outline: none; }
.xr-number-input { border: 1px solid var(--xr-semantic-color-border); border-radius: calc(var(--xr-radius-md) * 1px); height: 40px; }
.xr-number-input__btn { width: 40px; height: 40px; border: none; background: var(--xr-semantic-color-surface); cursor: pointer; font-weight: 600; color: var(--xr-semantic-color-text); transition: background-color calc(var(--xr-motion-duration-instant) * 1ms); }
.xr-number-input__btn:disabled { opacity: 0.5; cursor: default; }
.xr-number-input__btn:hover:not(:disabled) { background: var(--xr-semantic-color-surfaceHover); }
.xr-radiogroup { gap: calc(var(--xr-spacing-2) * 1px); }
.xr-checkbox-group { gap: calc(var(--xr-spacing-2) * 1px); display: flex; flex-direction: column; }
```

- [ ] **Step 10: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/components/form packages/react/src/styles/base.css
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add advanced form components"
```

---

### Task 14: Surfaces — Card, Avatar

**Files:**
- Create: `packages/react/src/components/surfaces/{Card,Avatar}.tsx`, `index.ts`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Card: { variant?: 'outlined'|'elevated'|'soft'|'interactive'|'flat'; padding?: SpacingKey; className?: string; children: ReactNode }`
- `Avatar: { variant?: 'image'|'initials'|'icon'; size?: 'sm'|'md'|'lg'|'xl'; shape?: 'square'|'circle'; src?: string; alt?: string; initials?: string; icon?: ReactNode; onClick?: () => void; className?: string }`

- [ ] **Step 1: Failing tests**

```tsx
// card.test.tsx
describe('Card', () => {
  it('applies variant, padding, and focus-visible for interactive', () => {
    render(<Card variant="interactive" padding="md">c</Card>)
    const el = screen.getByText('c')
    expect(el).toHaveClass('xr-card', 'xr-card--interactive')
    expect(el.style.padding).toBe('16px')
  })
})
```

```tsx
// avatar.test.tsx
describe('Avatar', () => {
  it('renders initials fallback', () => {
    render(<Avatar variant="initials" initials="AB" />)
    expect(screen.getByText('AB')).toHaveClass('xr-avatar__initials')
  })
  it('applies size classes', () => {
    render(<Avatar variant="initials" initials="X" size="xl" />)
    expect(screen.getByText('X')).toHaveClass('xr-avatar', 'xr-avatar--xl')
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Card.tsx`**

```tsx
import { useClassName, useFocusRing, usePress } from '../../primitives'
import { spacing } from '@xerena/tokens'
import type { CSSProperties, ReactNode } from 'react'
export interface CardProps { variant?: 'outlined'|'elevated'|'soft'|'interactive'|'flat'; padding?: keyof typeof spacing; className?: string; children: ReactNode }
const VARIANTS = { outlined: { border: '1px solid var(--xr-semantic-color-border)', background: 'var(--xr-semantic-color-background)', boxShadow: 'none' }, elevated: { border: 'none', background: 'var(--xr-semantic-color-background)', boxShadow: 'var(--xr-elevation-md)' }, soft: { border: 'none', background: 'var(--xr-semantic-color-surface)', boxShadow: 'none' }, interactive: { border: '1px solid var(--xr-semantic-color-border)', background: 'var(--xr-semantic-color-background)', boxShadow: 'var(--xr-elevation-xs)' }, flat: { border: 'none', background: 'transparent', boxShadow: 'none' } } as const
export function Card({ variant = 'outlined', padding = 'md', className, children }: CardProps) {
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  const { pressed, onPointerDown, onPointerUp, onPointerLeave } = usePress()
  const style: CSSProperties = { ...VARIANTS[variant], padding: spacing[padding] ? `${spacing[padding]}px` : undefined, borderRadius: 'var(--xr-radius-md)', transition: 'transform calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), box-shadow calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }
  if (variant === 'interactive') {
    style.cursor = 'pointer'
    style.transform = pressed ? 'translateY(-1px)' : undefined
    style.boxShadow = pressed ? 'var(--xr-elevation-sm)' : 'var(--xr-elevation-md)'
  }
  return <div className={useClassName({ className }, ['xr-card', `xr-card--${variant}`, variant === 'interactive' && focusWithin && 'xr-card--focus'])} style={style}
    tabIndex={variant === 'interactive' ? 0 : undefined} role={variant === 'interactive' ? 'button' : undefined}
    onFocus={onFocus} onBlur={onBlur} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave}>
    {children}
  </div>
}
```

- [ ] **Step 4: Implement `Avatar.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
import type { CSSProperties, ReactNode } from 'react'
export interface AvatarProps { variant?: 'image'|'initials'|'icon'; size?: 'sm'|'md'|'lg'|'xl'; shape?: 'square'|'circle'; src?: string; alt?: string; initials?: string; icon?: ReactNode; onClick?: () => void; className?: string }
const SIZES = { sm: 28, md: 40, lg: 56, xl: 80 } as const
export function Avatar({ variant = 'initials', size = 'md', shape = 'circle', src, alt, initials, icon, onClick, className }: AvatarProps) {
  const s = SIZES[size]
  const style: CSSProperties = { width: s, height: s, borderRadius: shape === 'circle' ? 'var(--xr-radius-full)' : 'var(--xr-radius-md)', background: 'var(--xr-semantic-color-surface)', color: 'var(--xr-semantic-color-textMuted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: onClick ? 'pointer' : undefined, transition: 'box-shadow calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }
  return (
    <div className={useClassName({ className }, ['xr-avatar', `xr-avatar--${size}`, `xr-avatar--${shape}`])} style={style}
      role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onClick={onClick} aria-label={alt}>
      {variant === 'image' && src && <img src={src} alt={alt ?? ''} className="xr-avatar__img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      {variant === 'initials' && <span className="xr-avatar__initials">{initials?.slice(0, 2).toUpperCase()}</span>}
      {variant === 'icon' && <span className="xr-avatar__icon">{icon}</span>}
    </div>
  )
}
```

- [ ] **Step 5: Verify + commit**

```bash
git add packages/react/src/components/surfaces packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add surface components"
```

---

### Task 15: Data — Table toolkit

**Files:**
- Create: `packages/react/src/components/data/table/{Table,Head,Body,Row,Cell,TableCheckbox,RowActions}.tsx`, `index.ts`, `useTableSelection.ts`, `types.ts`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Table: { variant?: 'striped'|'outlined'|'grid'|'hover'; size?: 'sm'|'md'|'lg'; frozenHeader?: boolean; maxHeight?: number|string }` — Root (provides context)
- `Head`, `Body`, `Row`, `Cell` (render with `<th>/<td>` appropriate; `Row` accepts `expandable`, `expandContent`, `aria-expanded`)
- `TableCheckbox: { checked: boolean | 'indeterminate'; onCheckedChange: (v: boolean) => void; ariaLabel?: string }`
- `RowActions: { children: ReactNode; actionsPosition?: 'left'|'right'; sticky?: boolean }`

- [ ] **Step 1: Failing tests**

```tsx
// table.test.tsx
describe('Table', () => {
  it('renders with role table', () => {
    render(<Table><Head><Row><Cell as="th">N</Cell></Row></Head><Body><Row><Cell>1</Cell></Row></Body></Table>)
    expect(screen.getByRole('table')).toHaveClass('xr-table', 'xr-table--outlined')
  })
})
describe('Table selection', () => {
  it('select-all checkbox is indeterminate when some rows selected', () => {
    render(
      <Table><Head><Row><TableCheckbox checked="indeterminate" onCheckedChange={() => {}} /></Row></Head>
      <Body><Row><TableCheckbox checked={true} onCheckedChange={() => {}} /></Row></Body></Table>
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  })
})
describe('Row expand', () => {
  it('sets aria-expanded on expand trigger', async () => {
    render(
      <Table><Body><Row expandable expandContent={<span>child</span>}>
        <Cell>parent</Cell>
      </Row></Body></Table>
    )
    expect(screen.getByText('parent').closest('[role="row"]')).toHaveAttribute('aria-expanded', 'false')
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `types.ts` and selection hook**

```ts
// types.ts
export interface TableContextValue { variant: string; size: string; frozenHeader: boolean }
export interface SelectionContextValue { selected: Set<string>; toggle: (id: string) => void; isAllSelected: boolean; isIndeterminate: boolean; toggleAll: (ids: string[]) => void }
```

```ts
// useTableSelection.ts
import { useState, useCallback, useMemo } from 'react'
export function useTableSelection(controlledIds?: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set(controlledIds))
  const toggle = useCallback((id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }), [])
  const isAllSelected = useCallback((ids: string[]) => ids.length > 0 && ids.every(id => selected.has(id)), [selected])
  const isIndeterminate = useCallback((ids: string[]) => ids.some(id => selected.has(id)) && !ids.every(id => selected.has(id)), [selected])
  return { selected, toggle, isAllSelected, isIndeterminate }
}
```

- [ ] **Step 4: Implement `Table`, `Head`, `Body`, `Row`, `Cell`**

```tsx
// Table.tsx
import { createContext, useContext } from 'react'
import { useClassName } from '../../primitives/useClassName'
import type { TableContextValue, types } from './types'
import type { ReactNode } from 'react'
const TableCtx = createContext<TableContextValue>({ variant: 'outlined', size: 'md', frozenHeader: false })
export const useTableCtx = () => useContext(TableCtx)
export interface TableProps { variant?: 'striped'|'outlined'|'grid'|'hover'; size?: 'sm'|'md'|'lg'; frozenHeader?: boolean; maxHeight?: number|string; className?: string; children: ReactNode }
export function Table({ variant = 'outlined', size = 'md', frozenHeader = false, maxHeight, className, children }: TableProps) {
  return (
    <TableCtx.Provider value={{ variant, size, frozenHeader }}>
      <div style={maxHeight ? { overflow: 'auto', maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : undefined}
        className={useClassName({ className }, [`xr-table-scrollable ${frozenHeader ? 'xr-table--scrollable' : ''}`])}>
        <table className={`xr-table xr-table--${variant} xr-table--${size} ${frozenHeader ? 'xr-table--frozen' : ''}`}>{children}</table>
      </div>
    </TableCtx.Provider>
  )
}
```

```tsx
// Head.tsx
import { useTableCtx } from './Table'
import type { ReactNode } from 'react'
export function Head({ children, className }: { children: ReactNode; className?: string }) {
  const { frozenHeader } = useTableCtx()
  return <thead className={className} style={frozenHeader ? { position: 'sticky', top: 0, zIndex: 1, background: 'var(--xr-semantic-color-background)' } : undefined}>{children}</thead>
}
```

```tsx
// Body.tsx
import type { ReactNode } from 'react'
export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>
}
```

```tsx
// Row.tsx
import { useState, useCallback } from 'react'
import { useClassName } from '../../primitives/useClassName'
import type { ReactNode } from 'react'
export interface RowProps { expandable?: boolean; expandContent?: ReactNode; className?: string; children: ReactNode }
export function Row({ expandable, expandContent, className, children }: RowProps) {
  const [expanded, setExpanded] = useState(false)
  const toggle = useCallback(() => setExpanded(p => !p), [])
  return (
    <>
      <tr className={useClassName({ className }, [`xr-table-row ${expandable ? 'xr-table-row--expandable' : ''}`])} aria-expanded={expandable ? expanded : undefined}>
        {expandable && <td className="xr-table-row__expand" onClick={toggle} style={{ cursor: 'pointer', width: 32, textAlign: 'center' }} aria-label="Toggle expand">
          <span style={{ display: 'inline-block', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }}>›</span>
        </td>}
        {children}
      </tr>
      {expanded && expandContent && (
        <tr className="xr-table-row__expanded">
          <td colSpan={99} style={{ padding: '12px 16px', background: 'var(--xr-semantic-color-surface)' }}>{expandContent}</td>
        </tr>
      )}
    </>
  )
}
```

```tsx
// Cell.tsx
import type { ReactNode, ComponentPropsWithoutRef } from 'react'
export interface CellProps extends Omit<ComponentPropsWithoutRef<'td'>, 'as'> { as?: 'td' | 'th'; children?: ReactNode; className?: string }
export function Cell({ as, children, className, ...rest }: CellProps) {
  const Comp = as === 'th' ? 'th' : 'td'
  return <Comp className={className} scope={as === 'th' ? 'col' : undefined} {...rest}>{children}</Comp>
}
```

- [ ] **Step 5: Implement `TableCheckbox.tsx`**

```tsx
import { useCallback, useRef, useEffect } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
export interface TableCheckboxProps { checked: boolean | 'indeterminate'; onCheckedChange: (v: boolean) => void; ariaLabel?: string; className?: string }
export function TableCheckbox({ checked, onCheckedChange, ariaLabel = 'Select row', className }: TableCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = checked === 'indeterminate' }, [checked])
  const { focusWithin, onFocus, onBlur } = useFocusRing()
  return <span className={useClassName({ className }, ['xr-table-checkbox', focusWithin && 'xr-table-checkbox--focus'])} style={{ display: 'inline-flex' }}>
    <input ref={ref} type="checkbox" checked={checked === true} aria-checked={checked === true || checked === 'indeterminate' ? checked : undefined}
      aria-label={ariaLabel} onChange={(e) => onCheckedChange(e.target.checked)}
      onFocus={onFocus} onBlur={onBlur} className="xr-table-checkbox__input" />
  </span>
}
```

- [ ] **Step 6: Implement `RowActions.tsx`**

```tsx
import type { ReactNode } from 'react'
import { useClassName } from '../../primitives/useClassName'
export interface RowActionsProps { children: ReactNode; actionsPosition?: 'left' | 'right'; sticky?: boolean; className?: string }
export function RowActions({ children, actionsPosition = 'right', sticky = false, className }: RowActionsProps) {
  return (
    <td className={useClassName({ className }, [`xr-row-actions xr-row-actions--${actionsPosition}`, sticky && 'xr-row-actions--sticky'])}
        style={{ position: sticky ? 'sticky' : undefined, right: sticky ? 0 : undefined, background: 'var(--xr-semantic-color-background)' }}>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </td>
  )
}
```

- [ ] **Step 7: Table CSS** (append inside `@layer xerena-components` in `base.css`):

```css
.xr-table { width: 100%; border-collapse: collapse; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); }
.xr-table--outlined { border: 1px solid var(--xr-semantic-color-border); }
.xr-table--outlined th, .xr-table--outlined td { border-bottom: 1px solid var(--xr-semantic-color-border); }
.xr-table--grid th, .xr-table--grid td { border: 1px solid var(--xr-semantic-color-border); }
.xr-table--striped tbody tr:nth-child(even) { background: var(--xr-semantic-color-surface); }
.xr-table--hover tbody tr:hover { background: var(--xr-semantic-color-surfaceHover); }
.xr-table--sm td, .xr-table--sm th { padding: calc(var(--xr-spacing-1) * 1px) calc(var(--xr-spacing-2) * 1px); }
.xr-table--md td, .xr-table--md th { padding: calc(var(--xr-spacing-2) * 1px) calc(var(--xr-spacing-3) * 1px); }
.xr-table--lg td, .xr-table--lg th { padding: calc(var(--xr-spacing-3) * 1px) calc(var(--xr-spacing-4) * 1px); }
.xr-table th { font-weight: 600; text-align: left; color: var(--xr-semantic-color-textMuted); }
.xr-table--frozen thead { position: sticky; top: 0; z-index: 1; background: var(--xr-semantic-color-background); }
.xr-table--scrollable { overflow: auto; }
.xr-table-checkbox__input { cursor: pointer; width: 16px; height: 16px; }
.xr-row-actions--sticky { position: sticky; right: 0; background: var(--xr-semantic-color-background); z-index: 1; }
```

- [ ] **Step 8: Verify + commit**

```bash
git add packages/react/src/components/data packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add table toolkit"
```

---

### Task 16: Data — Pagination (with hover/focus preview popover)

**Files:**
- Create: `packages/react/src/components/data/pagination/Pagination.tsx`, `index.ts`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: `pagination.test.tsx`

**Interfaces (produced):**
- `Pagination: { total: number; pageSize: number; current: number; onChange: (page: number) => void; siblingCount?: number; variant?: 'page'|'simple'; renderPagePreview?: (page: number) => ReactNode; className?: string }`

- [ ] **Step 1: Failing tests**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'
describe('Pagination', () => {
  it('renders page buttons with aria-current on the active page', () => {
    render(<Pagination total={20} pageSize={5} current={2} onChange={() => {}} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page')
  })
  it('renders simple variant with prev/next only', () => {
    render(<Pagination total={20} pageSize={5} current={1} onChange={() => {}} variant="simple" />)
    expect(screen.getByText('1 / 4')).toBeInTheDocument()
  })
  it('shows preview popover on hover when renderPagePreview provided', async () => {
    const Preview = () => <span>Preview</span>
    render(<Pagination total={20} pageSize={5} current={1} onChange={() => {}} renderPagePreview={() => <Preview />} />)
    const page3 = screen.getByText('3')
    await userEvent.hover(page3)
    expect(screen.queryByText('Preview')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Pagination.tsx`**

```tsx
import { useCallback, useRef, useState } from 'react'
import { useClassName, useReducedMotionSync } from '../../primitives'
import { PreviewPopover } from '../../../primitives/PreviewPopover'
import type { ReactNode } from 'react'
export interface PaginationProps { total: number; pageSize: number; current: number; onChange: (page: number) => void; siblingCount?: number; variant?: 'page'|'simple'; renderPagePreview?: (page: number) => ReactNode; className?: string }
export function Pagination({ total, pageSize, current, onChange, siblingCount = 1, variant = 'page', renderPagePreview, className }: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  const { reduced } = useReducedMotionSync()
  const [hoveredPage, setHoveredPage] = useState<number | null>(null)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const onLeave = useCallback(() => { setHoveredPage(null); setAnchor(null) }, [])
  if (variant === 'simple') {
    return <nav aria-label="Pagination" className={useClassName({ className }, ['xr-pagination xr-pagination--simple'])}><span>1 / {pages}</span><button onClick={() => onChange(current + 1)} disabled={current >= pages} aria-label="Next">→</button></nav>
  }
  const range: (number | 'ellipsis')[] = []
  const left = Math.max(1, current - siblingCount)
  const right = Math.min(pages, current + siblingCount)
  if (left > 2) range.push(1)
  else for (let i = 1; i < left; i++) range.push(i)
  for (let i = left; i <= right; i++) range.push(i)
  if (right < pages - 1) range.push('ellipsis')
  else for (let i = right + 1; i <= pages; i++) range.push(i)
  return (
    <nav aria-label="Pagination" className={useClassName({ className }, ['xr-pagination'])}>
      <button disabled={current <= 1} onClick={() => onChange(current - 1)} aria-label="Previous">←</button>
      <ul style={{ listStyle: 'none', display: 'flex', gap: 4, padding: 0, margin: 0 }}>
        {range.map((p, i) => (
          p === 'ellipsis' ? <li key={`e${i}`} style={{ paddingInline: 4, color: 'var(--xr-semantic-color-textMuted)' }}>…</li> : (
            <li key={p} style={{ position: 'relative' }}>
              <button
                aria-current={p === current ? 'page' : undefined}
                onClick={() => onChange(p as number)}
                onMouseEnter={(e) => { if (renderPagePreview) { setHoveredPage(p as number); setAnchor(e.currentTarget) } }}
                onMouseLeave={onLeave}
                onFocus={(e) => { if (renderPagePreview) { setHoveredPage(p as number); setAnchor(e.currentTarget) } }}
                onBlur={onLeave}
                className="xr-pagination__page"
                style={{ paddingInline: 8, border: p === current ? '1px solid var(--xr-semantic-color-primary)' : '1px solid transparent', borderRadius: 'var(--xr-radius-md)', background: p === current ? 'var(--xr-semantic-color-primary)' : 'transparent', color: p === current ? 'var(--xr-semantic-color-textOnStrong)' : 'var(--xr-semantic-color-text)' }}
              >{p}</button>
            </li>
          )
        ))}
      </ul>
      <button disabled={current >= pages} onClick={() => onChange(current + 1)} aria-label="Next">→</button>
      <PreviewPopover open={hoveredPage !== null && !!renderPagePreview} label={`Page ${hoveredPage}`} anchor={anchor}>
        {hoveredPage !== null && renderPagePreview?.(hoveredPage)}
      </PreviewPopover>
    </nav>
  )
}
```

- [ ] **Step 4: Pagination CSS** (append inside `@layer xerena-components` in `base.css`):

```css
.xr-pagination { display: flex; align-items: center; gap: calc(var(--xr-spacing-1) * 1px); font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); }
.xr-pagination button { border: none; background: none; cursor: pointer; color: var(--xr-semantic-color-text); border-radius: calc(var(--xr-radius-md) * 1px); }
.xr-pagination button:disabled { opacity: 0.4; cursor: default; }
.xr-pagination__page { transition: background-color calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), color calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)); }
.xr-pagination--simple span { margin-inline: 4px 8px; }
```

- [ ] **Step 5: Verify + commit**

```bash
git add packages/react/src/components/data/pagination packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add pagination with preview popover"
```

---

### Task 17: Feedback — Spinner, Progress (multimodal)

**Files:**
- Create: `packages/react/src/components/feedback/{Spinner,Progress}.tsx`, `index.ts`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Spinner: { size?: 'sm'|'md'|'lg'; className?: string; label?: string }`
- `Progress: { value?: number; variant?: 'bar'|'pageTop'|'pageBottom'|'mouse'|'circle'; size?: number; stroke?: number; className?: string; label?: string }`

- [ ] **Step 1: Failing tests**

```tsx
// spinner.test.tsx
describe('Spinner', () => {
  it('renders accessible spinner with role=status and aria-label', () => {
    render(<Spinner label="Loading…" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading…')
    expect(screen.getByText('Loading…')).toHaveClass('sr-only')
  })
  it('applies size class', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByRole('status').firstChild).toHaveClass('xr-spinner', 'xr-spinner--lg')
  })
})
```

```tsx
// progress.test.tsx
describe('Progress', () => {
  it('bar: renders role=progressbar with correct value', () => {
    render(<Progress value={45} label="Upload progress" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '45')
    expect(bar).toHaveAttribute('aria-label', 'Upload progress')
  })
  it('circle: renders svg-based ring', () => {
    render(<Progress variant="circle" value={70} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.querySelector('svg circle')).not.toBeNull()
  })
  it('pageTop: renders fixed-position bar', () => {
    render(<Progress variant="pageTop" value={20} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.style.position).toBe('fixed')
    expect(bar.style.top).toBe('0px')
  })
  it('mouse: renders aria-hidden cursor-following ring', () => {
    render(<Progress variant="mouse" value={60} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar.querySelector('.xr-progress__ring')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Spinner.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
export interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; label?: string }
export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={useClassName({ className }, ['xr-spinner-host'])}>
      <span aria-hidden="true" className={`xr-spinner xr-spinner--${size}`} />
      <span className="sr-only">{label}</span>
    </span>
  )
}
```

- [ ] **Step 4: Implement `Progress.tsx`**

```tsx
import { useReducedMotionSync } from '../../primitives/useReducedMotionSync'
import { useClassName } from '../../primitives/useClassName'
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
export interface ProgressProps { value?: number; variant?: 'bar' | 'pageTop' | 'pageBottom' | 'mouse' | 'circle'; size?: number; stroke?: number; className?: string; label?: string }
export function Progress({ value = 0, variant = 'bar', size = 80, stroke = 8, className, label }: ProgressProps) {
  const { reduced } = useReducedMotionSync()
  const ringRef = useRef<SVGCircleElement>(null)
  const clamp = Math.max(0, Math.min(100, value))

  // mouse cursor tracking
  useEffect(() => {
    if (variant !== 'mouse' || reduced) return
    const handler = (e: MouseEvent) => {
      if (!ringRef.current) return
      ringRef.current.style.left = `${e.clientX}px`
      ringRef.current.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [variant, reduced])

  if (variant === 'circle') {
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (clamp / 100) * circ
    return (
      <div role="progressbar" aria-valuenow={clamp} aria-valuemin={0} aria-valuemax={100} aria-label={label}
        className={useClassName({ className }, ['xr-progress', 'xr-progress--circle'])}>
        <svg width={size} height={size} className="xr-progress__svg">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--xr-semantic-color-border)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--xr-semantic-color-primary)" strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={reduced ? offset : undefined}
            className="xr-progress__circle"
            style={reduced ? undefined : { transition: 'stroke-dashoffset calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' } as CSSProperties}
          />
        </svg>
      </div>
    )
  }

  if (variant === 'mouse') {
    return (
      <div role="progressbar" aria-hidden="true" aria-valuenow={clamp} aria-valuemin={0} aria-valuemax={100} aria-label={label}
        className={useClassName({ className }, ['xr-progress xr-progress--mouse'])}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}>
        <div ref={ringRef as any} className="xr-progress__ring"
          style={{
            position: 'absolute', width: 40, height: 40, borderRadius: '50%',
            border: '3px solid var(--xr-semantic-color-primary)',
            borderTopColor: 'transparent',
            transform: 'translate(-50%,-50%)',
            transition: reduced ? undefined : 'border-color calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))'
          }}>
          <span className="sr-only">{clamp}%</span>
        </div>
      </div>
    )
  }

  const isFixed = variant === 'pageTop' || variant === 'pageBottom'
  const fixedStyle: CSSProperties = isFixed ? { position: 'fixed', left: 0, right: 0, height: 3, zIndex: 40, ...(variant === 'pageTop' ? { top: 0 } : { bottom: 0 }) } : { width: '100%', height: 8, borderRadius: 'var(--xr-radius-full)' }
  return (
    <div role="progressbar" aria-valuenow={clamp} aria-valuemin={0} aria-valuemax={100} aria-label={label}
      className={useClassName({ className }, [`xr-progress xr-progress--${variant}`])}
      style={{ ...fixedStyle, background: 'var(--xr-semantic-color-border)', overflow: 'hidden' }}>
      <div className="xr-progress__fill" style={{
        height: '100%', width: `${clamp}%`, background: 'var(--xr-semantic-color-primary)',
        transition: reduced ? undefined : 'width calc(var(--xr-motion-duration-base) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))'
      }} />
    </div>
  )
}
```

- [ ] **Step 5: Progress CSS** (append inside `@layer xerena-components`):

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
.xr-spinner { display: block; border: 2px solid var(--xr-semantic-color-border); border-top-color: var(--xr-semantic-color-primary); border-radius: var(--xr-radius-full); animation: xr-spin 0.8s linear infinite; }
.xr-spinner--sm { width: 16px; height: 16px; }
.xr-spinner--md { width: 24px; height: 24px; }
.xr-spinner--lg { width: 40px; height: 40px; }
@keyframes xr-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .xr-spinner { animation: none; } }
.xr-progress--pageTop, .xr-progress--pageBottom { z-index: 40; }
```

- [ ] **Step 6: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/components/feedback packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add spinner and multimodal progress"
```

---

### Task 18: Feedback — Message/Alert, Tooltip, Toast

**Files:**
- Create: `packages/react/src/components/feedback/{Message,Tooltip,Toast}.tsx`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Message: { tone?: 'neutral'|'info'|'success'|'warning'|'danger'; position?: 'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'; title?: string; description?: string; icon?: ReactNode; dismissible?: boolean; onDismiss?: () => void; children?: ReactNode }`
- `Tooltip: { children: ReactNode; content: ReactNode; position?: 'topStart'|'topCenter'|'topEnd'|'bottomStart'|'bottomCenter'|'bottomEnd'; delay?: number; className?: string }`
- `Toast: { variant?: 'success'|'danger'|'warning'|'info'|'neutral'; title?: string; description?: string; action?: { label: string; onClick: () => void }; dismissible?: boolean; onDismiss?: () => void; autoHideDuration?: number; className?: string }`
- `toast(options): void` — imperative API, renders inside an implicit `ToastContainer` fixed at configured position.

- [ ] **Step 1: Failing tests**

```tsx
// message.test.tsx
describe('Message', () => {
  it('renders with role=alert and danger tone', () => {
    render(<Message tone="danger" title="Error" description="Invalid input" />)
    expect(screen.getByRole('alert')).toHaveClass('xr-message', 'xr-message--danger')
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
  it('calls onDismiss when close clicked', async () => {
    const onDismiss = vi.fn()
    render(<Message tone="info" title="OK" dismissible onDismiss={onDismiss}>Info</Message>)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalled()
  })
})
```

```tsx
// tooltip.test.tsx
describe('Tooltip', () => {
  it('shows content on hover', async () => {
    render(<Tooltip content="Hint"><button>Btn</button></Tooltip>)
    expect(screen.queryByText('Hint')).not.toBeInTheDocument()
    await userEvent.hover(screen.getByText('Btn'))
    expect(await screen.findByText('Hint')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveAttribute('aria-label', 'Hint')
  })
})
```

```tsx
// toast.test.tsx
describe('Toast', () => {
  it('renders with role=status and auto-hides', async () => {
    render(<Toast title="Saved" autoHideDuration={100} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument(), { timeout: 200 })
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Message.tsx`**

```tsx
import { useClassName } from '../../primitives/useClassName'
import type { ReactNode } from 'react'
export interface MessageProps { tone?: 'neutral'|'info'|'success'|'warning'|'danger'; position?: 'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'; title?: string; description?: string; icon?: ReactNode; dismissible?: boolean; onDismiss?: () => void; className?: string; children?: ReactNode }
const ICONS: Record<string, ReactNode> = { success: '✓', info: 'ℹ', warning: '⚠', danger: '✕', neutral: '' }
const POS_MAP: Record<string, React.CSSProperties> = {
  'top-left': { top: 16, left: 16 }, 'top-center': { top: 16, left: '50%', transform: 'translateX(-50%)' }, 'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 }, 'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' }, 'bottom-right': { bottom: 16, right: 16 },
}
export function Message({ tone = 'neutral', position = 'bottom-center', title, description, icon, dismissible, onDismiss, className, children }: MessageProps) {
  return (
    <div role="alert" className={useClassName({ className }, ['xr-message', `xr-message--${tone}`])}
      style={{ position: 'fixed', zIndex: 40, ...POS_MAP[position], display: 'flex', alignItems: 'flex-start', gap: 'var(--xr-spacing-2)', background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '12px 16px', boxShadow: 'var(--xr-elevation-md)' }}>
      <span className="xr-message__icon">{icon ?? ICONS[tone]}</span>
      <div className="xr-message__body">
        {title && <div className="xr-message__title" style={{ fontWeight: 600, color: 'var(--xr-semantic-color-text)' }}>{title}</div>}
        {description && <div className="xr-message__desc" style={{ fontSize: 14, color: 'var(--xr-semantic-color-textMuted)' }}>{description}</div>}
        {children}
      </div>
      {dismissible && <button aria-label="Dismiss" onClick={onDismiss} className="xr-message__close" style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
    </div>
  )
}
```

- [ ] **Step 4: Implement `Tooltip.tsx`**

```tsx
import { useCallback, useRef, useState } from 'react'
import { useReducedMotionSync } from '../../primitives/useReducedMotionSync'
import { PreviewPopover } from '../../../primitives/PreviewPopover'
import type { ReactNode } from 'react'
export interface TooltipProps { children: ReactNode; content: ReactNode; position?: 'topStart' | 'topCenter' | 'topEnd' | 'bottomStart' | 'bottomCenter' | 'bottomEnd'; delay?: number; className?: string }
export function Tooltip({ children, content, position = 'topCenter', delay = 400, className }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const timerRef = useRef<number>(0)
  const { reduced } = useReducedMotionSync()
  const show = useCallback((el: HTMLElement) => {
    setAnchor(el)
    if (reduced) { setOpen(true); return }
    timerRef.current = window.setTimeout(() => setOpen(true), delay)
  }, [delay, reduced])
  const hide = useCallback(() => { clearTimeout(timerRef.current); setOpen(false) }, [])
  const isTop = position.startsWith('top')
  return (
    <div style={{ display: 'inline-block' }}
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={hide}
      onFocus={(e) => show(e.currentTarget)}
      onBlur={hide}
    >
      {children}
      <PreviewPopover open={open} label="" anchor={anchor} preferred={isTop ? 'top' : 'bottom'}>
        {content}
      </PreviewPopover>
    </div>
  )
}
```

- [ ] **Step 5: Implement `Toast.tsx` + imperative `toast()` API**

```tsx
import { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useClassName } from '../../primitives/useClassName'
import type { CSSProperties, ReactNode } from 'react'
export interface ToastOptions { variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral'; title?: string; description?: string; action?: { label: string; onClick: () => void }; dismissible?: boolean; onDismiss?: () => void; autoHideDuration?: number; position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'; className?: string }
export function Toast({ variant = 'neutral', title, description, action, dismissible, onDismiss, autoHideDuration = 5000, position = 'bottom-right', className }: ToastOptions) {
  useEffect(() => { if (autoHideDuration) { const t = setTimeout(() => onDismiss?.(), autoHideDuration); return () => clearTimeout(t) } }, [autoHideDuration, onDismiss])
  return (
    <div role={variant === 'danger' ? 'alert' : 'status'} className={`xr-toast xr-toast--${variant} ${className ?? ''}`}
      style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 50, background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '12px 16px', boxShadow: 'var(--xr-elevation-md)', display: 'flex', alignItems: 'flex-start', gap: 'var(--xr-spacing-2)', maxWidth: 360, animation: 'xr-toast-in calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))' } as CSSProperties}>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 600 }}>{title}</div>}
        {description && <div style={{ fontSize: 14, color: 'var(--xr-semantic-color-textMuted)', marginTop: 4 }}>{description}</div>}
        {action && <button onClick={action.onClick} className="xr-toast__action" style={{ background: 'none', border: 'none', color: 'var(--xr-semantic-color-primary)', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>{action.label}</button>}
      </div>
      {dismissible && <button aria-label="Dismiss" onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>}
    </div>
  )
}

// Imperative API — creates a container and manages a stack
let root: ReturnType<typeof createRoot> | null = null
const TOAST_STACK: Map<string, ToastOptions & { id: string }> = new Map()
let idCounter = 0
function flush() { if (!root) { const div = document.createElement('div'); div.id = 'xerena-toast-stack'; document.body.appendChild(div); root = createRoot(div) } root?.render(<div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 8 }}>{[...TOAST_STACK.values()].map(t => <Toast key={t.id} {...t} onDismiss={() => { TOAST_STACK.delete(t.id); flush() }} />)}</div>) }
export function toast(options: ToastOptions) { const id = `t${++idCounter}`; TOAST_STACK.set(id, { ...options, id }); flush() }
```

- [ ] **Step 6: Toast CSS** (append inside `@layer xerena-components`):

```css
@keyframes xr-toast-in { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.xr-toast { transition: transform calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-exit)), opacity calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-exit)); }
```

- [ ] **Step 7: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/components/feedback packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add message, tooltip, and toast components"
```

---

### Task 19: Feedback — Dialog, Drawer, Popover

**Files:**
- Create: `packages/react/src/components/feedback/{Dialog,Drawer,Popover}.tsx`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Dialog: { Root, Portal, Overlay, Content, Close, Title, Description }` (composition)
- `Drawer: { Root, Trigger, Content }` with `side?: 'left'|'right'|'top'|'bottom'`, `size?: 'xs'|'sm'|'md'|'lg'`
- `Popover: { Root, Trigger, Content }` with `side?: 'top'|'bottom'|'left'|'right'`

- [ ] **Step 1: Failing tests**

```tsx
// dialog.test.tsx
describe('Dialog', () => {
  it('renders into portal with aria-modal when open', () => {
    render(<Dialog.Root open><Dialog.Portal><Dialog.Overlay /><Dialog.Content><Dialog.Title>Hi</Dialog.Title><Dialog.Description>Desc</Dialog.Description></Dialog.Content></Dialog.Portal></Dialog.Root>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Hi').closest('[data-xerena-overlay]')).not.toBeNull()
  })
  it('calls onClose on Escape', async () => {
    const onClose = vi.fn()
    render(<Dialog.Root open onClose={onClose}><Dialog.Portal><Dialog.Overlay /><Dialog.Content>o</Dialog.Content></Dialog.Portal></Dialog.Root>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
```

```tsx
// drawer.test.tsx
describe('Drawer', () => {
  it('slides in from right by default', () => {
    render(<Drawer.Root open><Drawer.Content>Content</Drawer.Content></Drawer.Root>)
    expect(screen.getByText('Content')).toHaveClass('xr-drawer', 'xr-drawer--right')
  })
})
```

```tsx
// popover.test.tsx
describe('Popover', () => {
  it('renders content in portal when open', () => {
    render(<Popover.Root open><Popover.Trigger><button>Go</button></Popover.Trigger><Popover.Content>Panel</Popover.Content></Popover.Root>)
    expect(screen.getByText('Panel')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Dialog.tsx`**

```tsx
import { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { OverlayPrimitive } from '../../../primitives/OverlayPrimitive'
import type { ReactNode } from 'react'
const Ctx = createContext<{ open: boolean; onClose: () => void; labelledBy?: string }>({ open: false, onClose: () => {} })

function Root({ open, onClose = () => {}, children }: { open?: boolean; onClose?: () => void; children: ReactNode }) {
  const [internal, setInternal] = useState(false)
  const isOpen = open ?? internal
  return <Ctx.Provider value={{ open: isOpen, onClose: () => { setInternal(false); onClose() } }}>{children}</Ctx.Provider>
}
function Portal({ children }: { children: ReactNode }) {
  const { open, onClose, labelledBy } = useContext(Ctx)
  return <OverlayPrimitive open={open} onClose={onClose} focusTrap labeledBy={labelledBy}>{children}</OverlayPrimitive>
}
function Title({ id, children }: { id?: string; children: ReactNode }) {
  const { onClose } = useContext(Ctx)
  return <h2 id={id} className="xr-dialog__title">{children}</h2>
}
function Description({ id, children }: { id?: string; children: ReactNode }) { return <p id={id} className="xr-dialog__desc">{children}</p> }
function Content({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="dialog" aria-modal="true" className={`xr-dialog__content ${className ?? ''}`}
    style={{ background: 'var(--xr-semantic-color-background)', borderRadius: 'var(--xr-radius-lg)', padding: 24, maxWidth: 480, width: '100%', boxShadow: 'var(--xr-elevation-lg)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 41 }}>
    {children}
  </div>
}
function Close({ children = '✕', className }: { children?: ReactNode; className?: string }) {
  const { onClose } = useContext(Ctx)
  return <button onClick={onClose} aria-label="Close" className={className} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer' }}>{children}</button>
}
function Overlay() { return null } // handled internally by OverlayPrimitive via Portal
export const Dialog = { Root, Portal, Overlay, Content, Close, Title, Description }
```

- [ ] **Step 4: Implement `Drawer.tsx`**

```tsx
import { createContext, useContext, useState } from 'react'
import { OverlayPrimitive } from '../../../primitives/OverlayPrimitive'
import type { ReactNode } from 'react'
const Ctx = createContext<{ open: boolean; side: string; onClose: () => void }>({ open: false, side: 'right', onClose: () => {} })
function Root({ open, onClose = () => {}, side = 'right', size = 'md', children }: { open?: boolean; onClose?: () => void; side?: 'left'|'right'|'top'|'bottom'; size?: 'xs'|'sm'|'md'|'lg'; children: ReactNode }) {
  return <Ctx.Provider value={{ open: open ?? false, side, onClose }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { onClose } = useContext(Ctx)
  return <span onClick={onClose}>{children}</span>
}
function Content({ children, side: sideProp, className }: { children: ReactNode; side?: 'left'|'right'|'top'|'bottom'; className?: string }) {
  const { open, side, onClose } = useContext(Ctx)
  const s = side ?? sideProp
  const SIZES: Record<string, string> = { xs: '240px', sm: '320px', md: '400px', lg: '560px' }
  const isVertical = s === 'top' || s === 'bottom'
  const style: React.CSSProperties = { position: 'fixed', background: 'var(--xr-semantic-color-background)', zIndex: 41, transition: 'transform calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))', ...(s === 'right' ? { top: 0, bottom: 0, right: 0, width: SIZES[size ?? 'md'] } : s === 'left' ? { top: 0, bottom: 0, left: 0, width: SIZES[size ?? 'md'] } : s === 'top' ? { top: 0, left: 0, right: 0 } : { bottom: 0, left: 0, right: 0 }) }
  return <OverlayPrimitive open={open} onClose={onClose} focusTrap><div className={`xr-drawer xr-drawer--${s} ${className ?? ''}`} style={style}>{children}</div></OverlayPrimitive>
}
export const Drawer = { Root, Trigger, Content }
```

- [ ] **Step 5: Implement `Popover.tsx`**

```tsx
import { createContext, useCallback, useContext, useState } from 'react'
import { OverlayPrimitive } from '../../../primitives/OverlayPrimitive'
import { useReducedMotionSync } from '../../../primitives/useReducedMotionSync'
import { Slot } from '../../../primitives/Slot'
import type { ReactNode } from 'react'
const Ctx = createContext<{ open: boolean; toggle: () => void; onClose: () => void; anchor: HTMLElement | null; setAnchor: (el: HTMLElement | null) => void }>({ open: false, toggle: () => {}, onClose: () => {}, anchor: null, setAnchor: () => {} })
function Root({ open: controlledOpen, defaultOpen = false, onClose, children }: { open?: boolean; defaultOpen?: boolean; onClose?: () => void; children: ReactNode }) {
  const [internal, setInternal] = useState(defaultOpen)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const open = controlledOpen ?? internal
  const toggle = useCallback(() => { const next = !internal; setInternal(next); if (!next) onClose?.() }, [internal, onClose])
  const close = useCallback(() => { setInternal(false); onClose?.() }, [onClose])
  return <Ctx.Provider value={{ open, toggle, onClose: close, anchor, setAnchor }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { open, onClose, toggle, setAnchor } = useContext(Ctx)
  return (
    <Slot
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        setAnchor(e.currentTarget)
        toggle()
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && open) onClose()
        if (e.key === 'ArrowDown' && !open) toggle()
      }}
    >
      {children as React.ReactElement}
    </Slot>
  )
}
function Content({ children, side = 'bottom', className }: { children: ReactNode; side?: 'top'|'bottom'|'left'|'right'; className?: string }) {
  const { open, onClose, anchor } = useContext(Ctx)
  const { reduced } = useReducedMotionSync()
  if (!open || !anchor) return null
  const r = anchor.getBoundingClientRect()
  const isHorizontal = side === 'left' || side === 'right'
  const POS: Record<string, React.CSSProperties> = {
    top: { bottom: window.innerHeight - r.top + 8, left: r.left + r.width / 2, transform: 'translateX(-50%)' },
    bottom: { top: r.bottom + 8, left: r.left + r.width / 2, transform: 'translateX(-50%)' },
    left: { right: window.innerWidth - r.left + 8, top: r.top + r.height / 2, transform: 'translateY(-50%)' },
    right: { left: r.right + 8, top: r.top + r.height / 2, transform: 'translateY(-50%)' },
  }
  return (
    <OverlayPrimitive open onClose={onClose}>
      <div className={`xr-popover xr-popover--${side} ${className ?? ''}`}
        role="dialog" aria-label="Popover"
        style={{ position: 'fixed', zIndex: 50, background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '8px 0', boxShadow: 'var(--xr-elevation-md)', ...POS[side] }}>
        {children}
      </div>
    </OverlayPrimitive>
  )
}
export const Popover = { Root, Trigger, Content }
```

Note: the `Popover.Trigger` above uses `Slot` as the child element so `onClick`, `onKeyDown`, `aria-expanded` and `aria-haspopup` merge onto the trigger's element (e.g. a `Button` or `span`). Popover content anchors to the trigger rect; for right/left/top positions the `POS` map in `Content` uses `window.innerWidth`/`innerHeight` and re-renders on open — for live-boundary cases later phases may add a ResizeObserver, but not required here.

- [ ] **Step 6: Feedback CSS** (append inside `@layer xerena-components`):

```css
.xr-dialog__title { font-size: calc(var(--xr-typography-display-sm-fontSize) * 1px); color: var(--xr-semantic-color-text); margin: 0 0 8px; }
.xr-dialog__desc { font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); color: var(--xr-semantic-color-textMuted); margin: 0 0 16px; }
.xr-drawer { overflow: auto; }
.xr-popover__item { padding: calc(var(--xr-spacing-2) * 1px) calc(var(--xr-spacing-3) * 1px); cursor: pointer; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); color: var(--xr-semantic-color-text); }
.xr-popover__item:hover { background: var(--xr-semantic-color-surfaceHover); }
.xr-popover__separator { height: 1px; background: var(--xr-semantic-color-border); margin: calc(var(--xr-spacing-1) * 1px) 0; }
```

- [ ] **Step 7: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/components/feedback packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add dialog, drawer, and popover components"
```

---

### Task 20: Navigation — Tabs, Accordion, Menu, Breadcrumb

**Files:**
- Create: `packages/react/src/components/navigation/{Tabs,Accordion,Menu,Breadcrumb}.tsx`, `index.ts`
- Modify: `packages/react/src/styles/base.css`, `packages/react/src/index.ts`
- Test: per-component `.test.tsx`

**Interfaces (produced):**
- `Tabs: { Root, List, Trigger, Panel }` with `variant?: 'underline'|'pill'|'enclosed'`, `defaultValue?`
- `Accordion: { Root, Item, Header, Trigger, Content }` with `type?: 'single'|'multiple'`, `defaultValue?: string[]`
- `Menu: { Root, Trigger, Content, Item, Separator, Label, SubMenu? }` with `variant?: 'default'|'grid'`
- `Breadcrumb: { Item: { children, current?, href? } }` with `separator?: 'slash'|'chevron'|'dot'`

- [ ] **Step 1: Failing tests**

```tsx
// tabs.test.tsx
describe('Tabs', () => {
  it('renders tablist/tab/tabpanel with aria-selected', () => {
    render(<Tabs.Root defaultValue="a"><Tabs.List><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger></Tabs.List><Tabs.Panel value="a">Content A</Tabs.Panel></Tabs.Root>)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })
})
```

```tsx
// accordion.test.tsx
describe('Accordion', () => {
  it('renders header with aria-expanded', () => {
    render(<Accordion.Root type="single"><Accordion.Item value="a"><Accordion.Header><Accordion.Trigger>Q</Accordion.Trigger></Accordion.Header><Accordion.Content>A</Accordion.Content></Accordion.Item></Accordion.Root>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })
})
```

```tsx
// menu.test.tsx
describe('Menu', () => {
  it('renders menu with aria-haspopup', async () => {
    render(<Menu.Root><Menu.Trigger><button>Open</button></Menu.Trigger><Menu.Content><Menu.Item>Item 1</Menu.Item></Menu.Content></Menu.Root>)
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-haspopup', 'menu')
  })
})
```

```tsx
// breadcrumb.test.tsx
describe('Breadcrumb', () => {
  it('renders with aria-label and aria-current on last item', () => {
    render(<nav aria-label="Breadcrumb"><Breadcrumb.Item href="/">Home</Breadcrumb.Item><Breadcrumb.Item href="/a">A</Breadcrumb.Item><Breadcrumb.Item current>Current</Breadcrumb.Item></nav>)
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument()
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page')
  })
})
```

- [ ] **Step 2: Run to verify fail** — `pnpm --filter @xerena/react test` → FAIL.

- [ ] **Step 3: Implement `Tabs.tsx`** (context-driven, with underline indicator via ref)

```tsx
import { createContext, useCallback, useContext, useRef, useState, useEffect } from 'react'
import { useReducedMotionSync } from '../../../primitives/useReducedMotionSync'
import type { ReactNode } from 'react'
const Ctx = createContext<{ value: string; onChange: (v: string) => void; variant: string }>({ value: '', onChange: () => {}, variant: 'underline' })
function Root({ defaultValue = '', value, onValueChange, variant = 'underline', children }: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; variant?: 'underline' | 'pill' | 'enclosed'; children: ReactNode }) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const onChange = useCallback((v: string) => { onValueChange ? onValueChange(v) : setInternal(v) }, [onValueChange])
  return <Ctx.Provider value={{ value: current, onChange, variant }}>{children}</Ctx.Provider>
}
function List({ children, className }: { children: ReactNode; className?: string }) {
  const { variant } = useContext(Ctx)
  return <div role="tablist" className={`xr-tabs__list xr-tabs__list--${variant} ${className ?? ''}`} style={{ display: 'flex', gap: variant === 'pill' ? 4 : 0, borderBottom: variant === 'underline' ? '1px solid var(--xr-semantic-color-border)' : undefined }}>{children}</div>
}
function Trigger({ value, children, disabled, className }: { value: string; children: ReactNode; disabled?: boolean; className?: string }) {
  const { value: current, onChange } = useContext(Ctx)
  const ref = useRef<HTMLButtonElement>(null)
  const isSelected = current === value
  const { reduced } = useReducedMotionSync()
  // underline indicator
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  useEffect(() => { if (isSelected && ref.current && !reduced) { const r = ref.current.getBoundingClientRect(); const parent = ref.current.parentElement!.getBoundingClientRect(); setIndicator({ left: r.left - parent.left, width: r.width }) } }, [isSelected, reduced])
  return (
    <>
      <button ref={ref} role="tab" aria-selected={isSelected} aria-controls={`panel-${value}`} disabled={disabled}
        className={`xr-tabs__trigger ${isSelected ? 'xr-tabs__trigger--selected' : ''} ${className ?? ''}`}
        onClick={() => onChange(value)}>{children}</button>
      {indicator && <div className="xr-tabs__indicator" style={{ position: 'absolute', bottom: 0, left: indicator.left, width: indicator.width, height: 2, background: 'var(--xr-semantic-color-primary)', transition: reduced ? undefined : 'left calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)), width calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }} />}
    </>
  )
}
function Panel({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { value: current } = useContext(Ctx)
  if (current !== value) return null
  return <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`trigger-${value}`} className={className}>{children}</div>
}
export const Tabs = { Root, List, Trigger, Panel }
```

- [ ] **Step 4: Implement `Accordion.tsx`**

```tsx
import { createContext, useCallback, useContext, useState } from 'react'
import { useReducedMotionSync } from '../../../primitives/useReducedMotionSync'
import type { ReactNode } from 'react'
const Ctx = createContext<{ type: string; expanded: Set<string>; toggle: (v: string) => void }>({ type: 'single', expanded: new Set(), toggle: () => {} })
function Root({ type = 'single', defaultValue = [], children }: { type?: 'single' | 'multiple'; defaultValue?: string[]; children: ReactNode }) {
  const [expanded, setExpanded] = useState(new Set(defaultValue))
  const toggle = useCallback((v: string) => setExpanded(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : type === 'single' ? new Set([v]) : n.add(v); return n }), [type])
  return <Ctx.Provider value={{ type, expanded, toggle }}>{children}</Ctx.Provider>
}
function Item({ value, children }: { value: string; children: ReactNode }) {
  return <div className="xr-accordion__item" data-state="open">{children}</div>
}
function Header({ children }: { children: ReactNode }) { return <h3 className="xr-accordion__header">{children}</h3> }
function Trigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { expanded, toggle } = useContext(Ctx)
  const isOpen = expanded.has(value)
  const { reduced } = useReducedMotionSync()
  return (
    <button type="button" aria-expanded={isOpen} aria-controls={`acc-panel-${value}`} className={`xr-accordion__trigger ${className ?? ''}`}
      onClick={() => toggle(value)}
      style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', fontWeight: 600, color: 'var(--xr-semantic-color-text)' }}>
      {children}
      <span style={{ transition: reduced ? undefined : 'transform calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
    </button>
  )
}
function Content({ value, children }: { value: string; children: ReactNode }) {
  const { expanded, type } = useContext(Ctx)
  const { reduced } = useReducedMotionSync()
  const isOpen = expanded.has(value)
  if (!isOpen) return null
  return <div role="region" id={`acc-panel-${value}`} className="xr-accordion__content"
    style={{ overflow: 'hidden', transition: reduced ? undefined : 'max-height calc(var(--xr-motion-duration-moderate) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }}>
    {children}
  </div>
}
export const Accordion = { Root, Item, Header, Trigger, Content }
```

- [ ] **Step 5: Implement `Menu.tsx`**

```tsx
import { createContext, useContext, useState } from 'react'
import { useReducedMotionSync } from '../../../primitives/useReducedMotionSync'
import { OverlayPrimitive } from '../../../primitives/OverlayPrimitive'
import { Slot } from '../../../primitives/Slot'
import type { ReactNode } from 'react'
const Ctx = createContext<{ open: boolean; setOpen: (o: boolean) => void }>({ open: false, setOpen: () => {} })
function Root({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
}
function Trigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useContext(Ctx)
  return (
    <Slot aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
      {children as React.ReactElement}
    </Slot>
  )
}
function Content({ children, className }: { children: ReactNode; className?: string }) {
  const { open, setOpen } = useContext(Ctx)
  const { reduced } = useReducedMotionSync()
  if (!open) return null
  return <OverlayPrimitive open onClose={() => setOpen(false)}>
    <div role="menu" className={`xr-menu xr-menu--open ${className ?? ''}`}
      style={{ background: 'var(--xr-semantic-color-background)', border: '1px solid var(--xr-semantic-color-border)', borderRadius: 'var(--xr-radius-md)', padding: '4px 0', boxShadow: 'var(--xr-elevation-md)', minWidth: 160, animation: reduced ? undefined : `xr-menu-in calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-enter))` }}>
      {children}
    </div>
  </OverlayPrimitive>
}
function Item({ children, onClick, disabled, className }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return <div role="menuitem" className={`xr-menu__item ${className ?? ''}`} onClick={disabled ? undefined : onClick}
    style={{ padding: '8px 16px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, fontSize: 14 }}>{children}</div>
}
function Separator() { return <div role="separator" className="xr-popover__separator" /> }
function Label({ children }: { children: ReactNode }) { return <div className="xr-menu__label" style={{ padding: '4px 16px', fontSize: 12, fontWeight: 600, color: 'var(--xr-semantic-color-textMuted)' }}>{children}</div> }
export const Menu = { Root, Trigger, Content, Item, Separator, Label }
```

- [ ] **Step 6: Implement `Breadcrumb.tsx`**

```tsx
import type { ReactNode } from 'react'
const SEPS: Record<string, ReactNode> = { slash: '/', chevron: '›', dot: '·' }
export interface BreadcrumbItemProps { href?: string; current?: boolean; children: ReactNode; separator?: string }
export function Item({ href, current, children, separator = 'slash' }: BreadcrumbItemProps) {
  return (
    <li style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {href ? <a href={href} aria-current={current ? 'page' : undefined} style={{ color: current ? 'var(--xr-semantic-color-text)' : 'var(--xr-semantic-color-primary)', textDecoration: current ? 'none' : 'underline' }}>{children}</a>
       : <span aria-current="page" style={{ color: 'var(--xr-semantic-color-text)', fontWeight: 600 }}>{children}</span>}
      {!current && <span aria-hidden="true" style={{ color: 'var(--xr-semantic-color-textMuted)' }}>{SEPS[separator] ?? separator}</span>}
    </li>
  )
}
export function Breadcrumb({ children, separator = 'slash', className }: { children: ReactNode; separator?: string; className?: string }) {
  // wrap children with cloneElement injecting separator
  return <nav aria-label="Breadcrumb"><ol style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: 0, margin: 0 }} className={className}>{children}</ol></nav>
}
```

- [ ] **Step 7: Navigation CSS** (append inside `@layer xerena-components`):

```css
.xr-tabs__list { position: relative; }
.xr-tabs__trigger { border: none; background: none; cursor: pointer; padding: 8px 16px; font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); color: var(--xr-semantic-color-textMuted); font-weight: 500; transition: color calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard)); position: relative; }
.xr-tabs__trigger:hover { color: var(--xr-semantic-color-text); }
.xr-tabs__trigger--selected { color: var(--xr-semantic-color-primary); }
.xr-tabs__list--pill .xr-tabs__trigger { border-radius: var(--xr-radius-full); }
.xr-tabs__list--enclosed .xr-tabs__trigger { border: 1px solid var(--xr-semantic-color-border); margin-left: -1px; }
.xr-tabs__indicator { pointer-events: none; }
.xr-accordion__trigger { border: none; background: none; cursor: pointer; }
.xr-menu { }
@keyframes xr-menu-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.xr-menu__item { transition: background-color calc(var(--xr-motion-duration-instant) * 1ms); }
.xr-menu__item:hover { background: var(--xr-semantic-color-surfaceHover); }
```

- [ ] **Step 8: Verify + commit**

Run: `pnpm --filter @xerena/react test && pnpm --filter @xerena/react lint && pnpm --filter @xerena/react typecheck`
Expected: green.
```bash
git add packages/react/src/components/navigation packages/react/src/styles/base.css packages/react/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(react): add navigation components"
```

---

### Task 21: Storybook stories for all components

**Files:**
- Create: `apps/storybook/stories/<Category>/<Component>.stories.tsx` for each component (9 categories × ~5 stories each)
- Modify: `apps/storybook/.storybook/preview.tsx` (add dark toggle toolbar in decorator)
- Test: `pnpm --filter storybook build` (clean output); optionally `pnpm --filter storybook test` if Playwright configured.

**Interfaces:**
- Consumes: all components from Tasks 9–20, `Provider` from Task 8.
- Produces: storybook builds cleanly; dark mode toggle works in toolbar; a11y addon active; stories render all variants.

**Note:** Stories are the "visual test gate" — they must cover every variant listed in the spec for each component. The Storybook config already uses `@storybook/addon-a11y`; add a toolbar dark-mode toggle in the decorator.

- [ ] **Step 1: Add dark mode toggle to storybook decorator**

In `apps/storybook/.storybook/preview.tsx`, update the decorator to accept a dark parameter and wrap with appropriate `[data-xerena-theme]`:

```tsx
import React from 'react'
import type { Preview } from '@storybook/react'
import { Provider } from '@xerena/react'
import '@xerena/react/styles/base.css'
import '@xerena/tokens/tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sand',
      values: [
        { name: 'sand', value: '#faf7f2' },
        { name: 'dark', value: '#1b1712' },
      ],
    },
    globals: {
      darkMode: false,
    },
  },
  globalTypes: {
    darkMode: { description: 'Dark mode', toolbar: { items: [{ value: 'light', title: 'Light' }, { value: 'dark', title: 'Dark' }], dynamicTitle: true } },
  },
  decorators: [
    (Story, { globals }) => (
      <Provider theme={{ mode: globals.darkMode === 'dark' ? 'dark' : 'light' }}>
        <Story />
      </Provider>
    ),
  ],
}

export default preview
```

- [ ] **Step 2: Create stories folders**

```
apps/storybook/stories/
  typography/
  layout/
  actions/
  form/
  surfaces/
  data/
  feedback/
  navigation/
```

- [ ] **Step 3: Create representative stories (full pattern for each category; remaining follow the same structure)**

**Typography stories** (`apps/storybook/stories/typography/Text.stories.tsx`):

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '@xerena/react'
const meta: Meta<typeof Text> = { title: 'Typography/Text', component: Text, tags: ['autodocs'] }
export default meta
type T = StoryObj<typeof Text>

export const Body: T = { args: { children: 'Body text' } }
export const Muted: T = { args: { variant: 'muted', children: 'Muted text' } }
export const Strong: T = { args: { variant: 'strong', children: 'Strong text' } }
export const Error: T = { args: { variant: 'error', children: 'Error text' } }
export const Sm: T = { args: { size: 'sm', children: 'Small' } }
export const AsChildLink: T = { args: { asChild: true, children: <a href="https://example.com">link element</a> } }
export const Truncated: T = { args: { truncate: true, children: 'A very long text that should truncate with ellipsis' }, parameters: { docs: { storyDescription: 'Must truncate with ellipsis when space runs out' } } }
```

**Actions stories** (`apps/storybook/stories/actions/Button.stories.tsx`):

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@xerena/react'
const meta: Meta<typeof Button> = { title: 'Actions/Button', component: Button, tags: ['autodocs'] }
export default meta
type T = StoryObj<typeof Button>

export const Primary: T = { args: { children: 'Primary' } }
export const Ghost: T = { args: { variant: 'ghost', children: 'Ghost' } }
export const Outline: T = { args: { variant: 'outline', children: 'Outline' } }
export const Soft: T = { args: { variant: 'soft', children: 'Soft' } }
export const Destructive: T = { args: { variant: 'destructive', children: 'Delete' } }
export const Link: T = { args: { variant: 'link', children: 'Link' } }
export const Animated: T = { args: { animated: true, children: 'Animated hover' } }
export const Loading: T = { args: { loading: true, children: 'Saving…' } }
export const LeftIcon: T = { args: { leftIcon: <span>→</span>, children: 'With icon' } }
export const FullWidth: T = { args: { fullWidth: true, children: 'Full width' }, parameters: { layout: 'padded' } }
```

**Feedback stories** (`apps/storybook/stories/feedback/Dialog.stories.tsx`):

```tsx
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Dialog } from '@xerena/react'
const meta: Meta<typeof Dialog.Root> = { title: 'Feedback/Dialog', component: Dialog.Root, tags: ['autodocs'] }
export default meta
type T = StoryObj<typeof Dialog.Root>

export const Default: T = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog.Root open={open} onClose={() => setOpen(false)}>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Close />
              <Dialog.Title>Confirm</Dialog.Title>
              <Dialog.Description>This action cannot be undone.</Dialog.Description>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    )
  },
}
```

The full story file set follows the same pattern for every component — the `mdx` autodocs tab is generated from `tags: ['autodocs']`; every variant from the spec becomes a named story export.

- [ ] **Step 4: Create all remaining stories**

Repeat the pattern above for every component, placing them under the correct category folder. Stories must include:
- One story per variant
- Dark mode story for components with semantic colors (Button, Badge, Card, Input, Table, Dialog, etc.)
- Story named `ReducedMotion` where component has animation (with `parameters: { globals: { prefersReducedMotion: 'reduce' } }`)

- [ ] **Step 5: Verify storybook builds**

Run: `pnpm --filter storybook build`
Expected: builds successfully with no missing-component errors.

- [ ] **Step 6: Commit**

```bash
git add apps/storybook
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "docs(storybook): add component stories for all 42 components"
```

---

### Task 22: Docs pages + sidebar + getting-started update

**Files:**
- Create: `apps/docs/guide/components/<Category>/<Name>.md` for each of the 42 components (under 9 category folders)
- Modify: `apps/docs/.vitepress/config.mts` (sidebar update — add Components section with subgroups)
- Modify: `apps/docs/guide/getting-started.md` (add component import/usage)
- Modify: `apps/docs/guide/theming.md` (add component theming example)

**Interfaces:**
- Consumes: all component exports (Tasks 9–20), Provider.
- Produces: `pnpm --filter docs build` clean; all 42 component docs pages exist with correct structure; sidebar includes the full component tree.

**Docs structure for each component:**

```markdown
# <ComponentName>

Brief description.

## Import

\```tsx
import { <ComponentName> } from '@xerena/react'
\```

## Usage

Basic example code.

## API

Prop table (props, type, default, description).

## Variants

Description + examples per variant.

## Motion

Event → property → duration → easing → reduced fallback (table).

## Accessibility

ARIA roles, keyboard support, reduced-motion behavior.

## See also

Links to related components.
```

- [ ] **Step 1: Create category folders and 42 component docs**

```
apps/docs/guide/components/
  typography/
  layout/
  actions/
  form/
  surfaces/
  data/
  feedback/
  navigation/
```

Create one `.md` file per component (42 total), following the structure above.

- [ ] **Step 2: Update `getting-started.md`**

Add a "Components" section showing:
```tsx
import { Button, Text, Card } from '@xerena/react'
import '@xerena/react/styles/base.css'
```

- [ ] **Step 3: Update `theming.md`**

Add example of Provider dark mode + component theming:
```tsx
<Provider theme={{ mode: 'dark', semantic: { primary: '#ff0000' } }}>
  <App />
</Provider>
```

- [ ] **Step 4: Update `sidebar` in `.vitepress/config.mts`**

Add after the Styling entry:
```ts
{
  text: 'Components',
  items: [
    { text: 'Actions', link: '/guide/components/actions/button' },
    { text: 'Typography', link: '/guide/components/typography/text' },
    // ... all 9 categories
  ],
}
```

- [ ] **Step 5: Verify docs build**

Run: `pnpm --filter docs build`
Expected: builds successfully; all 42 pages accessible.

- [ ] **Step 6: Commit**

```bash
git add apps/docs
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "docs: add component guide pages for all 42 components"
```

---

### Task 23: Version bump, changeset, release

**Files:**
- Modify: root `package.json` (if changeset config needed)
- Create: `.changeset/<unique-name>.md` (changeset for all packages)
- Tag: `@xerena/*@x.y.z` after push/merge

**Interfaces:**
- Consumes: all Tasks 1–22 green.
- Produces: version bump in `packages/*/package.json` for all 5 packages; changeset file; git tag; `pnpm publish` run on CI if `NPM_TOKEN` set.

**Note:** This task is executed ONLY after the whole-phase review is approved. The implementer must:
1. Create a changeset for all packages (minimally `@xerena/react`, `@xerena/tokens`, `@xerena/styling`, `@xerena/native`, `@xerena/eslint-config`).
2. Run `pnpm changeset version` to apply the bumps.
3. Commit, push, open PR, merge.
4. After merge, create git tags: `git tag @xerena/tokens@0.1.0`, `@xerena/styling@0.1.0`, `@xerena/react@0.1.0`, etc.
5. CI (`changeset publish`) runs on main; if `NPM_TOKEN` is set, publishes to npm.

**Versioning rules:**
- `@xerena/tokens`: 0.1.0 (new features: status/dark/semantic)
- `@xerena/styling`: 0.1.0 (semantic utility classes)
- `@xerena/react`: 0.1.0 (42 components, first release)
- `@xerena/native`: unchanged (no new features)
- `@xerena/eslint-config`: unchanged (no changes)

- [ ] **Step 1: Create changeset**

```bash
pnpm changeset
```
Select all packages that changed; set minor bump for tokens, styling, react; create a summary:
> Add 42 web components, status+dark color palettes, semantic CSS vars, runtime theming, headless primitives, Storybook stories, and component documentation.

- [ ] **Step 2: Apply version bumps**

```bash
pnpm changeset version
```

- [ ] **Step 3: Verify everything passes**

```bash
pnpm install && pnpm test && pnpm lint && pnpm typecheck && pnpm build && pnpm --filter docs build && pnpm --filter storybook build
```

- [ ] **Step 4: Commit + push**

```bash
git add .
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "chore: version bump and changeset for Phase 5 release"
git push
```

- [ ] **Step 5: Merge to main + create tags (after PR merge)**

After PR is merged:
```bash
git checkout main && git pull
git tag @xerena/tokens@0.1.0
git tag @xerena/styling@0.1.0
git tag @xerena/react@0.1.0
git push origin --tags
```

CI runs `changeset publish` and publishes to npm (if `NPM_TOKEN` is present in the environment).

---

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-09-13-xerena-components.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — Dispatch a fresh subagent per task; review between tasks; fast iteration with clear gates.

2. **Inline Execution** — Execute tasks in this session using executing-plans; batch execution with checkpoints for review.

Which approach?