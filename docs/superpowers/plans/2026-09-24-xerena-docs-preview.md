# @xerena/preview + fumadocs Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public `@xerena/preview` package (live React preview surface with auto-captured source and a local light/dark toggle) and rebuild `apps/docs` on Next.js + fumadocs as a statically-exported site with 3 pilot component pages, without deploying anything.

**Architecture:** `packages/preview` is a new workspace library mirroring `@xerena/react`'s build/test layout; it ships a React core entry plus an `@xerena/preview/mdx` remark-plugin entry with zero runtime dependencies. `apps/docs` is rebuilt in place (VitePress toolchain removed, legacy `.md` content archived to `content-legacy/` for the later port phase), targeting `output: 'export'` with Orama search in static mode.

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
- `dist/`, `lib/`, `node_modules/`, `.superpowers/` are gitignored — never commit them.
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
  vite.config.ts          lib entries index + mdx, dts rollupTypes, cssCodeSplit false
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
  app/layout.tsx          RootProvider with static search + global CSS imports
  app/global.css          tailwind import, fumadocs css, token mapping
  app/page.tsx            minimal landing linking to /docs
  app/docs/[[...slug]]/page.tsx   docs route with generateStaticParams
  app/api/search/route.ts         staticGET search index
  lib/source.ts           loader
  mdx-components.tsx      global MDX components (Preview, Callout, Card)
  content/docs/**/meta.json       file-based navigation
  content/docs/guide/*.mdx        ported guides
  content/docs/components/*/*.mdx 3 pilot pages
  content-legacy/         archived VitePress .md tree (port source for the later phase)
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

Throwaway probe. Nothing in this task may touch the repo. If any check fails, stop, record the blocker in the ledger, and do not proceed to Task 2.

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

Create exactly: `next.config.mjs` (withMDX wrapper + `output: 'export'`), `source.config.ts` (`defineDocs({ dir: 'content/docs' })`), `postcss.config.mjs`, `tsconfig.json` (Next defaults), `app/layout.tsx` (RootProvider with static search), `app/page.tsx`, `app/docs/[[...slug]]/page.tsx` (with `generateStaticParams`), `app/api/search/route.ts` (`staticGET`), `content/docs/index.mdx` (one page with a `'use client'` component imported and rendered inline).

- [ ] **Step 4: Build and assert static output**

```bash
cd /tmp/opencode/docs-spike && pnpm exec next build
```

Expected: exit 0. Assert all three: `out/index.html` exists, a static search payload file exists under `out/` (find any `*search*.json`), and the client component's marker text appears in the built HTML for the docs page.

- [ ] **Step 5: Record the verdict in the ledger**

Append to `.superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md`: exact locked versions from the scratch lockfile, the confirmed config keys, and either PASS (proceed) or the precise failure (stop).

- [ ] **Step 6: Delete the scratch directory**

```bash
rm -rf /tmp/opencode/docs-spike
```

Expected: `/tmp/opencode/docs-spike` no longer exists; `git status --short` in the repo shows only the new ledger file.

