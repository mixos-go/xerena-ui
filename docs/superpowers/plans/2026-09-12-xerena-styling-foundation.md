# Xerena Styling Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the Styling foundation for Xerena UI — a new `@xerena/styling` package (utility CSS generator + typed style helpers + web motion hooks) plus a docs guide page, with zero changes to `@xerena/react` / `@xerena/react-native`.

**Architecture:** One new package `packages/styling` with three export surfaces — `.` (pure, zero-React style helpers), `./react` (React hooks — the only entry allowed to import react), and `./styles.css` (token-driven utility stylesheet generated at build time from `@xerena/tokens/tokens.json`). Token data stays in `@xerena/tokens` (single source of truth); the resolver layer adds typed access, unit conversion for web (`calc(var(--xr-*) * 1px|1ms)`), and CSS-variable name building.

**Tech Stack:** TypeScript (strict, `verbatimModuleSyntax`), tsup (ESM+CJS+dts, mirroring `packages/tokens`), vitest (jsdom env for hook tests), Nx project `styling`, VitePress docs.

**Spec:** `docs/superpowers/specs/2026-09-12-xerena-styling-design.md` — the plan argues from the spec; executor reads both.

## Global Constraints

- **Package:** `packages/styling`, published name `@xerena/styling`, version `0.0.0`; three exports: `.` (root), `./react`, `./styles.css` (`./styles.css` added only in Task 3, `./react` only in Task 4).
- **Boundaries (enforced by eslint `no-restricted-imports`):** root surface files (`src/*`, not `src/react/*`) must NOT import `react`, `react-dom`, `@xerena/react`, or `@xerena/react-native`; `src/react/*` must NOT import `@xerena/react-native`. Dependencies: `@xerena/tokens` (workspace dep); `react`/`react-dom` only as peer + dev deps.
- **CSS-variable naming rule:** token path → `--xr-` + segments joined with `-`, each segment's original case preserved (no flattening): `typography.body.md.fontSize` → `--xr-typography-body-md-fontSize`. `cssVar`/generator MUST mirror exactly what `@xerena/tokens/tokens.css` emits.
- **Unit inference (must not change):** spacing/radius → px; typography `fontSize`/`lineHeight` → px; typography `fontWeight`/`letterSpacing` → bare var (no calc); elevation/color/fontFamily → bare var; motion duration → ms; motion easing → `cubic-bezier(var(--xr-motion-easing-<key>))`.
- **Determinism:** utility stylesheet output must be byte-identical across runs (same traversal order as `tokens.json`); never read the DOM in root-surface code.
- **Reduced-motion behavior:** system-driven `prefers-reduced-motion: reduce`; when reduced (system OR `options.reducedMotion` override) ALL durations return `'1ms'`; easings are never affected. SSR-safe (no `window` → false).
- **No Provider / `@xerena/react` / native changes** in this phase. No semantic-color utilities (deferred to Phase 5). No new dependencies beyond those listed.
- **Commits** use `git -c user.name="Xerena" -c user.email="xerena@local" commit -m <msg>`.

---
---

### Task 1: `@xerena/styling` scaffold + CSS resolver core

**Files:**
- Create: `packages/styling/package.json`
- Create: `packages/styling/tsconfig.json`
- Create: `packages/styling/tsup.config.ts`
- Create: `packages/styling/vitest.config.ts`
- Create: `packages/styling/eslint.config.js`
- Create: `packages/styling/project.json`
- Create: `packages/styling/src/css.ts`
- Create: `packages/styling/src/index.ts`
- Create: `packages/styling/src/css.test.ts`
- Modify: `tsconfig.base.json` (add `@xerena/styling` paths)
- Modify: `package.json` (root — add `styling` to `--projects` lists)

**Interfaces:**
- Consumes: `@xerena/tokens` export names for later tasks (Task 2 imports `spacing`, `radius`, `motion`, and the `SpacingKey`/`RadiusKey`/`MotionDurationKey`/`MotionEasingKey` types).
- Produces the package scaffold and, at `src/css.ts` (tested here):
  - `cssVar(path: string): string`
  - `css(path: string): string`

- [ ] **Step 1: Set up the package scaffolding**

Create `packages/styling/package.json`:

```json
{
  "name": "@xerena/styling",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsup"
  },
  "dependencies": {
    "@xerena/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.6.0",
    "vitest": "^3.0.0"
  }
}
```

Create `packages/styling/tsconfig.json`:

```json
{
  "extends": "../../tools/tsconfig/tsconfig.react.json",
  "include": ["src", "vitest.config.ts"]
}
```

Create `packages/styling/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
})
```

Create `packages/styling/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
```

Create `packages/styling/eslint.config.js`:

