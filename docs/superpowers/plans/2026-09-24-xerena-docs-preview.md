# @xerena/preview + fumadocs Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public `@xerena/preview` package (live React preview surface with auto-captured source and a local light/dark toggle) and rebuild `apps/docs` on Next.js + fumadocs as a statically-exported site with 3 pilot component pages, without deploying anything.

**Architecture:** `packages/preview` is a new workspace library mirroring `@xerena/react`'s build/test layout; it ships a React core entry plus an `@xerena/preview/mdx` remark-plugin entry with zero runtime dependencies. `apps/docs` is rebuilt in place (VitePress toolchain removed, legacy `.md` content archived to `content-legacy/` for the later port phase), targeting `output: 'export'` with the built-in search engine in static mode (Task 1 confirmed the engine emits a static index; it identifies as zbsearch, not Orama — static wiring unaffected).

**Tech Stack:** React 19 (`^19.0.0` peer), TypeScript 5, Vite 6 lib build + `vite-plugin-dts`, vitest 3 + `@testing-library/react` 16 + jsdom, Next.js `16.3.6`, `fumadocs-core`/`fumadocs-ui` `16.15.14`, `fumadocs-mdx` `15.4.4`, Tailwind CSS `4.3.3` (docs app only), `unified`/`remark-parse`/`remark-mdx` (plugin unit tests only), pnpm 10, Nx 21, Node >= 22.

**Spec:** `docs/superpowers/specs/2026-09-24-xerena-docs-preview-design.md` — the plan argues from the spec; executors read both.

## Global Constraints

- Package manager is `pnpm@10.0.0`, engines `node >= 22`. Install with `pnpm install --frozen-lockfile`; commit the lockfile when dependencies change.
- `@xerena/react` peer is `^19.0.0`; `@xerena/react` workspace version is `0.1.0` — peer range `^0.1.0` links locally and publishes safely.
- Tailwind CSS exists ONLY in `apps/docs`. No `tailwindcss` import, class, or config anywhere in `packages/*`. Enforced by `no-restricted-imports` in the new package.
- `@xerena/preview` must not import `@xerena/native` or `react-native` (same boundary rule as `@xerena/react`).
- `verbatimModuleSyntax` is on: every type-only import uses `import type` or inline `type` modifiers.
- `noUncheckedIndexedAccess` is on: every indexed access handles `T | undefined`.
- English only for code, docs, commits, and ledger. No emojis.
- Commit identity: `git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit`. One logical change per commit, conventional messages.
- `dist/`, `lib/`, `node_modules/` are gitignored — never commit them. (The SDD ledger under `.superpowers/` is committed deliberately via `git add -f`, because `.superpowers/sdd/.gitignore` contains `*`.)
- Do NOT run `pnpm release` / `changeset publish` — publishing waits for explicit user consent.
- Do NOT dispatch the docs deploy workflow — it is manual-only and stays undispatched.
- Each task ends with its own review gate; record results in `.superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md`.

---

## File Structure

New package (mirrors `packages/react` layout):

```
packages/preview/
  package.json            name @xerena/preview, version 0.0.0, exports ., ./mdx, ./styles.css
  project.json            nx targets: build, test (dependsOn ^build), typecheck, lint
  tsconfig.json           extends tools/tsconfig/tsconfig.react.json
  vite.config.ts          lib entry index in Task 2 (+ mdx in Task 3), dts rollupTypes, cssCodeSplit false
  vitest.setup.ts         jest-dom matchers only
  eslint.config.js        @xerena/eslint-config + boundary rules (native, react-native, tailwindcss)
  scripts/copy-css.mjs    copies src/styles.css → dist/styles.css
  src/index.ts            public React exports: Preview, PreviewProps
  src/Preview.tsx         'use client' live surface + code panel + mode toggle
  src/theme.ts            mode type + theme builder for @xerena/react Provider
  src/styles.css          plain CSS from --xr-* token variables (no Tailwind)
  src/mdx.ts              previewCodePlugin() remark transformer (zero runtime deps)
  src/Preview.test.tsx    behavior tests
  src/mdx.test.ts         plugin tests over real parsed ASTs
```

Docs rebuild (in place, `apps/docs`):

```
apps/docs/
  package.json            Next 16 + fumadocs + Tailwind 4 + workspace deps (vitepress removed)
  next.config.mjs         withMDX wrapper, output: 'export', basePath, trailingSlash
  source.config.ts        defineDocs collections
  postcss.config.mjs      @tailwindcss/postcss
  tsconfig.json           Next app config (jsx preserve, @/* paths)
  eslint.config.js        shared base config
  project.json            dev/build/typecheck/lint targets (build outputs out/)
  app/layout.tsx          RootProvider (from fumadocs-ui/provider/next) with static search + global CSS imports
  app/docs/layout.tsx     DocsLayout wrapper (required: DocsPage fails prerender without it)
  app/global.css          tailwind import, fumadocs css, token mapping
  app/page.tsx            minimal landing linking to /docs
  app/docs/[[...slug]]/page.tsx   docs route with generateStaticParams
  app/api/search/route.ts         staticGET search index
  lib/source.ts           loader
  mdx-components.tsx      global MDX components (Preview, Callout, Card)
  content/docs/**/meta.json       file-based navigation (Task 4 shell; Task 5 adds entries)
  content/docs/guide/*.mdx        ported guides (Task 5)
  content/docs/components/*/*.mdx 3 pilot pages (Task 5)
  content-legacy/         archived VitePress .md tree, created in Task 4 (port source for the later phase)
  public/mark.svg         kept in place
```

Repo-level:

```
package.json              root test/lint/typecheck scripts gain preview (+docs on lint/typecheck)
.gitignore                add apps/docs/out, apps/docs/.next, apps/docs/.source, apps/docs/next-env.d.ts
.github/workflows/docs.yml  workflow_dispatch manual Pages deploy (Task 6)
.changeset/preview-minor.md  release prep (Task 7, no publish)
.superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md  ledger
```

Out of this plan (separate phases, do not implement here): porting the remaining 39 component pages, deleting `content-legacy/`, publishing to npm.

---

### Task 1: Stack verification spike

Throwaway probe. No product code in this task may touch the repo (only the ledger file). If any check fails, stop, record the blocker in the ledger, and do not proceed to Task 2.

**Files:**
- Create (scratch only): `/tmp/opencode/docs-spike/` — minimal Next + fumadocs app
- Modify: none in repo
- Ledger: `.superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md` (create)

**Interfaces:**
- Consumes: spec decisions 1, 2, 6 (fumadocs stack, Tailwind scoping, static export)
- Produces: locked install recipe + confirmed integration shapes for Tasks 4 and 6 (exact versions, config keys, search wiring)

**Steps:**

- [ ] **Step 1: Create the scratch directory and init**

```bash
mkdir -p /tmp/opencode/docs-spike && cd /tmp/opencode/docs-spike && pnpm init -y
```

- [ ] **Step 2: Install the exact stack**

```bash
cd /tmp/opencode/docs-spike && pnpm add next@16.3.6 react@19.3.0 react-dom@19.3.0 fumadocs-core@16.15.14 fumadocs-ui@16.15.14 fumadocs-mdx@15.4.4 tailwindcss@4.3.3 @tailwindcss/postcss@^4 && pnpm add -D typescript@^5.6.0 @types/react @types/react-dom @types/mdx
```

Expected: install succeeds, `pnpm-lock.yaml` created in scratch (never committed).

- [ ] **Step 3: Scaffold the minimal app**