- [ ] **Step 7: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "chore(docs): stack verification notes for fumadocs static export"
```

---

### Task 2: `packages/preview` scaffold + `<Preview>` component

**Files:**
- Create: `packages/preview/package.json`, `packages/preview/project.json`, `packages/preview/tsconfig.json`, `packages/preview/vite.config.ts`, `packages/preview/vitest.setup.ts`, `packages/preview/eslint.config.js`, `packages/preview/scripts/copy-css.mjs`, `packages/preview/src/index.ts`, `packages/preview/src/Preview.tsx`, `packages/preview/src/theme.ts`, `packages/preview/src/styles.css`, `packages/preview/src/Preview.test.tsx`
- Modify: root `package.json` (add `preview` to `test`, `lint`, `typecheck` `--projects` lists)

**Interfaces:**
- Consumes: `@xerena/react` `Provider` + `XTheme` (`{ mode: 'light' | 'dark'; semantic?: Partial<Record<SemanticAlias, string>> }`); `Provider` renders children inside `<div data-xerena-theme={mode}>` — tests assert against that attribute
- Produces for Task 3: nothing (independent); for Task 4: `Preview` + `PreviewProps` from `@xerena/preview`, `styles.css` path `@xerena/preview/styles.css`
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

Mirror `packages/react` exactly, with these deliberate differences:
- `project.json` `test` target gets `"dependsOn": ["^build"]` because vitest resolves `@xerena/react` to its `dist` at runtime (same reason `react-native` test/typecheck depend on `^build`).
- `vite.config.ts` lib entry is an object: `{ index: resolve(..., 'src/index.ts'), mdx: resolve(..., 'src/mdx.ts') }` with `fileName: (format, entryName) => entryName === 'index' ? (format === 'es' ? 'index.js' : 'index.cjs') : \`${entryName}.${format === 'es' ? 'js' : 'cjs'}\``, `external: ['react', 'react-dom', '@xerena/react', '@xerena/tokens', '@xerena/styling']`.
- `vitest.setup.ts` contains only `import '@testing-library/jest-dom/vitest'` (no matchMedia shim — nothing here touches it).
- `eslint.config.js` extends `@xerena/eslint-config` and blocks `@xerena/native`, `react-native`, and `tailwindcss` via `no-restricted-imports`.
- `scripts/copy-css.mjs` copies `src/styles.css` → `dist/styles.css` (plain copy; the file is hand-written, no build-time processing).

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
```

- [ ] **Step 4: Run the test to verify it fails**

```bash
cd /home/ubuntu/xerena-ui/packages/preview && pnpm exec vitest run src/Preview.test.tsx
```

Expected: FAIL with "Failed to resolve import './Preview'".

- [ ] **Step 5: Write `src/theme.ts`**

```ts
import type { XTheme } from '@xerena/react'

export type PreviewMode = 'light' | 'dark'

export function previewTheme(mode: PreviewMode): XTheme {
  return { mode }
}
```

- [ ] **Step 6: Write `src/Preview.tsx`**

```tsx
'use client'

import { useState, type ReactNode } from 'react'
import { Provider } from '@xerena/react'
import { previewTheme, type PreviewMode } from './theme'

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
        <Provider theme={previewTheme(mode)}>{children}</Provider>
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

Plain `pnpm install` (not `--frozen-lockfile`) because the new workspace package requires a lockfile update. Expected: 5/5 tests pass, typecheck and lint clean. The `test` target's `dependsOn: ["^build"]` builds `@xerena/react` dist first because vitest resolves it at runtime.

- [ ] **Step 9: Build the package**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run preview:build --skip-nx-cache
```

Expected: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/styles.css` exist.

- [ ] **Step 10: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add packages/preview package.json pnpm-lock.yaml .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "feat(preview): public @xerena/preview package with live Preview surface"
```

---

### Task 3: MDX source-capture plugin

**Files:**
- Create: `packages/preview/src/mdx.ts`, `packages/preview/src/mdx.test.ts`
- Modify: `packages/preview/src/index.ts` (no — keep the plugin OUT of the React entry so the core stays MDX-free)
- Test: `packages/preview/src/mdx.test.ts`

**Interfaces:**
- Consumes: nothing from Task 2 (independent file). Test harness: `unified@11.0.5` + `remark-parse@11.0.0` + `remark-mdx@3.1.1` as devDependencies
- Produces for Task 4: `previewCodePlugin` factory, importable as `@xerena/preview/mdx`, registered via fumadocs-mdx `mdxOptions.remarkPlugins`. Behaviour contract: `<Preview>` flow elements without an explicit `code` attribute gain one containing the exact authored children source; everything else is byte-identical

- [ ] **Step 1: Add the test-only parser dependencies**

```bash
cd /home/ubuntu/xerena-ui/packages/preview && pnpm add -D unified@11.0.5 remark-parse@11.0.0 remark-mdx@3.1.1
```

These are dev-only; the plugin itself has zero runtime dependencies. Commit the lockfile change with the task.

- [ ] **Step 2: Write the failing test `src/mdx.test.ts`**

```tsx
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
        const attributes = Array.isArray(element.attributes) ? element.attributes : []
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

- [ ] **Step 5: Run tests, typecheck, lint, build**

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run-many -t test typecheck lint build --projects=preview --skip-nx-cache
```

Expected: all green, `dist/mdx.js`, `dist/mdx.cjs`, `dist/mdx.d.ts` exist.

- [ ] **Step 6: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add packages/preview pnpm-lock.yaml .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "feat(preview): MDX source-capture plugin with explicit-code escape hatch"
```