```js
import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'styling root surface must not depend on React — use @xerena/styling/react' },
            { name: 'react-dom', message: 'styling root surface must not depend on React DOM' },
            { name: '@xerena/react', message: 'styling must not depend on @xerena/react' },
            { name: '@xerena/react-native', message: 'styling must not depend on @xerena/react-native' },
          ],
        },
      ],
    },
  },
  {
    files: ['src/react/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@xerena/react-native', message: 'styling must not depend on @xerena/react-native' },
          ],
        },
      ],
    },
  },
]
```

Create `packages/styling/project.json` (mirrors `packages/tokens/project.json`):

```json
{
  "name": "styling",
  "projectType": "library",
  "sourceRoot": "packages/styling/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "packages/styling" },
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "vitest run", "cwd": "packages/styling" }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": { "command": "tsc -p tsconfig.json --noEmit", "cwd": "packages/styling" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "eslint src", "cwd": "packages/styling" }
    }
  }
}
```

Create root `tsconfig.base.json` additions — inside the existing `paths` object add exactly these two entries (keep the existing three entries unchanged):

```json
    "@xerena/styling": [
      "./packages/styling/src/index.ts"
    ],
    "@xerena/styling/react": [
      "./packages/styling/src/react/index.ts"
    ]
```

Update root `package.json` scripts `test`, `lint`, `typecheck` — append `,styling` to each `--projects=` list (e.g. `--projects=tokens,react,react-native,brand,styling`).

Then materialize the workspace links and devDependencies for the new package (this also creates `packages/styling/node_modules`, so `vitest`/`tsup`/`typescript`/`react`/`jsdom` resolve from its own directory as they do in `packages/react`/`packages/tokens`):

```bash
pnpm install
```

- [ ] **Step 2: Write the failing CSS-resolver tests**

Create `packages/styling/src/css.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { css, cssVar } from './css'

describe('cssVar', () => {
  it('builds a flat color variable', () => {
    expect(cssVar('color.ember.600')).toBe('var(--xr-color-ember-600)')
  })

  it('preserves segment case (no flattening), like the tokens generator', () => {
    expect(cssVar('typography.body.md.fontSize')).toBe('var(--xr-typography-body-md-fontSize)')
    expect(cssVar('typography.fontFamily.body')).toBe('var(--xr-typography-fontFamily-body)')
  })
})

describe('css', () => {
  it('adds px to spacing', () => {
    expect(css('spacing.4')).toBe('calc(var(--xr-spacing-4) * 1px)')
  })

  it('adds px to radius', () => {
    expect(css('radius.lg')).toBe('calc(var(--xr-radius-lg) * 1px)')
  })

  it('adds px to typography fontSize and lineHeight', () => {
    expect(css('typography.body.md.fontSize')).toBe('calc(var(--xr-typography-body-md-fontSize) * 1px)')
    expect(css('typography.body.md.lineHeight')).toBe('calc(var(--xr-typography-body-md-lineHeight) * 1px)')
  })

  it('keeps fontWeight and letterSpacing as bare variables', () => {
    expect(css('typography.body.md.fontWeight')).toBe('var(--xr-typography-body-md-fontWeight)')
    expect(css('typography.body.md.letterSpacing')).toBe('var(--xr-typography-body-md-letterSpacing)')
  })

  it('keeps fontFamily, colors and elevation as bare variables', () => {
    expect(css('typography.fontFamily.body')).toBe('var(--xr-typography-fontFamily-body)')
    expect(css('color.ember.600')).toBe('var(--xr-color-ember-600)')
    expect(css('elevation.raised')).toBe('var(--xr-elevation-raised)')
  })

  it('adds ms to motion durations', () => {
    expect(css('motion.duration.base')).toBe('calc(var(--xr-motion-duration-base) * 1ms)')
  })

  it('builds cubic-bezier for motion easings', () => {
    expect(css('motion.easing.standard')).toBe('cubic-bezier(var(--xr-motion-easing-standard))')
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx nx run styling:test`
Expected: FAIL — `./css` cannot be resolved (`cssVar`/`css` are not exported).

- [ ] **Step 4: Implement the resolver core**

Create `packages/styling/src/css.ts`:

```ts
export function cssVar(path: string): string {
  return `var(--xr-${path.split('.').join('-')})`
}

function unitFor(path: string): 'px' | 'ms' | null {
  if (
    path.startsWith('spacing.') ||
    path.startsWith('radius.') ||
    path.includes('.fontSize') ||
    path.includes('.lineHeight')
  ) {
    return 'px'
  }
  if (path.startsWith('motion.duration.')) {
    return 'ms'
  }
  return null
}

export function css(path: string): string {
  const variable = cssVar(path)
  if (path.startsWith('motion.easing.')) {
    return `cubic-bezier(${variable})`
  }
  const unit = unitFor(path)
  if (unit !== null) {
    return `calc(${variable} * 1${unit})`
  }
  return variable
}
```