Copy the Task 4 file shapes verbatim (same `next.config.mjs`, `source.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts`, `lib/source.ts`, `mdx-components.tsx` contents — do not improvise variants), plus:
- `source.config.ts` additionally registers a no-op remark plugin (`remarkPlugins: [() => () => {}]`) to prove the `mdxOptions.remarkPlugins` key shape the real plugin will use.
- `components/hook-box.tsx` (`'use client'` at the top, renders a marker string, uses `useState`).
- `content/docs/index.mdx` renders BOTH: (a) the `'use client'` component imported and rendered inline (must succeed), and (b) a hook-using component rendered WITHOUT `'use client'` (expected to fail the build — this is the real authoring risk; a passing build here would be false confidence).

- [ ] **Step 4: Build and assert static output**

```bash
cd /tmp/opencode/docs-spike && pnpm exec next build
```

Expected: exit 0 for the passing page. Assert all three: `out/index.html` exists, the static search payload exists under `out/` — record its exact emitted path in the ledger (do not assume a `*search*.json` name; Task 4 asserts that recorded path), and the client component's marker text appears in the built HTML for the docs page. Then confirm the hook-without-`'use client'` case fails the build as expected; if it unexpectedly passes, record that too (it changes the Task 5 authoring rule).

- [ ] **Step 5: Record the verdict in the ledger**

Append to `.superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md`: exact locked versions from the scratch lockfile, the confirmed config keys, the exact emitted search-payload path under `out/` (Task 4 asserts this path — record it verbatim), and either PASS (proceed) or the precise failure (stop).

- [ ] **Step 6: Delete the scratch directory**

```bash
rm -rf /tmp/opencode/docs-spike
```

Expected: `/tmp/opencode/docs-spike` no longer exists; `git status --short` in the repo shows only the new ledger file.

- [ ] **Step 7: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "chore(docs): stack verification notes for fumadocs static export"
```

---

### Task 2: `packages/preview` scaffold + `<Preview>` component

**Files:**
- Create: `packages/preview/package.json`, `packages/preview/project.json`, `packages/preview/tsconfig.json`, `packages/preview/vite.config.ts`, `packages/preview/vitest.setup.ts`, `packages/preview/eslint.config.js`, `packages/preview/scripts/copy-css.mjs`, `packages/preview/src/index.ts`, `packages/preview/src/Preview.tsx`, `packages/preview/src/theme.ts`, `packages/preview/src/styles.css`, `packages/preview/src/Preview.test.tsx`
- Modify: root `package.json` (add `preview` to `test`, `lint`, `typecheck` `--projects` lists)

**Interfaces:**
- Consumes: `@xerena/react` `Provider` + `XTheme` (`{ mode: 'light' | 'dark'; semantic?: Partial<Record<SemanticAlias, string>> }`); `Provider` renders children inside `<div data-xerena-theme={mode}>` — tests assert against that attribute
- Produces for Task 3: `vite.config.ts` shell (Task 3 adds the `mdx` entry), `project.json`, package exports map; for Task 4: `Preview` + `PreviewProps` from `@xerena/preview`, `styles.css` path `@xerena/preview/styles.css`
- Produces for Task 5: the exact authoring contract (props table in the spec)

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "@xerena/preview",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./mdx": { "types": "./dist/mdx.d.ts", "import": "./dist/mdx.js", "require": "./dist/mdx.cjs" },
    "./styles.css": "./dist/styles.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "scripts": { "build": "vite build && node scripts/copy-css.mjs" },
  "peerDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0", "@xerena/react": "^0.1.0" },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@xerena/react": "^0.1.0",
    "jsdom": "^25.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0",
    "vitest": "^3.0.0"
  }
}
```

`@xerena/react: ^0.1.0` in both peer and dev deps links to the workspace locally (workspace version is `0.1.0`) and publishes as a safe range.

- [ ] **Step 2: Write `project.json`, `tsconfig.json`, `vite.config.ts`, `vitest.setup.ts`, `eslint.config.js`, `scripts/copy-css.mjs`**

Full contents (do not improvise variants):

`project.json`:
```json
{
  "name": "preview",
  "projectType": "library",
  "sourceRoot": "packages/preview/src",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": { "command": "pnpm build", "cwd": "packages/preview" },
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "executor": "nx:run-commands",
      "options": { "command": "vitest run", "cwd": "packages/preview" },
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": { "command": "tsc -p tsconfig.json --noEmit", "cwd": "packages/preview" }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": { "command": "eslint src", "cwd": "packages/preview" }
    }
  }
}
```

The `test` target — and only the `test` target — gets `"dependsOn": ["^build"]`, because vitest resolves `@xerena/react` to its `dist` at runtime. Typecheck needs no such dependency: `tsconfig.base.json` paths map `@xerena/react` to source, so `tsc` never touches `dist`. (Do not copy `react-native`'s typecheck `dependsOn`; its situation differs.)

`tsconfig.json`:
```json
{
  "extends": "../../tools/tsconfig/tsconfig.react.json",
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom", "node", "react", "react-dom"]
  },
  "include": ["src", "vite.config.ts", "vitest.setup.ts"]
}
```

`vite.config.ts` (single `index` entry only — the `mdx` entry is added by Task 3 together with `src/mdx.ts`, so every task's build gate is reachable):
```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ entryRoot: 'src', rollupTypes: true })],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
      },
      name: 'XerenaPreview',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index' ? (format === 'es' ? 'index.js' : 'index.cjs') : `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', '@xerena/react', '@xerena/tokens', '@xerena/styling'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

`vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

(No matchMedia shim — nothing here touches it.)

`eslint.config.js`:
```js
import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@xerena/native', message: 'preview package must not import native' },
            { name: 'react-native', message: 'native code is not allowed here' },
            { name: 'tailwindcss', message: 'preview package is Tailwind-free; use token CSS variables' },
          ],
        },
      ],
    },
  },
]
```

`scripts/copy-css.mjs`:
```js
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(resolve(root, 'dist'), { recursive: true })
copyFileSync(resolve(root, 'src/styles.css'), resolve(root, 'dist/styles.css'))
console.log('copied dist/styles.css')

// Vite strips 'use client' directives when bundling. Next.js RSC needs the
// directive present in the published entry, so re-apply it post-build.
// index.js + index.cjs ONLY — never mdx.* (Node-only remark plugin).
for (const file of ['index.js', 'index.cjs']) {
  const path = resolve(root, 'dist', file)
  const source = readFileSync(path, 'utf8')
  if (!source.startsWith("'use client'")) {
    writeFileSync(path, `'use client';\n${source}`)
    console.log(`prepended 'use client' to dist/${file}`)
  }
}
```

(Plain copy — unlike `react`'s script, there is nothing to concatenate: token values arrive at runtime via `@xerena/react/styles.css`, which the consumer also loads.)

- [ ] **Step 3: Write the failing test `src/Preview.test.tsx`**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { Preview } from './Preview'

test('renders children inside the preview surface', () => {
  render(<Preview title="Demo"><button type="button">Save</button></Preview>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('code panel is open by default and toggles', () => {
  const code = '<button type="button">Save</button>'
  render(<Preview title="Demo" code={code}><button type="button">Save</button></Preview>)
  expect(screen.getByText(code)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /hide code/i }))
  expect(screen.queryByText(code)).not.toBeInTheDocument()
})

test('respects showCode={false} initially', () => {
  const code = '<button type="button">Save</button>'
  render(<Preview title="Demo" code={code} showCode={false}><button type="button">Save</button></Preview>)
  expect(screen.queryByText(code)).not.toBeInTheDocument()
})

test('theme toggle is local to the preview', () => {
  render(
    <div data-testid="host">
      <Preview title="Demo" defaultMode="light"><button type="button">Save</button></Preview>
    </div>,
  )
  const host = screen.getByTestId('host')
  expect(host.querySelector('[data-xerena-theme="light"]')).not.toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /dark/i }))
  expect(host.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
  expect(host.querySelector('[data-xerena-theme="light"]')).toBeNull()
  expect(host.getAttribute('data-xerena-theme')).toBeNull()
})

test('starts in dark mode when defaultMode is dark', () => {
  render(<Preview title="Demo" defaultMode="dark"><button type="button">Save</button></Preview>)
  expect(document.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
})

test('renders an exact explicit code string verbatim', () => {
  const code = '<Button variant="primary" size="lg">Save</Button>'
  render(<Preview title="Demo" code={code}><button type="button">Save</button></Preview>)
  expect(screen.getByText(code).textContent).toBe(code)
})

test('works identically under prefers-reduced-motion (no animation dependency)', () => {
  window.matchMedia = ((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
  render(<Preview title="Demo"><button type="button">Save</button></Preview>)
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: /dark/i }))
  expect(document.querySelector('[data-xerena-theme="dark"]')).not.toBeNull()
})
```