---

### Task 4: Docs scaffold (Next.js + fumadocs, static export)

This task replaces the VitePress toolchain in `apps/docs`. Legacy `.md` content is archived to `content-legacy/` (outside the fumadocs collections dir, so the compiler never sees it) and stays there as port source for the later scale phase. `public/mark.svg` stays in place. Use the exact versions locked in Task 1; if Task 1 recorded different versions, those win and the ledger must say so.

**Files:**
- Create: `apps/docs/next.config.mjs`, `apps/docs/source.config.ts`, `apps/docs/postcss.config.mjs`, `apps/docs/tsconfig.json`, `apps/docs/eslint.config.js`, `apps/docs/app/layout.tsx`, `apps/docs/app/global.css`, `apps/docs/app/page.tsx`, `apps/docs/app/docs/[[...slug]]/page.tsx`, `apps/docs/app/api/search/route.ts`, `apps/docs/lib/source.ts`, `apps/docs/mdx-components.tsx`, `apps/docs/content/docs/meta.json`, `apps/docs/content/docs/index.mdx`
- Modify: `apps/docs/package.json`, `apps/docs/project.json`, root `.gitignore`
- Move: `apps/docs/guide/**` + `apps/docs/brand.md` → `apps/docs/content-legacy/` (git mv, history preserved)
- Delete: `apps/docs/.vitepress/` (config only — `dist/` and `cache/` are gitignored build output)

**Interfaces:**
- Consumes: `Preview` from `@xerena/preview` (Task 2), `@xerena/preview/styles.css`, `@xerena/react/styles.css`, `previewCodePlugin` from `@xerena/preview/mdx` (Task 3)
- Produces for Task 5: working `docs:build` emitting a static site, global `Preview` registration in MDX, `meta.json` navigation pattern to copy

- [ ] **Step 1: Install the docs dependencies**

```bash
cd /home/ubuntu/xerena-ui/apps/docs && pnpm add next@16.3.6 react@19.3.0 react-dom@19.3.0 fumadocs-core@16.15.14 fumadocs-ui@16.15.14 fumadocs-mdx@15.4.4 tailwindcss@4.3.3 @tailwindcss/postcss@^4 @xerena/react@workspace:* @xerena/preview@workspace:* @xerena/tokens@workspace:* && pnpm add -D typescript@^5.6.0 @types/react @types/react-dom @types/mdx eslint@^9 @xerena/eslint-config@workspace:*
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

`app/layout.tsx`:
```tsx
import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/root-provider'
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

The docs page follows the standard fumadocs pattern (`source.getPage`, `notFound()`, `DocsPage`/`DocsTitle`/`DocsDescription`/`DocsBody`, `generateStaticParams` returning `source.generateParams()`). The search route:

```ts
import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

export const revalidate = false
export const { staticGET: GET } = createFromSource(source)
```

`content/docs/index.mdx` is a one-paragraph placeholder welcome page (real landing content ships with the port phase).

- [ ] **Step 6: Archive legacy content and remove VitePress**

```bash
cd /home/ubuntu/xerena-ui/apps/docs && mkdir -p content-legacy && git mv guide content-legacy/guide && git mv brand.md content-legacy/brand.md && rm -rf .vitepress
```

Expected: `content/docs/` contains only the new `index.mdx` + `meta.json`; `content-legacy/` holds the full old tree; no `.vitepress/` directory remains.

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

Plain `pnpm install` (not `--frozen-lockfile`) because the rewritten dependencies require a lockfile update. Expected: exit 0, `apps/docs/out/index.html` exists, a static search payload exists under `out/`.