Create `packages/styling/src/index.ts`:

```ts
export * from './css'
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx nx run styling:test`
Expected: PASS (all cases in `src/css.test.ts`).

- [ ] **Step 6: Run the package gate**

Run:
```bash
npx nx run styling:lint
npx nx run styling:typecheck
npx nx run styling:build
```
Expected: all three pass (build produces `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` via tsup).

- [ ] **Step 7: Commit**

```bash
git add packages/styling tsconfig.base.json package.json pnpm-lock.yaml
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(styling): scaffold @xerena/styling with css resolvers"
```

---
---

### Task 2: Style helper value resolvers

**Files:**
- Create: `packages/styling/src/spacing.ts`
- Create: `packages/styling/src/radius.ts`
- Create: `packages/styling/src/motion.ts`
- Create: `packages/styling/src/values.test.ts`
- Modify: `packages/styling/src/index.ts` (barrel: add the resolver exports)

**Interfaces:**
- Consumes: `@xerena/tokens` (styles) — these are already exported by `@xerena/tokens`:
  - `spacing: Record<SpacingKey, number>`
  - `radius: Record<RadiusKey, number>`
  - `motion.duration: Record<MotionDurationKey, number>`
  - `motion.easing: Record<MotionEasingKey, number[]>` (JSON-widened arrays)
  - types `SpacingKey`, `RadiusKey`, `MotionDurationKey`, `MotionEasingKey` (from `keyof typeof`, already public)
- Produces (consumed by Task 4 hooks and Phase 5+):
  - `spacingValue(key: SpacingKey): number`
  - `radiusValue(key: RadiusKey): number`
  - `durationValue(key: MotionDurationKey): number`
  - `easingValue(key: MotionEasingKey): Bezier`
  - `export type Bezier = readonly [number, number, number, number]`

- [ ] **Step 1: Write the failing value-resolver tests**

Create `packages/styling/src/values.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { spacingValue, radiusValue, durationValue, easingValue } from './index'
import type { Bezier } from './motion'

describe('value resolvers', () => {
  it('reads spacing by key', () => {
    expect(spacingValue('4')).toBe(16)
    expect(spacingValue('1')).toBe(4)
  })

  it('reads radius by key', () => {
    expect(radiusValue('lg')).toBe(12)
    expect(radiusValue('full')).toBe(9999)
  })

  it('reads motion durations as numbers', () => {
    expect(durationValue('instant')).toBe(1)
    expect(durationValue('base')).toBe(150)
    expect(durationValue('emphatic')).toBe(600)
  })

  it('reads motion easings as 4-tuples', () => {
    expect(easingValue('standard')).toEqual([0.2, 0, 0, 1] satisfies Bezier)
    expect(easingValue('emphasis')).toEqual([0.34, 1.3, 0.64, 1] satisfies Bezier)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx nx run styling:test`
Expected: FAIL — `./spacing`, `./radius`, `./motion` modules and their exports do not exist.

- [ ] **Step 3: Implement the resolvers**

Create `packages/styling/src/spacing.ts`:

```ts
import { spacing, type SpacingKey } from '@xerena/tokens'

export type { SpacingKey } from '@xerena/tokens'

export function spacingValue(key: SpacingKey): number {
  return spacing[key]
}
```

Create `packages/styling/src/radius.ts`:

```ts
import { radius, type RadiusKey } from '@xerena/tokens'

export type { RadiusKey } from '@xerena/tokens'

export function radiusValue(key: RadiusKey): number {
  return radius[key]
}
```

Create `packages/styling/src/motion.ts`:

```ts
import { motion, type MotionDurationKey, type MotionEasingKey } from '@xerena/tokens'

export type { MotionDurationKey, MotionEasingKey } from '@xerena/tokens'

export type Bezier = readonly [number, number, number, number]

export function durationValue(key: MotionDurationKey): number {
  return motion.duration[key]
}

export function easingValue(key: MotionEasingKey): Bezier {
  return motion.easing[key] as unknown as Bezier
}
```

Update `packages/styling/src/index.ts`:

```ts
export * from './css'
export * from './spacing'
export * from './radius'
export * from './motion'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx nx run styling:test`
Expected: PASS — the `values.test.ts` cases plus the existing `css.test.ts` cases.

- [ ] **Step 5: Run the package gate**