- [ ] **Step 4: Install, then run the test to verify it fails**

```bash
cd /home/ubuntu/xerena-ui && pnpm install && cd packages/preview && pnpm exec vitest run src/Preview.test.tsx
```

Plain `pnpm install` (not `--frozen-lockfile`): this is a brand-new workspace package, so the lockfile must be created/updated and devDeps linked before vitest exists. Expected: FAIL with "Failed to resolve import './Preview'" — not "command not found", which would mean the install step was skipped.

- [ ] **Step 5: Write `src/theme.ts`**

```ts
import type { XTheme } from '@xerena/react'

export type PreviewMode = 'light' | 'dark'

export function previewTheme(mode: PreviewMode): XTheme {
  return { mode }
}
```

- [ ] **Step 6: Write `src/Preview.tsx`**

`@xerena/react`'s `Provider` snapshots its `theme` prop into internal state and drops controlled updates that change `mode` (`Provider.tsx:15-16`), so passing a new `theme={{ mode }}` on toggle does nothing. Do NOT change the published package. Instead drive the switch through the context's public `setTheme` API from an inner component — this preserves the example's interactive state across toggles (no remount).

Critical subtlety (found the hard way — a naive version hangs the suite): `Provider` rebuilds its context value every render, so the `setTheme` identity changes on every render. Calling it unconditionally from an effect retriggers the effect forever. Guard on `theme.mode !== mode` and call through a ref so the effect depends only on stable values:

```tsx
'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Provider, useTheme } from '@xerena/react'
import { previewTheme, type PreviewMode } from './theme'

function ModeSync({ mode }: { mode: PreviewMode }) {
  const { theme, setTheme } = useTheme()
  const setThemeRef = useRef(setTheme)
  setThemeRef.current = setTheme
  useEffect(() => {
    // Guarded: Provider mints a new setTheme identity per render, so an
    // unconditional call loops forever. Only sync when modes actually differ.
    if (theme.mode !== mode) {
      setThemeRef.current(previewTheme(mode))
    }
  }, [mode, theme.mode])
  return null
}

export interface PreviewProps {
  title?: string
  description?: string
  code?: string
  defaultMode?: PreviewMode
  showCode?: boolean
  children: ReactNode
}

export function Preview({ title, description, code, defaultMode = 'light', showCode = true, children }: PreviewProps) {
  const [mode, setMode] = useState<PreviewMode>(defaultMode)
  const [open, setOpen] = useState(showCode)
  const next: PreviewMode = mode === 'light' ? 'dark' : 'light'
  return (
    <section className="xr-preview" aria-label={title ?? 'Example preview'}>
      {(title !== undefined || description !== undefined) && (
        <div className="xr-preview__header">
          {title !== undefined && <p className="xr-preview__title">{title}</p>}
          {description !== undefined && <p className="xr-preview__description">{description}</p>}
        </div>
      )}
      <div className="xr-preview__toolbar" role="group" aria-label="Preview options">
        <button type="button" className="xr-preview__toggle" aria-pressed={mode === 'dark'} onClick={() => setMode(next)}>
          {mode === 'light' ? 'Dark' : 'Light'}
        </button>
        {code !== undefined && (
          <button type="button" className="xr-preview__toggle" aria-pressed={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide code' : 'Show code'}
          </button>
        )}
      </div>
      <div className="xr-preview__surface">
        <Provider theme={previewTheme(mode)}>
          <ModeSync mode={mode} />
          {children}
        </Provider>
      </div>
      {code !== undefined && open && (
        <pre className="xr-preview__code">
          <code>{code}</code>
        </pre>
      )}
    </section>
  )
}
```

`'use client'` is required: `useState` cannot run in a server component.

- [ ] **Step 7: Write `src/index.ts` and `src/styles.css`**

```ts
export { Preview, type PreviewProps } from './Preview'
export { previewTheme, type PreviewMode } from './theme'
```

`styles.css` (all variables verified to exist in `packages/tokens/dist/tokens.css`):

```css
/* Requires @xerena/react/styles.css loaded alongside this file: the --xr-*
   variables below are defined there (packages/tokens/dist/tokens.css). */
.xr-preview { border: 1px solid var(--xr-semantic-color-border); border-radius: var(--xr-radius-lg); overflow: hidden; background: var(--xr-semantic-color-background); }
.xr-preview__header { padding: 12px 16px; border-bottom: 1px solid var(--xr-semantic-color-border); }
.xr-preview__title { margin: 0; color: var(--xr-semantic-color-text); font-weight: 600; }
.xr-preview__description { margin: 4px 0 0; color: var(--xr-semantic-color-text); opacity: 0.75; }
.xr-preview__toolbar { display: flex; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--xr-semantic-color-border); }
.xr-preview__toggle { border: 1px solid var(--xr-semantic-color-border); border-radius: var(--xr-radius-md); background: var(--xr-semantic-color-surface); color: var(--xr-semantic-color-text); padding: 4px 12px; cursor: pointer; }
.xr-preview__surface { padding: 24px 16px; background: var(--xr-semantic-color-background); }
.xr-preview__code { margin: 0; padding: 16px; border-top: 1px solid var(--xr-semantic-color-border); background: var(--xr-semantic-color-surface); overflow-x: auto; color: var(--xr-semantic-color-text); }
```

- [ ] **Step 8: Run the tests**

```bash
cd /home/ubuntu/xerena-ui && pnpm install && pnpm exec nx run-many -t test typecheck lint --projects=preview --skip-nx-cache
```

Plain `pnpm install` (not `--frozen-lockfile`) because the new workspace package requires a lockfile update. Expected: 7/7 tests pass, typecheck and lint clean. The `test` target's `dependsOn: ["^build"]` builds `@xerena/react` dist first because vitest resolves it at runtime.

- [ ] **Step 9: Build the package**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run preview:build --skip-nx-cache
```

Expected: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/styles.css` exist (`dist/mdx.*` do NOT exist yet — the `mdx` entry ships with Task 3), AND the first line of both `dist/index.js` and `dist/index.cjs` is exactly `'use client';` (assert with `head -1`; Vite strips the source directive at bundle time, the post-build script restores it).

- [ ] **Step 10: Register the package in the root scripts**

Edit root `package.json` scripts with these exact new values (append `,preview` to each list):

```json
"test": "nx run-many -t test --projects=tokens,react,react-native,brand,styling,preview",
"lint": "nx run-many -t lint --projects=tokens,react,react-native,brand,styling,preview",
"typecheck": "nx run-many -t typecheck --projects=tokens,react,react-native,brand,styling,preview"
```

Verify with `node -e "console.log(require('./package.json').scripts.test)"` that `preview` appears in all three.