- [ ] **Step 8: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add apps/docs package.json pnpm-lock.yaml .gitignore .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "feat(docs): rebuild docs app on Next.js + fumadocs with static export"
```

---

### Task 5: Port guides + 3 pilot component pages

Ports, in order: all six guide pages (`getting-started`, `theming`, `motion`, `styling`, `native`, `brand`), then Button, Select, Dialog with live previews. Source of truth for each page is its counterpart under `apps/docs/content-legacy/`.

**Files:**
- Create: `content/docs/guide/*.mdx`, `content/docs/brand.mdx`, `content/docs/**/meta.json` as needed, `content/docs/components/actions/button.mdx`, `content/docs/components/form/select.mdx`, `content/docs/components/feedback/dialog.mdx`, plus `_select-demo.tsx` and `_dialog-demo.tsx` client components next to their pages
- Modify: `content/docs/meta.json` (add sections)
- Test: manual render verification + `docs:build` (MDX is type-checked at build)

**Interfaces:**
- Consumes: Task 4 shell (global `Preview` registration, `Callout` from fumadocs-ui, `meta.json` pattern). MDX pages import components from `@xerena/react` directly (e.g. `import { Button } from '@xerena/react'`).
- Produces: the proven port pattern the scale phase copies (record the exact per-page recipe in the ledger)

Rules for every ported page (no exceptions):
- Interactive examples go through `<Preview title="...">…</Preview>`; no example is duplicated as a static fence — the plugin supplies the code panel.
- `::: tip … :::` containers become `<Callout>…</Callout>`; keep the "React Native" notes that Phase 6 added.
- API tables are copied verbatim (MDX is a superset of Markdown).
- Stateful examples (anything needing `useState` or event-handler props) live in a `'_*-demo.tsx'` file with `'use client'` at the top, imported by the page. MDX pages themselves stay server components, so inline JSX in the page must not pass function props.
- Pilot coverage: Button = inline stateless example; Select = `_select-demo.tsx` (open/select/close); Dialog = `_dialog-demo.tsx` (open/dismiss).

- [ ] **Step 1: Port the six guide pages**

Convert each `content-legacy/guide/<name>.md` and `content-legacy/brand.md` to `content/docs/guide/<name>.mdx` + `content/docs/brand.mdx`, applying the `Callout` rule. Keep headings, tables, and notes byte-identical otherwise.

- [ ] **Step 2: Write the Button pilot**

`content/docs/components/actions/button.mdx`: port the legacy API table and prose, then:

```mdx
import { Button } from '@xerena/react'

<Preview title="Primary button">
  <Button variant="primary" size="md">Save</Button>
</Preview>
```

No `onClick` (function props cannot cross the server/client boundary inline). Render-verify with `pnpm exec nx run docs:dev` and confirm the code panel shows the exact authored source.

- [ ] **Step 3: Write the Select and Dialog pilots with client demos**

`_select-demo.tsx` and `_dialog-demo.tsx` (each starting with `'use client'`), imported and rendered inside `<Preview>` blocks on their pages. Each demo must exercise the component's core interaction (Select: open the list, pick an option, close; Dialog: open, dismiss via close control).

- [ ] **Step 4: Update `meta.json` files and build**

Add the new sections/pages to the relevant `meta.json` files, then:

```bash
cd /home/ubuntu/xerena-ui && pnpm exec nx run docs:build --skip-nx-cache
```

Expected: exit 0, all new routes present under `apps/docs/out/`.

- [ ] **Step 5: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add apps/docs/content apps/docs/mdx-components.tsx .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "docs: port guides and Button/Select/Dialog pilots with live previews"
```

---

### Task 6: Manual deploy workflow

**Files:**
- Create: `.github/workflows/docs.yml`
- Test: `npx -y actionlint .github/workflows/docs.yml` (repo precedent for workflow validation)

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
cd /home/ubuntu/xerena-ui && npx -y actionlint .github/workflows/docs.yml && git add .github/workflows/docs.yml .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "ci(docs): manual GitHub Pages deploy workflow for the static docs site"
```

Expected: actionlint exits 0. Do not dispatch the workflow.

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

- [ ] **Step 3: Commit**

```bash
cd /home/ubuntu/xerena-ui && git add .changeset/preview-minor.md .superpowers/sdd/2026-09-24-xerena-docs-preview/progress.md && git -c user.name="mixos-go" -c user.email="mixosg0@gmail.com" commit -m "chore: changeset for @xerena/preview 0.1.0 release"
```

---

## Out of This Plan (explicitly deferred)

- Porting the remaining 39 component pages → separate phase, using the Task 5 recipe.
- Deleting `apps/docs/content-legacy/` → happens in that scale phase, after the last page is ported and verified (this honors spec Decision 8: VitePress content is only deleted once its replacement is proven).
- Running `pnpm release` / publishing `@xerena/preview` → separate release step with explicit user consent.
- Dispatching the docs deploy workflow → manual, user-triggered, later.
- Component registry → future phase.