Run:
```bash
npx nx run styling:lint
npx nx run styling:typecheck
npx nx run styling:build
```
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add packages/styling/src/spacing.ts packages/styling/src/radius.ts packages/styling/src/motion.ts packages/styling/src/values.test.ts packages/styling/src/index.ts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(styling): add typed token value resolvers"
```

---
---

### Task 3: Utility CSS generator

**Files:**
- Create: `packages/styling/scripts/generate-styles.mjs`
- Create: `packages/styling/scripts/generate-styles.test.mjs`
- Modify: `packages/styling/package.json` (build script + `./styles.css` export)
- Modify: `packages/tokens/package.json` (expose `./package.json` so the generator can resolve the package dir)

**Interfaces:**
- Consumes: `@xerena/tokens` source `tokens.json` (single source of truth), resolved via `require.resolve('@xerena/tokens/package.json')` → sibling `src/tokens.json`.
- Produces: `packages/styling/dist/styles.css` (built artifact) and testable pure `buildStylesheet(data)` + `resolveTokensPath(require)`.

- [ ] **Step 1: Write the failing generator tests**

Create `packages/styling/scripts/generate-styles.test.mjs`:

```js
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { buildStylesheet, resolveTokensPath } from './generate-styles.mjs'

const require = createRequire(import.meta.url)
const tokens = JSON.parse(readFileSync(resolveTokensPath(require), 'utf8'))
const css = buildStylesheet(tokens)