- [ ] **Step 11: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add packages/preview package.json pnpm-lock.yaml .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "feat(preview): public @xerena/preview package with live Preview surface"
```

---

### Task 3: MDX source-capture plugin

**Files:**
- Create: `packages/preview/src/mdx.ts`, `packages/preview/src/mdx.test.ts`
- Modify: none (`src/index.ts` is intentionally untouched — the plugin stays OUT of the React entry so the core stays MDX-free; it ships only through the `./mdx` export map)
- Test: `packages/preview/src/mdx.test.ts`

**Interfaces:**
- Consumes: Task 2's `vite.config.ts` (this task adds the `mdx` lib entry to it) and `project.json` (unchanged). Test harness: `unified@11.0.5` + `remark-parse@11.0.0` + `remark-mdx@3.1.1` as devDependencies
- Produces for Task 4: `previewCodePlugin` factory, importable as `@xerena/preview/mdx`, registered via fumadocs-mdx `mdxOptions.remarkPlugins`. Behaviour contract: `<Preview>` flow elements (`mdxJsxFlowElement`) without an explicit `code` attribute gain one containing the exact authored children source; everything else is byte-identical. Known limitation (by design): inline `<Preview>` inside a paragraph (`mdxJsxTextElement`) is not handled — previews are block-level only; document this in the ledger.

- [ ] **Step 1: Add the test-only parser dependencies**

```bash
cd /home/ubuntu/xerena-ui/packages/preview && pnpm add -D unified@11.0.5 remark-parse@11.0.0 remark-mdx@3.1.1
```

These are dev-only; the plugin itself has zero runtime dependencies. Commit the lockfile change with the task.

- [ ] **Step 2: Write the failing test `src/mdx.test.ts`**

```ts
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, test } from 'vitest'
import { previewCodePlugin } from './mdx'

function apply(source: string): unknown {
  const processor = unified().use(remarkParse).use(remarkMdx).use(previewCodePlugin)
  const tree = processor.parse(source)
  processor.runSync(tree, { value: source })
  return tree
}

function findPreview(tree: unknown): Array<Record<string, unknown>> {
  const found: Array<Record<string, unknown>> = []
  const visit = (node: unknown): void => {
    if (typeof node !== 'object' || node === null) return
    const record = node as Record<string, unknown>
    if (record['type'] === 'mdxJsxFlowElement' && record['name'] === 'Preview') found.push(record)
    const children = record['children']
    if (Array.isArray(children)) children.forEach(visit)
  }
  visit(tree)
  return found
}

function codeOf(node: Record<string, unknown>): unknown {
  const attributes = node['attributes']
  if (!Array.isArray(attributes)) return undefined
  for (const attribute of attributes) {
    if (typeof attribute === 'object' && attribute !== null) {
      const record = attribute as Record<string, unknown>
      if (record['type'] === 'mdxJsxAttribute' && record['name'] === 'code') return record['value']
    }
  }
  return undefined
}

describe('previewCodePlugin', () => {
  test('injects code from Preview children', () => {
    const tree = apply('<Preview title="Primary">\n  <Button variant="primary">Save</Button>\n</Preview>\n')
    const previews = findPreview(tree)
    expect(previews).toHaveLength(1)
    expect(codeOf(previews[0] as Record<string, unknown>)).toBe('<Button variant="primary">Save</Button>')
  })

  test('explicit code prop wins over injection', () => {
    const tree = apply('<Preview title="Primary" code="manual">\n  <Button>Save</Button>\n</Preview>\n')
    expect(codeOf(findPreview(tree)[0] as Record<string, unknown>)).toBe('manual')
  })

  test('leaves self-closing Preview untouched', () => {
    const tree = apply('<Preview title="Empty" />\n')
    expect(codeOf(findPreview(tree)[0] as Record<string, unknown>)).toBeUndefined()
  })

  test('handles nested JSX and multiple previews independently', () => {
    const tree = apply(
      '<Preview title="One">\n  <Card><Button>Go</Button></Card>\n</Preview>\n\n<Preview title="Two">\n  <Badge>New</Badge>\n</Preview>\n',
    )
    const previews = findPreview(tree)
    expect(previews).toHaveLength(2)
    expect(codeOf(previews[0] as Record<string, unknown>)).toBe('<Card><Button>Go</Button></Card>')
    expect(codeOf(previews[1] as Record<string, unknown>)).toBe('<Badge>New</Badge>')
  })

  test('ignores non-Preview elements', () => {
    const tree = apply('<Callout>\n  <Button>Save</Button>\n</Callout>\n')
    expect(findPreview(tree)).toHaveLength(0)
  })
})
```

Expected code values are trimmed of surrounding whitespace/newlines but otherwise byte-exact.

- [ ] **Step 3: Run to verify failure**

```bash
cd /home/ubuntu/xerena-ui/packages/preview && pnpm exec vitest run src/mdx.test.ts
```

Expected: FAIL with "Failed to resolve import './mdx'".

- [ ] **Step 4: Write `src/mdx.ts`**

Minimal structural types only — no `mdast` dependency:

```ts
interface MdxPosition {
  start: { offset?: number }
  end: { offset?: number }
}

interface MdxJsxAttribute {
  type: string
  name?: string
  value?: unknown
}

interface MdxElement {
  type?: unknown
  name?: unknown
  attributes?: unknown
  children?: unknown
  position?: MdxPosition
}