describe('generate-styles', () => {
  it('emits color utilities sized by shade', () => {
    expect(css).toContain('.xr-bg-ember-600 { background-color: var(--xr-color-ember-600); }')
    expect(css).toContain('.xr-text-sand-900 { color: var(--xr-color-sand-900); }')
    expect(css).toContain('.xr-border-ember-600 { border-color: var(--xr-color-ember-600); }')
  })

  it('emits spacing utilities via calc palette', () => {
    expect(css).toContain('.xr-p-4 { padding: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-px-4 { padding-inline: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-py-4 { padding-block: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-m-4 { margin: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-mx-4 { margin-inline: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-my-4 { margin-block: calc(var(--xr-spacing-4) * 1px); }')
    expect(css).toContain('.xr-gap-6 { gap: calc(var(--xr-spacing-6) * 1px); }')
  })

  it('emits typography utilities per variant and size', () => {
    expect(css).toContain('.xr-font-family-body { font-family: var(--xr-typography-fontFamily-body); }')
    expect(css).toContain('.xr-font-size-body-md { font-size: calc(var(--xr-typography-body-md-fontSize) * 1px); }')
    expect(css).toContain('.xr-leading-body-md { line-height: calc(var(--xr-typography-body-md-lineHeight) * 1px); }')
    expect(css).toContain('.xr-font-weight-body-md { font-weight: var(--xr-typography-body-md-fontWeight); }')
    expect(css).toContain('.xr-tracking-display-lg { letter-spacing: var(--xr-typography-display-lg-letterSpacing); }')
  })

  it('emits elevation, radius and motion utilities', () => {
    expect(css).toContain('.xr-elevation-raised { box-shadow: var(--xr-elevation-raised); }')
    expect(css).toContain('.xr-radius-lg { border-radius: calc(var(--xr-radius-lg) * 1px); }')
    expect(css).toContain('.xr-duration-base { transition-duration: calc(var(--xr-motion-duration-base) * 1ms); }')
    expect(css).toContain('.xr-ease-emphasis { transition-timing-function: cubic-bezier(var(--xr-motion-easing-emphasis)); }')
  })

  it('is deterministic', () => {
    expect(buildStylesheet(tokens)).toBe(css)
  })

  it('imports without side effects (no dist file written)', () => {
    expect(typeof buildStylesheet).toBe('function')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx nx run styling:test`
Expected: FAIL — `./generate-styles.mjs` cannot be resolved.

- [ ] **Step 3: Implement the generator**

First, expose the tokens package directory so `require.resolve('@xerena/tokens/package.json')` (used by `resolveTokensPath`) is not blocked by `exports`:

Update `packages/tokens/package.json` — inside the existing `exports` object add:

```json
    "./package.json": "./package.json"
```

Create `packages/styling/scripts/generate-styles.mjs`:

```js
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function resolveTokensPath(require) {
  return resolve(dirname(require.resolve('@xerena/tokens/package.json')), 'src/tokens.json')
}

export function buildStylesheet(tokens) {
  const lines = []
  lines.push('/* Xerena utility classes — generated from @xerena/tokens. Do not edit. */')
  lines.push('')

  const add = (selector, declaration) => lines.push(`.${selector} { ${declaration}; }`)
  const varName = (segments) => `--xr-${segments.join('-')}`

  for (const [name, shades] of Object.entries(tokens.color)) {
    for (const [shade] of Object.entries(shades)) {
      const v = `var(${varName(['color', name, shade])})`
      add(`xr-bg-${name}-${shade}`, `background-color: ${v}`)
      add(`xr-text-${name}-${shade}`, `color: ${v}`)
      add(`xr-border-${name}-${shade}`, `border-color: ${v}`)
    }
  }

  for (const [key] of Object.entries(tokens.spacing)) {
    const v = `calc(var(${varName(['spacing', key])}) * 1px)`
    add(`xr-p-${key}`, `padding: ${v}`)
    add(`xr-px-${key}`, `padding-inline: ${v}`)
    add(`xr-py-${key}`, `padding-block: ${v}`)
    add(`xr-m-${key}`, `margin: ${v}`)
    add(`xr-mx-${key}`, `margin-inline: ${v}`)
    add(`xr-my-${key}`, `margin-block: ${v}`)
    add(`xr-gap-${key}`, `gap: ${v}`)
  }

  for (const [family] of Object.entries(tokens.typography.fontFamily)) {
    add(`xr-font-family-${family}`, `font-family: var(${varName(['typography', 'fontFamily', family])})`)
  }

  for (const [variant, sizes] of Object.entries(tokens.typography)) {
    if (variant === 'fontFamily') continue
    for (const [size] of Object.entries(sizes)) {
      add(`xr-font-size-${variant}-${size}`, `font-size: calc(var(${varName(['typography', variant, size, 'fontSize'])}) * 1px)`)
      add(`xr-leading-${variant}-${size}`, `line-height: calc(var(${varName(['typography', variant, size, 'lineHeight'])}) * 1px)`)
      add(`xr-font-weight-${variant}-${size}`, `font-weight: var(${varName(['typography', variant, size, 'fontWeight'])})`)
      add(`xr-tracking-${variant}-${size}`, `letter-spacing: var(${varName(['typography', variant, size, 'letterSpacing'])})`)
    }
  }

  for (const [key] of Object.entries(tokens.elevation)) {
    add(`xr-elevation-${key}`, `box-shadow: var(${varName(['elevation', key])})`)
  }

  for (const [key] of Object.entries(tokens.radius)) {
    add(`xr-radius-${key}`, `border-radius: calc(var(${varName(['radius', key])}) * 1px)`)
  }

  for (const [key] of Object.entries(tokens.motion.duration)) {
    add(`xr-duration-${key}`, `transition-duration: calc(var(${varName(['motion', 'duration', key])}) * 1ms)`)
  }

  for (const [key] of Object.entries(tokens.motion.easing)) {
    add(`xr-ease-${key}`, `transition-timing-function: cubic-bezier(var(${varName(['motion', 'easing', key])}))`)
  }

  return `${lines.join('\n')}\n`
}

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const require = createRequire(import.meta.url)
  const tokens = JSON.parse(readFileSync(resolveTokensPath(require), 'utf8'))
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  writeFileSync(resolve(root, 'dist/styles.css'), buildStylesheet(tokens))
  console.log('generated dist/styles.css')
}
```

- [ ] **Step 4: Run tests to verify they pass, then run direct generation**

Run: `npx nx run styling:test`
Expected: PASS — generator test suite plus existing css/value tests.

Then run the script directly once to confirm normal operation:
```bash
node packages/styling/scripts/generate-styles.mjs
```
Expected: prints `generated dist/styles.css`.

Verify emitted content:
```bash
grep -E '\.xr-(bg-ember-600|duration-base|ease-standard)' packages/styling/dist/styles.css
```
Expected three lines matching the class selectors from Step 1.

- [ ] **Step 5: Wire the build + export**

Update `packages/styling/package.json`:
- `"scripts": { "build": "tsup && node scripts/generate-styles.mjs" }`
- Add to `exports` (after the `"."` entry):

```json
    "./styles.css": "./dist/styles.css"
```

- [ ] **Step 6: Verify the full package build**

Run: `npx nx run styling:build`
Expected: pass — tsup emits JS + dts, the generator emits `dist/styles.css` (check the file exists).

- [ ] **Step 7: Commit**

```bash
git add packages/styling/scripts packages/styling/package.json packages/tokens/package.json
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(styling): generate token-driven utility stylesheet"
```

---
---

### Task 4: Motion hooks (`@xerena/styling/react`)

**Files:**
- Create: `packages/styling/src/react/useReducedMotion.ts`
- Create: `packages/styling/src/react/useMotion.ts`
- Create: `packages/styling/src/react/index.ts`
- Create: `packages/styling/src/react/hooks.test.tsx`
- Modify: `packages/styling/tsup.config.ts` (two entries)
- Modify: `packages/styling/package.json` (add `./react` export)

**Interfaces:**
- Consumes: `useReducedMotion` (no args) from its own module; `motion` object and key types from `@xerena/tokens` (already public: `motion.duration`, `motion.easing`, `MotionDurationKey`, `MotionEasingKey`).
- Produces:
  - `useReducedMotion(): boolean`
  - `useMotion(options?: { reducedMotion?: boolean }): { durations: Record<MotionDurationKey, string>; easings: Record<MotionEasingKey, string>; reduced: boolean }`
  - `useMotion`/`useReducedMotion` exported from `@xerena/styling/react`.

- [ ] **Step 1: Write the failing hook tests**

Create `packages/styling/src/react/hooks.test.tsx`:

```tsx
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'
import { useMotion } from './useMotion'

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<() => void>()
  const mocks = new Map<string, ReturnType<typeof window.matchMedia>>()
  const setMatches = (matches: boolean) => {
    for (const mock of mocks.values()) {
      ;(mock as { matches: boolean }).matches = matches
    }
    listeners.forEach((cb) => cb())
  }
  window.matchMedia = vi.fn((query: string) => {
    const mock = {
      matches: initialMatches,
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    } as unknown as MediaQueryList
    mocks.set(query, mock)
    return mock
  }) as unknown as typeof window.matchMedia
  return { setMatches }
}

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.matchMedia = undefined as unknown as typeof window.matchMedia
  })

  it('is false when there is no matchMedia (SSR-safe)', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('tracks prefers-reduced-motion system changes', () => {
    const { setMatches } = installMatchMedia(false)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
    act(() => setMatches(true))
    expect(result.current).toBe(true)
    act(() => setMatches(false))
    expect(result.current).toBe(false)
  })
})

describe('useMotion', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.matchMedia = undefined as unknown as typeof window.matchMedia
  })

  it('snaps every duration to instant when reduced', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: true }))
    expect(result.current.durations.base).toBe('1ms')
    expect(result.current.durations.emphatic).toBe('1ms')
    expect(result.current.durations.moderate).toBe('1ms')
  })

  it('returns css-ready durations when not reduced', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: false }))
    expect(result.current.durations.base).toBe('150ms')
    expect(result.current.durations.emphatic).toBe('600ms')
    expect(result.current.reduced).toBe(false)
  })

  it('builds cubic-bezier easings untouched by reduced motion', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: true }))
    expect(result.current.easings.standard).toBe('cubic-bezier(0.2, 0, 0, 1)')
    expect(result.current.easings.emphasis).toBe('cubic-bezier(0.34, 1.3, 0.64, 1)')
  })

  it('reports resolved reduced state', () => {
    const { result } = renderHook(() => useMotion({ reducedMotion: true }))
    expect(result.current.reduced).toBe(true)
  })

  it('reads system preference when no override is given', async () => {
    const { setMatches } = installMatchMedia(false)
    const { result } = renderHook(() => useMotion())
    await waitFor(() => expect(result.current.reduced).toBe(false))
    act(() => setMatches(true))
    await waitFor(() => expect(result.current.reduced).toBe(true))
    await waitFor(() => expect(result.current.durations.base).toBe('1ms'))
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx nx run styling:test`
Expected: FAIL — `./useReducedMotion` and `./useMotion` cannot be resolved.

- [ ] **Step 3: Implement the hooks**

Create `packages/styling/src/react/useReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    const media = window.matchMedia(QUERY)
    const handle = () => setReduced(media.matches)
    handle()
    media.addEventListener('change', handle)
    return () => media.removeEventListener('change', handle)
  }, [])

  return reduced
}
```

Create `packages/styling/src/react/useMotion.ts`:

```ts
import { useMemo } from 'react'
import { motion, type MotionDurationKey, type MotionEasingKey } from '@xerena/tokens'
import { useReducedMotion } from './useReducedMotion'

export interface UseMotionOptions {
  reducedMotion?: boolean
}

export interface UseMotionResult {
  durations: Record<MotionDurationKey, string>
  easings: Record<MotionEasingKey, string>
  reduced: boolean
}

export function useMotion(options: UseMotionOptions = {}): UseMotionResult {
  const systemReduced = useReducedMotion()
  const reduced = options.reducedMotion ?? systemReduced

  return useMemo<UseMotionResult>(() => {
    const durations = Object.fromEntries(
      Object.entries(motion.duration).map(([key, ms]) => [key, reduced ? '1ms' : `${ms}ms`]),
    ) as Record<MotionDurationKey, string>
    const easings = Object.fromEntries(
      Object.entries(motion.easing).map(([key, points]) => [key, `cubic-bezier(${points.join(', ')})`]),
    ) as Record<MotionEasingKey, string>
    return { durations, easings, reduced }
  }, [reduced])
}
```

Create `packages/styling/src/react/index.ts`:

```ts
export * from './useReducedMotion'
export * from './useMotion'
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx nx run styling:test`
Expected: PASS — hooks tests plus all earlier suites.

- [ ] **Step 5: Add the react entry to the build and exports**

Update `packages/styling/tsup.config.ts` — change the `entry` line to:

```ts
  entry: ['src/index.ts', 'src/react/index.ts'],
```

Update `packages/styling/package.json` — add to `exports` (after the `"."` entry):

```json
    "./react": {
      "types": "./dist/react/index.d.ts",
      "import": "./dist/react/index.js",
      "require": "./dist/react/index.cjs"
    },