interface MdxFile {
  value: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function sliceChildrenSource(source: string, node: MdxElement): string | undefined {
  const children = node.children
  if (!Array.isArray(children) || children.length === 0) return undefined
  const first = children[0]
  const last = children[children.length - 1]
  if (!isRecord(first) || !isRecord(last)) return undefined
  const firstPosition = first['position'] as MdxPosition | undefined
  const lastPosition = last['position'] as MdxPosition | undefined
  const start = firstPosition?.start.offset
  const end = lastPosition?.end.offset
  if (typeof start !== 'number' || typeof end !== 'number') return undefined
  return source.slice(start, end).trim()
}

function hasCodeAttribute(node: MdxElement): boolean {
  if (!Array.isArray(node.attributes)) return false
  return node.attributes.some(
    (attribute) => isRecord(attribute) && attribute['type'] === 'mdxJsxAttribute' && attribute['name'] === 'code',
  )
}

function visit(node: unknown, source: string): void {
  if (!isRecord(node)) return
  if (node['type'] === 'mdxJsxFlowElement' && node['name'] === 'Preview') {
    const element = node as unknown as MdxElement
    if (!hasCodeAttribute(element)) {
      const code = sliceChildrenSource(source, element)
      if (code !== undefined && code.length > 0) {
        const attributes: MdxJsxAttribute[] = Array.isArray(element.attributes) ? element.attributes : []
        attributes.push({ type: 'mdxJsxAttribute', name: 'code', value: code })
        ;(node as Record<string, unknown>)['attributes'] = attributes
      }
    }
  }
  const children = node['children']
  if (Array.isArray(children)) children.forEach((child) => visit(child, source))
}

export function previewCodePlugin() {
  return (tree: unknown, file: MdxFile): void => {
    if (typeof file.value !== 'string') return
    visit(tree, file.value)
  }
}
```

- [ ] **Step 5: Add the `mdx` lib entry, then run tests, typecheck, lint, build**

Edit `packages/preview/vite.config.ts` — change the lib entry object from `{ index: ... }` to:

```ts
entry: {
  index: resolve(import.meta.dirname, 'src/index.ts'),
  mdx: resolve(import.meta.dirname, 'src/mdx.ts'),
},
```

(The `fileName` function from Task 2 already handles the `mdx` entry name — no other config change needed.)

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run-many -t test typecheck lint build --projects=preview --skip-nx-cache
```

Expected: all green, `dist/mdx.js`, `dist/mdx.cjs`, `dist/mdx.d.ts` exist alongside the index outputs.

- [ ] **Step 6: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add packages/preview pnpm-lock.yaml .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "feat(preview): MDX source-capture plugin with explicit-code escape hatch"
```

Record in the ledger: the plugin lives at `src/mdx.ts` (the spec's file map says `src/mdx-entry.ts` — the shorter name won because the export map already namespaces it as `@xerena/preview/mdx`).

---

### Task 4: Docs scaffold (Next.js + fumadocs, static export)

This task replaces the VitePress toolchain in `apps/docs`. Legacy `.md` content is archived to `content-legacy/` (outside the fumadocs collections dir, so the compiler never sees it) and stays there as port source for the later scale phase. `public/mark.svg` stays in place. Use the exact versions locked in Task 1; if Task 1 recorded different versions, those win and the ledger must say so.

**Files:**
- Create: `apps/docs/next.config.mjs`, `apps/docs/source.config.ts`, `apps/docs/postcss.config.mjs`, `apps/docs/tsconfig.json`, `apps/docs/eslint.config.js`, `apps/docs/app/layout.tsx`, `apps/docs/app/global.css`, `apps/docs/app/page.tsx`, `apps/docs/app/docs/layout.tsx`, `apps/docs/app/docs/[[...slug]]/page.tsx`, `apps/docs/app/api/search/route.ts`, `apps/docs/lib/source.ts`, `apps/docs/mdx-components.tsx`, `apps/docs/content/docs/meta.json`, `apps/docs/content/docs/index.mdx`
- Modify: `apps/docs/package.json`, `apps/docs/project.json`, root `.gitignore`
- Move: `apps/docs/guide/**` + `apps/docs/brand.md` + `apps/docs/index.md` → `apps/docs/content-legacy/` (git mv, history preserved)
- Keep: `apps/docs/.vitepress/` untouched in this task. It is deleted in Task 5 Step 6, only after the pilot `docs:build` gate passes (spec Acceptance: VitePress sources are removed only once the replacement is proven).

**Interfaces:**
- Consumes: `Preview` from `@xerena/preview` (Task 2), `@xerena/preview/styles.css`, `@xerena/react/styles.css`, `previewCodePlugin` from `@xerena/preview/mdx` (Task 3)
- Produces for Task 5: working `docs:build` emitting a static site, global `Preview` registration in MDX, `meta.json` navigation pattern to copy

- [ ] **Step 1: Install the docs dependencies**

```bash
cd /home/ubuntu/xerena-ui/apps/docs && pnpm add next@16.3.6 react@19.3.0 react-dom@19.3.0 fumadocs-core@16.15.14 fumadocs-ui@16.15.14 fumadocs-mdx@15.4.4 tailwindcss@4.3.3 @tailwindcss/postcss@^4 @xerena/react@workspace:* @xerena/preview@workspace:* && pnpm add -D typescript@^5.6.0 @types/react @types/react-dom @types/mdx @types/node@26.6.2 eslint@^9 @xerena/eslint-config@workspace:*

(`@types/node@26.6.2` is pinned because Next auto-adds it on first build — Task 1 locked this version; pinning avoids a lockfile surprise.)

(`@xerena/tokens` is deliberately absent: nothing in the docs app imports it directly — token values arrive at runtime through `@xerena/react/styles.css`, which the layout loads. See the comment at the top of `@xerena/preview`'s `styles.css`.)
```

- [ ] **Step 2: Write `next.config.mjs`**

```js
import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/xerena-ui',
  trailingSlash: true,
}

export default withMDX(config)
```

- [ ] **Step 3: Write `source.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `eslint.config.js`, `project.json`**

`source.config.ts`:
```ts
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { previewCodePlugin } from '@xerena/preview/mdx'

export const docs = defineDocs({
  dir: 'content/docs',
})

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [previewCodePlugin],
  },
})
```

If Task 1 found the installed fumadocs version uses the `defineDocs` from `fumadocs-mdx/macro` + `loader` shape instead, use that shape and record the deviation in the ledger — do not guess, follow Task 1's notes. Either way, `previewCodePlugin` must be registered in the MDX pipeline — without it every `<Preview>` renders an empty code panel.

`postcss.config.mjs`:
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

`eslint.config.js`: same shape as `packages/react/eslint.config.js` (shared base import).

`project.json`: targets `dev` (`next dev`), `build` (`next build`, outputs `{projectRoot}/out`), `typecheck` (`tsc -p tsconfig.json --noEmit`), `lint` (`eslint .`).

- [ ] **Step 4: Write the app shell — `app/layout.tsx`, `app/global.css`, `lib/source.ts`, `mdx-components.tsx`**

`lib/source.ts`:
```ts
import { docs } from '@/.source/server'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
})
```

If Task 1 recorded the macro-based loader shape, use that instead and note it.

`app/layout.tsx` (Task 1 verified `fumadocs-ui/root-provider` does NOT exist in 16.15.14 — use the `/provider/next` subpath):
```tsx
import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider/next'
import '@xerena/react/styles.css'
import '@xerena/preview/styles.css'
import './global.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider search={{ options: { type: 'static' } }}>{children}</RootProvider>
      </body>
    </html>
  )
}
```

`app/global.css`:
```css
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
```

Plus the token mapping: read `node_modules/fumadocs-ui/css/preset.css`, find its theme variable names, and map the documented subset (background, foreground, muted, border, primary, accent) to the matching `--xr-semantic-color-*` values. Write the mapping as explicit `:root` overrides in `global.css`. Record the exact variable table in the ledger.

`mdx-components.tsx`:
```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { Preview } from '@xerena/preview'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Preview,
    ...components,
  } satisfies MDXComponents
}
```

- [ ] **Step 5: Write the routes — `app/page.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts`, `content/docs/meta.json`, `content/docs/index.mdx`**

`app/docs/[[...slug]]/page.tsx` (if Task 1 recorded a different page shape for the installed fumadocs version, that shape wins — do not improvise):

```tsx
import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { notFound } from 'next/navigation'

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()
  const MDX = page.data.body
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}
```

The `components={getMDXComponents()}` prop is load-bearing, not decoration: without it the global `Preview` registration in `mdx-components.tsx` is dead code (Next honors only `useMDXComponents`/explicit props — nothing calls `getMDXComponents` otherwise) and every `<Preview>` in MDX fails prerender with `Expected component 'Preview' to be defined`.

The search route:

```ts
import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

export const revalidate = false
export const { staticGET: GET } = createFromSource(source)
```

`content/docs/index.mdx` is a one-paragraph placeholder welcome page (real landing content ships with the port phase).

`app/docs/layout.tsx` (required — Task 1 proved `DocsPage` fails prerender with `Please use <DocsPage /> under <DocsLayout />` without it):
```tsx
import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/source'

export default function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.pageTree}>{children}</DocsLayout>
}
```

- [ ] **Step 6: Archive legacy content (keep VitePress toolchain for now)**

```bash
cd /home/ubuntu/xerena-ui/apps/docs && mkdir -p content-legacy && git mv guide content-legacy/guide && git mv brand.md content-legacy/brand.md && git mv index.md content-legacy/index.md
```

Expected: `content/docs/` contains only the new `index.mdx` + `meta.json`; `content-legacy/` holds the full old tree (`guide/`, `brand.md`, `index.md`); `.vitepress/` is still present and untouched — it is deleted in Task 5 Step 6, only after the pilot `docs:build` gate passes.

- [ ] **Step 7: Update root `.gitignore`, root scripts, and build**

Append to root `.gitignore`:
```
apps/docs/out/
apps/docs/.next/
apps/docs/.source/
apps/docs/next-env.d.ts
```

Update root `package.json`: add `docs` to the `lint` and `typecheck` `--projects` lists (docs has no unit tests, so it stays out of `test`).

```bash
cd /home/ubuntu/xerena-ui && pnpm install && pnpm exec nx run docs:build --skip-nx-cache
```

Plain `pnpm install` (not `--frozen-lockfile`) because the rewritten dependencies require a lockfile update. Expected: exit 0, `apps/docs/out/index.html` exists, and the static search payload exists at the exact path Task 1 recorded in the ledger (do not guess the filename — assert that recorded path).

- [ ] **Step 8: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add apps/docs package.json pnpm-lock.yaml .gitignore .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "feat(docs): rebuild docs app on Next.js + fumadocs with static export"
```

- [ ] **Step 9 (added after Task 5 probe): Fix the MDX components wiring**

Task 5's build probe proved the plan's original page sketch was incomplete: pass `components={getMDXComponents()}` (imported from `@/mdx-components`) to `<MDX />` exactly as in the amended Step 5 above, rebuild, and confirm the `Expected component 'Preview' to be defined` error is gone. Commit separately:

```bash
cd /home/ubuntu/xerena-ui && git add apps/docs/app/docs/[[...slug]]/page.tsx .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "fix(docs): wire getMDXComponents into MDX render"
```

---

### Task 4b: Fix `@xerena/react` duplicate React in dist (found by Task 5 probe)

Task 5's build probe proved `packages/react/dist` bundles a second copy of `react-dom`: `Toast.tsx` imports `react-dom/client`, but `vite.config.ts` `external` lists only the exact `'react-dom'`, so Rollup inlines the subpath. Under Next 16 this trips React error #527 (two Reacts). A duplicate React in a published design-system bundle is objectively wrong regardless of docs.

**Files:**
- Modify: `packages/react/vite.config.ts`, `packages/react/dist/*` (rebuilt, gitignored)
- Test: existing `react` suite + docs build consuming the fresh dist

**Interfaces:**
- Consumes: Task 2's `dependsOn ^build` understanding (consumers resolve workspace deps to `dist`)
- Produces for Task 5 resume: a `dist` with zero bundled React — verified by grep, not by assumption

- [ ] **Step 1: Extend the externals**

In `packages/react/vite.config.ts`, change:
```ts
external: ['react', 'react-dom', '@xerena/tokens', '@xerena/styling'],
```
to:
```ts
external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', '@xerena/tokens', '@xerena/styling'],
```

- [ ] **Step 2: Rebuild and prove no bundled React**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run react:build --skip-nx-cache && grep -c "createRoot" packages/react/dist/index.js; grep -c "from\"react\"\|from 'react'" packages/react/dist/index.js
```

Expected: `createRoot` count drops to the re-export level (0 definitions — only the import statement remains); `react`/`react-dom` appear only as import specifiers, never inlined.

- [ ] **Step 3: Run the react gates**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run-many -t test typecheck lint --projects=react --skip-nx-cache
```

Expected: all green (externals change build output only, not sources).

- [ ] **Step 4: Commit (separate, reviewable)**

```bash
cd /home/ubuntu/xerena-ui && git add packages/react/vite.config.ts .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "fix(react): externalize react-dom/client and jsx-runtime from bundle"
```

This commit changes a published package's build output and MUST be reviewer-approved before Task 5 resumes.

---

### Task 4c: Make `@xerena/react` overlays SSR-safe (found by Task 5 probe)

> **OUTCOME: ABANDONED — do not execute this task.** Empirical probes proved the lazy-`react-dom` direction wrong-headed: (1) it breaks Menu focus-on-open and focus-trap timing (proven by scratch probes against the WIP — fixing that needs `Menu.tsx` surgery, a deeper published-behavior change); (2) it cannot clean the graph anyway, because `fumadocs-ui/dist` itself carries top-level static `react-dom` imports. The WIP was reverted uncommitted. The correct fix is the client-only demo boundary in Task 5 (below): keep ALL component code out of every server-evaluated module instead of restructuring the library. `packages/react` sources stay exactly as they are.

Root cause (verified, not guessed): React 19.3.0's `react-dom` throws at module-evaluation time when `React.version` is not exactly `19.3.0` (`react-dom-client` IIFE: `if ("19.3.0" !== React.version) throw …version-mismatch`). Next 16's SSR graph resolves `react` to its vendored canary (`19.3.0-canary-cbb046ab-20260731`, confirmed in `next/dist/compiled/react`), so any server-side evaluation of workspace `react-dom` explodes. `packages/react/dist/index.js` is single-file: importing ANY export evaluates the top-level `react-dom` imports in `Toast.tsx` (`createRoot` from `react-dom/client`) and `OverlayPrimitive.tsx` (`createPortal` from `react-dom`). `transpilePackages` was tried and does not help — the poisoning is module evaluation, not transpilation.

Fix principle: portals and roots are inherently client-only (they need `document`), so their `react-dom` imports must be lazy — never evaluated during SSR. On the client the dynamic imports resolve workspace `react-dom` next to workspace `react`: a consistent pair. Rejected alternatives (recorded, do not retry): pinning workspace React to Next's canary (fragile, fights semver, poisons the monorepo); Next config alias hacks (fights the framework, risks Next internals); splitting dist into chunks (does not help `Dialog` itself, which genuinely needs portals).

**Files:**
- Modify: `packages/react/src/components/feedback/Toast.tsx`, `packages/react/src/primitives/OverlayPrimitive.tsx`, plus their tests if timing changes require it
- Test: existing `react` suite (toast/overlay tests updated to async where needed) + `docs:build` against the fresh dist

**Interfaces:**
- Consumes: Task 4b's externals (dynamic `import('react-dom')` / `import('react-dom/client')` stay external bare imports at runtime — Rollup preserves them; verify in dist)
- Produces for Task 5 resume: a `dist/index.js` with zero top-level `react-dom` imports (verified by grep, not by assumption)

- [ ] **Step 1: Lazy-load `createRoot` in `Toast.tsx`**

Replace the top-level value import with a type-only import (erased at compile, SSR-safe) and load the module inside the already client-only `flush()` path:

```ts
import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import type { Root } from 'react-dom/client'
```

```ts
let root: Root | null = null

async function ensureRoot(): Promise<Root> {
  if (!root) {
    const { createRoot } = await import('react-dom/client')
    const div = document.createElement('div')
    div.id = 'xerena-toast-stack'
    document.body.appendChild(div)
    root = createRoot(div)
  }
  return root
}

function flush() {
  void ensureRoot().then((r) =>
    r.render(
      <div data-xerena-theme={mode} style={...}>
        ...
      </div>,
    ),
  )
}
```

Keep the `Toast` component, `TOAST_STACK`, `setToastThemeMode`, and `toast()` shapes identical; only the root acquisition goes async (fire-and-forget — callers already treat `toast()` as sync-void).

- [ ] **Step 2: Lazy-load `createPortal` in `OverlayPrimitive.tsx`**

```tsx
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode, ReactPortal } from 'react'
import { useDismissable, useFocusTrap } from '../hooks'
import { useThemeMode } from './ThemeContext'

type PortalFn = (children: ReactNode, container: Element) => ReactPortal

export function OverlayPrimitive({ open, onClose, labeledBy, focusTrap = false, onOutside, children }: OverlayPrimitiveProps) {
  const trapRef = useFocusTrap(open && focusTrap)
  const dismissRef = useDismissable(open, onClose, onOutside ?? onClose)
  const mode = useThemeMode()
  const mergedRef = useMemo(...unchanged...)
  const [portal, setPortal] = useState<PortalFn | null>(null)
  useEffect(() => {
    let live = true
    void import('react-dom').then((m) => {
      if (live) setPortal(() => m.createPortal)
    })
    return () => {
      live = false
    }
  }, [])
  if (!open || !portal) return null
  return portal(<div ...unchanged>...</div>, document.body)
}
```

`document.body` is only reached after `portal` is set, which only happens client-side post-mount — SSR renders `null`. First verify `useFocusTrap`/`useDismissable` touch `document` only inside effects/handlers (never during render); if either touches it during render, guard that too and record it.

- [ ] **Step 3: Update affected tests and run the react gates**

Existing toast/overlay tests may assert synchronous rendering — update them to await (`findBy*` / `waitFor`) where timing changed. No test may be deleted to make the gate pass; weakened assertions must be flagged in the report.

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run react:build --skip-nx-cache && grep -nE "^import.*react-dom|^import.*from \"react-dom" packages/react/dist/index.js; echo "exit=$? (1 = no top-level react-dom import = good)" && pnpm exec nx run-many -t test typecheck lint --projects=react --skip-nx-cache
```

Expected: grep finds nothing, all gates green.

- [ ] **Step 4: Prove the docs graph is clean, then commit (separate, reviewable)**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run docs:build --skip-nx-cache
```

Expected: build progresses PAST the old `error #527` (it may still fail later on Task 5's unfinished content — report exactly how far it gets, do not fix other failures here).

```bash
cd /home/ubuntu/xerena-ui && git add packages/react/src .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "fix(react): lazy-load react-dom for SSR-safe overlays and toasts"
```

This commit changes published component sources and MUST be reviewer-approved before Task 5 resumes.

---

### Task 5: Port guides + 3 pilot component pages

Ports, in order: the five guide pages (`getting-started`, `theming`, `motion`, `styling`, `native`) plus root `brand.md` — six `.mdx` files total — then Button, Select, Dialog with live previews. Source of truth for each page is its counterpart under `apps/docs/content-legacy/` (`content-legacy/guide/<name>.md`, `content-legacy/brand.md`). (`content-legacy/index.md` is archived but not ported — the new `content/docs/index.mdx` placeholder replaces it.)

**Files:**
- Create: `apps/docs/content/docs/guide/*.mdx`, `apps/docs/content/docs/brand.mdx`, `apps/docs/content/docs/**/meta.json` as needed, `apps/docs/content/docs/components/actions/button.mdx`, `apps/docs/content/docs/components/form/select.mdx`, `apps/docs/content/docs/components/feedback/dialog.mdx`, plus `_button-demo.tsx`, `_select-demo.tsx`, and `_dialog-demo.tsx` client components next to their pages
- Modify: `apps/docs/content/docs/meta.json` (add sections)
- Test: manual render verification + `docs:build` (MDX is type-checked at build)

**Interfaces:**
- Consumes: Task 4 shell (global `Preview` registration, `Callout` from fumadocs-ui, `meta.json` pattern). MDX pages import components from `@xerena/react` directly (e.g. `import { Button } from '@xerena/react'`).
- Produces: the proven port pattern the scale phase copies (record the exact per-page recipe in the ledger)

Rules for every ported page (no exceptions):
- **Client-only demo boundary (load-bearing):** every demo is loaded exclusively on the client via `next/dynamic` with `ssr: false`. Rationale (proven by probes): Next 16 resolves `react` to its vendored canary in server-evaluated modules while `react-dom` resolves to the workspace stable copy, and stable `react-dom` throws error #527 at module evaluation when paired with a non-exact `react`. Any static import of component code — in an MDX page, a `_demo` file, `mdx-components.tsx`, or anything the search route's `.source/server` graph touches — poisons both page prerender AND search-index collection. `dynamic(ssr:false)` keeps every component module out of all server graphs; the client bundle then pairs workspace stable `react` + `react-dom` consistently.
- `<Preview>` lives INSIDE the `'_*-demo.tsx'` files, never in MDX: each demo renders `<Preview title="..." code="...">…actual example…</Preview>`. Consequences: (a) `mdx-components.tsx` must NOT map `Preview` (remove it — keep `defaultComponents` only), so no server module imports `@xerena/preview`; (b) the remark plugin cannot fire on our pilots (it only processes `.mdx`) — the explicit `code` prop is the mechanism here, and the plugin stays unit-tested + shipped for consumers.
- `::: tip … :::` containers become `<Callout>…</Callout>`; keep the "React Native" notes that Phase 6 added.
- API tables are copied verbatim (MDX is a superset of Markdown).
- Every `'_*-demo.tsx'` file starts with `'use client'`. MDX pages stay server components and contain no component JSX — only `dynamic()` calls and prose.
- Pilot coverage: Button = `_button-demo.tsx` (variants/sizes); Select = `_select-demo.tsx` (open/select/close); Dialog = `_dialog-demo.tsx` (open/dismiss). Each demo owns its `<Preview>` wrapper with an explicit reader-facing `code` prop.

MDX pattern per demo (exact shape):
```mdx
import dynamic from 'next/dynamic'

const ButtonDemo = dynamic(() => import('./_button-demo').then((m) => m.ButtonDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})

<ButtonDemo />
```

The `loading` fallback is plain server-safe JSX (no hooks, no component imports).

- [ ] **Step 1: Port the five guide pages plus brand**

Convert each `content-legacy/guide/<name>.md` (`getting-started`, `theming`, `motion`, `styling`, `native`) and `content-legacy/brand.md` to `content/docs/guide/<name>.mdx` + `content/docs/brand.mdx`, applying the `Callout` rule. Keep headings, tables, and notes byte-identical otherwise.

- [ ] **Step 2: Write the Button pilot**

`content/docs/components/actions/_button-demo.tsx` (starts with `'use client'`):

```tsx
'use client'

import { Button } from '@xerena/react'
import { Preview } from '@xerena/preview'

export function ButtonDemo() {
  return (
    <Preview title="Primary button" code='<Button variant="primary" size="md">Save</Button>'>
      <Button variant="primary" size="md">Save</Button>
    </Preview>
  )
}
```

Note the explicit `code` prop: it shows the example source a reader would write, not the demo wrapper. `content/docs/components/actions/button.mdx` ports the legacy API table and prose, then loads the demo client-only:

```mdx
import dynamic from 'next/dynamic'

const ButtonDemo = dynamic(() => import('./_button-demo').then((m) => m.ButtonDemo), {
  ssr: false,
  loading: () => <p>Loading preview…</p>,
})

<ButtonDemo />
```

Render-verify with `pnpm exec nx run docs:dev` at `http://localhost:3000/xerena-ui` (the dev server serves under the `basePath`) and confirm the code panel shows the exact authored source.

- [ ] **Step 3: Write the Select and Dialog pilots with client demos**

`_select-demo.tsx` and `_dialog-demo.tsx` (each starting with `'use client'`). Each file renders its own `<Preview title="..." code="...">` wrapper around the example (same shape as the Button demo — the page never contains `<Preview>` directly). Compose the exact web APIs — `Dialog` is a compound object (`Dialog.Root`, `Dialog.Content`, `Dialog.Close`, `Dialog.Title`, `Dialog.Description`, plus `Portal`/`Overlay`; see `packages/react/src/components/feedback/Dialog.tsx:36`), and `Select` is a native-`<select>` wrapper whose props extend `React.SelectHTMLAttributes<HTMLSelectElement>` with an added `error?: boolean` (see `packages/react/src/components/form/Select.tsx`). Each demo must exercise the component's core interaction (Select: open the list, pick an option, close; Dialog: open, dismiss via close control). Their pages load them via the `dynamic(ssr:false)` pattern. Risk to note in the ledger: colocated `_<name>-demo.tsx` files sit inside `content/docs/` — confirm the fumadocs loader ignores non-MDX files (the `docs:build` gate in Step 4 proves it; if it does not, move the demos to `app/` and import by path).

- [ ] **Step 0: Remove `Preview` from the server MDX map (prerequisite fix)**

`apps/docs/mdx-components.tsx` currently imports `Preview` from `@xerena/preview`, which pulls `@xerena/react` → `react-dom` into every server-evaluated module (verified: `fumadocs-ui/mdx`'s own graph is clean — zero `react-dom` imports in its entry, components, `ui/*`, or `utils/*` — ours is the sole poison). Delete the `Preview` import and its mapping line, keeping `defaultMdxComponents` and the function shape. Commit alone:

```bash
cd /home/ubuntu/xerena-ui && git add apps/docs/mdx-components.tsx && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "fix(docs): drop Preview from server MDX map (client demos own it)"
```

- [ ] **Step 4: Prove the plugin fires in the real pipeline, then update `meta.json` files and build**

The plugin's transform is proven by Task 3's unit tests over real parsed ASTs. What remains is proving REGISTRATION — that fumadocs-mdx actually runs `previewCodePlugin` during compilation. An end-to-end render proof is impossible here by construction: rendering an MDX-inline `<Preview>` requires resolving it, and any server module importing `@xerena/preview` re-poisons the graph (see Step 0). So prove injection at the compilation layer instead.

Create a temporary `content/docs/__spike.mdx`:

```mdx
---
title: Spike (temporary)
---

<Preview title="Inline spike">
  <button type="button">Plain</button>
</Preview>
```

Run `pnpm exec nx run docs:build` (it is EXPECTED to fail prerender with `Expected component 'Preview' to be defined` — that failure itself confirms the page compiled; do not fix it). Then assert the fumadocs-mdx compiler output contains the injection: grep the generated `.source/` tree for the exact string `code="<button type="button">Plain</button>"` (or its escaped equivalent) inside the `__spike` compiled output. That string can only exist if `previewCodePlugin` ran. Then delete `content/docs/__spike.mdx` and remove any `__spike` meta entry — neither may ship, and the final green build below must show no `__spike` residue.

Add the new sections/pages to the relevant `meta.json` files, then:

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run docs:build --skip-nx-cache
```

Expected: exit 0, all new routes present under `apps/docs/out/`, no `__spike` residue.

- [ ] **Step 5: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add apps/docs/content .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "docs: port guides and Button/Select/Dialog pilots with live previews"
```

- [ ] **Step 6: Delete the VitePress toolchain (only after the Step 4 gate passed)**

```bash
cd /home/ubuntu/xerena-ui/apps/docs && rm -rf .vitepress && cd /home/ubuntu/xerena-ui && git add -A apps/docs/.vitepress .gitignore && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "chore(docs): remove VitePress toolchain after fumadocs pilots verified"
```

This step exists because the spec requires VitePress sources to be removed only once the replacement is proven — the passing `docs:build` in Step 4 is that proof. Do not run it if Step 4 failed. Also delete the now-dead root `.gitignore` lines `apps/docs/.vitepress/dist/` and `apps/docs/.vitepress/cache/` in the same commit.

---

### Task 6: Manual deploy workflow

**Files:**
- Create: `.github/workflows/docs.yml`
- Test: actionlint on `.github/workflows/docs.yml` (validates the workflow file parses and its actions exist). Use the official upstream binary (rhysd/actionlint release for linux/amd64, run from /tmp — do NOT commit it): the npm `actionlint` package ships no `bin` entry, so the bare `npx -y actionlint` command fails with `could not determine executable to run`.

**Interfaces:**
- Consumes: Task 4 (`docs:build` emitting `apps/docs/out/`)
- Produces: a manual-only Pages deploy. Never dispatch it in this plan.

- [ ] **Step 1: Write `.github/workflows/docs.yml`**

```yaml
name: Docs

on:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: docs-pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10.0.0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec nx run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/docs/out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Note for the ledger (not the workflow): the repository's Pages settings must point at GitHub Actions, and the site will serve under `/xerena-ui` per `basePath`. That is a manual user action outside this repo — do not attempt it from here.

- [ ] **Step 2: Validate and commit**

```bash
cd /home/ubuntu/xerena-ui && /tmp/opencode/actionlint-bin/actionlint .github/workflows/docs.yml && git add .github/workflows/docs.yml .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "ci(docs): manual GitHub Pages deploy workflow for the static docs site"
```

Expected: actionlint exits 0. If `/tmp/opencode/actionlint-bin/actionlint` does not exist, download rhysd/actionlint v1.7.12 linux/amd64 there first (outside the repo). Do not dispatch the workflow.

---

### Task 7: Release preparation (no publish)

**Files:**
- Create: `.changeset/preview-minor.md`
- Modify: none (no version edits by hand)

**Interfaces:**
- Consumes: Tasks 2–3 (built, tested, reviewed package)
- Produces: a publish-ready changeset. The actual publish is a separate release step and is NOT part of this plan.

- [ ] **Step 1: Write the changeset**

`.changeset/preview-minor.md`:
```md
---
"@xerena/preview": minor
---

Publish the public preview package: live `Preview` surface with auto-captured source, local light/dark toggle, and the `@xerena/preview/mdx` source-capture plugin.
```

- [ ] **Step 2: Verify release state without publishing**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec changeset status && grep '"version"' packages/preview/package.json
```

Expected: changeset status lists `@xerena/preview` as a pending minor release; `packages/preview/package.json` still reads `"version": "0.0.0"` (the release step bumps it to `0.1.0`).

- [ ] **Step 3: Prove a clean consumer install (pack smoke test)**

The docs app consumes the package via workspace link, which hides packaging mistakes (missing `files`, broken export map, forgotten CSS). Prove the published artifact installs cleanly:

```bash
mkdir -p /tmp/opencode/preview-pack && cd /home/ubuntu/xerena-ui/packages/preview && pnpm exec nx run preview:build --skip-nx-cache && npm pack --pack-destination /tmp/opencode/preview-pack && mkdir -p /tmp/opencode/preview-consumer && cd /tmp/opencode/preview-consumer && pnpm init -y >/dev/null && pnpm add /tmp/opencode/preview-pack/xerena-preview-0.0.0.tgz react@19.3.0 react-dom@19.3.0 && node -e "const p=require('./node_modules/@xerena/preview/package.json'); for (const k of ['./mdx','./styles.css']) if (!p.exports[k]) throw new Error('missing export '+k); require('fs').accessSync('./node_modules/@xerena/preview/dist/index.js'); require('fs').accessSync('./node_modules/@xerena/preview/dist/mdx.js'); require('fs').accessSync('./node_modules/@xerena/preview/dist/styles.css'); console.log('pack smoke OK')"
```

(`mkdir -p` the pack destination first — `npm pack --pack-destination` errors with ENOENT when the dir does not exist.)

Expected: `pack smoke OK`. This does not install `@xerena/react` (a peer) — the check is packaging shape only, not rendering. Afterwards `rm -rf /tmp/opencode/preview-pack /tmp/opencode/preview-consumer`.

- [ ] **Step 4: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add .changeset/preview-minor.md .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git add -f .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "chore: changeset for @xerena/preview 0.1.0 release"
```

---

## Out of This Plan (explicitly deferred)

- Porting the remaining 39 component pages → separate phase, using the Task 5 recipe.
- Deleting `apps/docs/content-legacy/` → happens in that scale phase, after the last page is ported and verified (this honors spec Decision 8: VitePress content is only deleted once its replacement is proven).
- Running `pnpm release` / publishing `@xerena/preview` → separate release step with explicit user consent.
- Dispatching the docs deploy workflow → manual, user-triggered, later.
- Component registry → future phase.