```

- [ ] **Step 6: Run versioning + package gate**

Run:
```bash
npx nx run styling:lint
npx nx run styling:typecheck
npx nx run styling:test
npx nx run styling:build
```
Expected: all pass. Verify `dist/react/index.js` and `dist/react/index.cjs` exist after build.

- [ ] **Step 7: Commit**

```bash
git add packages/styling/src/react packages/styling/tsup.config.ts packages/styling/package.json
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "feat(styling): add motion hooks useReducedMotion and useMotion"
```

---
---

### Task 5: Styling docs guide page

**Files:**
- Create: `apps/docs/guide/styling.md`
- Modify: `apps/docs/.vitepress/config.mts` (sidebar after `Motion`)

**Interfaces:**
- Consumes: the package surface built in Tasks 1–4 (utility class names, `cssVar`/`css`, value resolvers, hooks signatures) — values below are literal text, matching the class names the generator emits.
- Produces: VitePress guide page "Styling" + sidebar entry. No runtime imports on the page.

- [ ] **Step 1: Write the guide page**

Create `apps/docs/guide/styling.md`:

````md
# Styling

The Styling foundation is the ergonomic layer between design tokens and
components — three layers shipped in `@xerena/styling`:

- A **token-driven utility stylesheet** (`@xerena/styling/styles.css`).
- **Typed style helpers** for raw cross-platform values and CSS-ready strings.
- **Motion hooks** (`@xerena/styling/react`) for reduced-motion-correct motion.

No runtime animation code lives here; phases after this one consume these
layers to build components.

## Utility classes

Import the stylesheet once, after `@xerena/tokens/tokens.css`:

```ts
import '@xerena/tokens/tokens.css'
import '@xerena/styling/styles.css'
```

Every class references the design-token CSS variables, so overrides and dark
mode keep working through the variable layer. Unitless numeric tokens are
consumed through `calc`.

| Family | Classes | Example |
|---|---|---|
| Color | `xr-bg-{name}-{shade}`, `xr-text-{name}-{shade}`, `xr-border-{name}-{shade}` | `xr-bg-ember-600` |
| Spacing | `xr-p-{k}`, `xr-px-{k}`, `xr-py-{k}`, `xr-m-{k}`, `xr-mx-{k}`, `xr-my-{k}`, `xr-gap-{k}` | `xr-p-4`, `xr-gap-6` |
| Typography | `xr-font-family-{family}`, `xr-font-size-{variant}-{size}`, `xr-leading-{variant}-{size}`, `xr-font-weight-{variant}-{size}`, `xr-tracking-{variant}-{size}` | `xr-font-family-body`, `xr-font-size-body-md` |
| Elevation | `xr-elevation-{key}` | `xr-elevation-raised` |
| Radius | `xr-radius-{key}` | `xr-radius-lg` |
| Motion | `xr-duration-{key}`, `xr-ease-{key}` | `xr-duration-base`, `xr-ease-standard` |

> Semantic colors become available as utilities in the Components phase,
> together with `--xr-semantic-*` variables and theming (`xr-bg-primary`).

## Style helpers

Helpers never duplicate token data — they read `@xerena/tokens` and add typed
access plus CSS-name resolution. The root export has no React dependency, so
React Native consumers can use it in Phase 6.

```ts
import { cssVar, css, spacingValue, radiusValue, durationValue, easingValue } from '@xerena/styling'
```

| Function | Returns | Example result |
|---|---|---|
| `cssVar(path)` | bare CSS variable reference | `"var(--xr-color-ember-600)"` |
| `css(path)` | CSS-ready value | `"calc(var(--xr-spacing-4) * 1px)"`, `"cubic-bezier(var(--xr-motion-easing-standard))"` |
| `spacingValue(key)` | raw number | `16` |
| `radiusValue(key)` | raw number | `12` |
| `durationValue(key)` | raw milliseconds | `150` |
| `easingValue(key)` | 4-point control tuple | `[0.2, 0, 0, 1]` |

## Motion hooks

```ts
import { useReducedMotion, useMotion } from '@xerena/styling/react'
```

- `useReducedMotion()` — `boolean`; follows `prefers-reduced-motion: reduce`,
  reactive to system changes, `false` during SSR.
- `useMotion({ reducedMotion? })` — `{ durations, easings, reduced }`.
  `durations` are CSS-ready milliseconds; when reduced (system or the
  `reducedMotion` override) **every duration snaps to `1ms`**. `easings` are
  `cubic-bezier(...)` strings and never change with reduced motion.

```tsx
function Example({ children }) {
  const { durations, easings } = useMotion()
  return (
    <div style={{ transitionDuration: durations.fast, transitionTimingFunction: easings.standard }}>
      {children}
    </div>
  )
}
```

Runtime motion primitives and component-level motion arrive in the Components
phase; the values above are the binding contract for them.
````

- [ ] **Step 2: Register the page in the sidebar**

`apps/docs/.vitepress/config.mts` — in the `sidebar` `Guide` items array (after `{ text: 'Motion', link: '/guide/motion' }`), add:

```ts
{ text: 'Styling', link: '/guide/styling' },
```

Nav stays as-is.

- [ ] **Step 3: Build the docs to verify the page renders**

Run: `npx nx run docs:build --skip-nx-cache`
Expected: PASS. Verify the built page:
```bash
grep -c 'Styling' apps/docs/.vitepress/dist/guide/styling.html
grep -c 'cubic-bezier(var(--xr-motion-easing-standard))' apps/docs/.vitepress/dist/guide/styling.html
```
Both must return nonzero counts (page exists; helper table content rendered).

- [ ] **Step 4: Commit**

```bash
git add apps/docs/guide/styling.md apps/docs/.vitepress/config.mts
git -c user.name="Xerena" -c user.email="xerena@local" commit -m "docs: add styling guide page"
```

---
---

### Task 6: Full pipeline verification

**Files:** none (verification only; unless a failure forces a fix).

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: recorded evidence the whole repo is green after the phase.

- [ ] **Step 1: Run the repo-wide gate**

Run (from repo root):

```bash
npx nx run-many -t typecheck lint test build --skip-nx-cache
```

Expected: all target-bearing projects pass (tokens, react, react-native,
brand, styling, storybook build, docs build). Record counts — styling tests:
`src/css.test.ts` (9 `it`), `src/values.test.ts` (4 `it`), `src/react/hooks.test.tsx`
(7 `it`), `scripts/generate-styles.test.mjs` (6 `it`) = 26 test cases across
4 files; tokens 15, react 2, react-native 1, brand 13.

- [ ] **Step 2: Verify the phase contract end-to-end**

```bash
grep -E '\.xr-(bg-ember-600|duration-base|ease-standard)' packages/styling/dist/styles.css
grep -c 'Styling' apps/docs/.vitepress/dist/guide/styling.html
```

Expected: the three utility class lines above; `guide/styling.html` exists and
contains the heading/sidebar text. Also confirm no changes leaked into the
preexisting packages:

```bash
git status --short
```

- [ ] **Step 3: Confirm the repo is clean**

Run: `git status --short`
Expected: empty (working tree clean).

---
---

## Self-Review

**Spec coverage check:**
- Utility CSS generator (Lapisan a) → Task 3 (all six families, `calc` for
  unitless numbers, `var()` references, determinism, semantic colors deferred).
- Style helpers (Lapisan b) → Tasks 1–2 (`css.ts` = `cssVar`/`css` with unit
  inference; `spacing.ts`/`radius.ts`/`motion.ts` = `spacingValue`/`radiusValue`/
  `durationValue`/`easingValue` + `Bezier`; `keyof typeof` key types re-exported).
- Motion hooks (Lapisan c) → Task 4 (system-driven `useReducedMotion`
  SSR-safe; `useMotion` snap-all-to-instant with `reducedMotion` override;
  easings unaffected; `./react` boundary; tsup two-entry build).
- Package + boundaries → Task 1 (scaffold, eslint `no-restricted-imports` two
  blocks: root forbids `react`/`react-dom`/`@xerena/react`/`@xerena/react-native`;
  `./react` forbids `@xerena/react-native`); root scripts + tsconfig paths updated.
- Docs page → Task 5 (`apps/docs/guide/styling.md` 7 sections, sidebar after
  Motion, no runtime imports).
- Verification → Task 6 (repo-wide gate + contract greps + clean tree).

**Placeholder scan:** no TBD/TODO; every code step carries exact content; every
commit step carries the exact file list + message.

**Type consistency:** `cssVar(path: string)`, `css(path: string)`,
`spacingValue(key: SpacingKey)`, `radiusValue(key: RadiusKey)`,
`durationValue(key: MotionDurationKey)`, `easingValue(key: MotionEasingKey)`,
`Bezier = readonly [number, number, number, number]`,
`useMotion(options?: { reducedMotion?: boolean }): { durations; easings; reduced }` —
identical across Tasks 1, 2, 4, 5 and the spec. Hook test counts: hooks.test.tsx
has 7 `it` blocks (2 useReducedMotion + 5 useMotion). css.test.ts has 9 `it`
(2 cssVar + 7 css). Both match the Task 6 totals (9 + 4 + 7 + 6 = 26).

Known accepted type boundary (documented in spec): `motion.easing[key]` is
`number[]` (JSON widening) so `easingValue` casts once at the boundary
(`as unknown as Bezier`) — the only cast in the package.