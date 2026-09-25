# Progress ledger — 2026-09-24 Xerena docs preview

## Task 1: Stack verification spike — PASS (2026-09-25)

Scratch app: `/tmp/opencode/docs-spike` (throwaway, deleted after verification).
Scaffold copied the Task 4 file shapes; build asserted; hook-without-client probe run.

### Locked versions (from scratch pnpm-lock.yaml)

- next 16.3.6
- react 19.3.0, react-dom 19.3.0
- fumadocs-core 16.15.14
- fumadocs-ui 16.15.14
- fumadocs-mdx 15.4.4
- tailwindcss 4.3.3, @tailwindcss/postcss 4.3.3 (resolved from ^4)
- typescript 5.9.3 (resolved from ^5.6.0), @types/react 19.3.0, @types/react-dom 19.3.0, @types/mdx 2.0.14
- Next auto-added @types/node 26.6.2 as a devDependency on first build (Task 4 must expect this lockfile addition or pin @types/node explicitly).
- Scratch ran under pnpm 12.6.0 (corepack default outside the repo); the repo toolchain stays pnpm@10.0.0.

### Confirmed config keys (all present in the installed versions)

- `source.config.ts`: `defineConfig` and `defineDocs` are both exported from `fumadocs-mdx/config`. `mdxOptions.remarkPlugins` accepted the no-op plugin and MDX compiled cleanly.
- `lib/source.ts`: `loader` from `fumadocs-core/source` plus `docs.toFumadocsSource()` works.
- `app/api/search/route.ts`: `createFromSource` from `fumadocs-core/search/server` returns `{ GET, staticGET }`; `export const { staticGET: GET } = createFromSource(source)` works.
- `mdx-components.tsx`: default export `defaultMdxComponents` from `fumadocs-ui/mdx` works.
- Docs page: `DocsPage`, `DocsBody`, `DocsDescription`, `DocsTitle` from `fumadocs-ui/layouts/docs/page`, plus `generateStaticParams` via `source.generateParams()`, all work.
- `RootProvider` accepts `search={{ options: { type: 'static' } }}`. Note: `type: 'static'` on `DefaultSearchDialogProps` is marked `@deprecated` but is present and functional.

### Deviations Task 4 MUST apply (verbatim plan shape fails without them)

1. `app/layout.tsx`: the import path `fumadocs-ui/root-provider` DOES NOT EXIST in fumadocs-ui 16.15.14 (no such package export). Task 4 must use `import { RootProvider } from 'fumadocs-ui/provider/next'`.
2. NEW FILE `app/docs/layout.tsx` is required: `DocsPage` must render under `DocsLayout` from `fumadocs-ui/layouts/docs` (`<DocsLayout tree={source.pageTree}>`). Without it, prerendering `/docs` fails with `Please use <DocsPage /> under <DocsLayout />`. `source.pageTree` is the tree root directly (no i18n).
3. The `Preview` key in `mdx-components.tsx` could not be exercised in the spike (`@xerena/preview` is not built yet); only the insertion shape is confirmed. Task 4 wires the real import.

### Static export assertions (all PASS)

- `pnpm exec next build` exits 0 with `output: 'export'`, `basePath: '/xerena-ui'`, `trailingSlash: true`.
- `out/index.html` exists.
- The static search payload is emitted at `out/api/search` (recorded verbatim: an extensionless file containing the JSON search index). Task 4 must assert exactly this path, not any `*search*.json` name.
- The client component marker `SPIKE_CLIENT_MARKER:0` appears in the built `out/docs/index.html`.

### Hook-without-'use client' probe (fails the build, as expected)

Rendering a `useState` component WITHOUT `'use client'` from MDX fails the build with exit 1:

```text
Error: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
```

The Task 5 authoring rule stands: every interactive example lives in a `'use client'` file; MDX pages stay server components.

### Notes for later tasks

- The search index emitted by fumadocs-core 16.15.14 is zbsearch-based (payload opens with `{"type":"advanced",...}`), not Orama. The plan's "Orama search in static mode" architecture line is stale; the static wiring (`staticGET` plus `type: 'static'`) is unaffected.
- Next 16 rewrites `tsconfig.json` on first build (`jsx` forced to `react-jsx`, plus `lib`, `allowJs`, `noEmit`, `incremental`). Committing the Task 4 tsconfig with `jsx: preserve` is fine; Next adjusts it automatically.
- pnpm 12 in scratch required `allowBuilds: { esbuild: true }` in `pnpm-workspace.yaml` before installs exited 0 ( scratch-only plumbing, deleted with the scratch dir).

### Verdict: PASS — proceed to Task 2.

## Task 2: packages/preview scaffold + Preview component — BLOCKED (2026-09-25)

Steps 1–7 executed verbatim (all 12 Task 2 files written exactly as specified in the plan).
Steps 8–9 gates are red for reasons outside `packages/preview`. Steps 10–11 withheld (see below).
TDD RED verified in Step 4: `vitest run src/Preview.test.tsx` failed with
`Failed to resolve import "./Preview"` (not command-not-found; plain `pnpm install` run first).
All `--xr-*` variables used in `styles.css` verified present in `packages/tokens/dist/tokens.css`.

### Gate tails (all with --skip-nx-cache)

- `preview:test`: 5 passed / 2 failed of 7. Failures: `theme toggle is local to the preview`
  and `works identically under prefers-reduced-motion` — both assert a mode change AFTER mount.
- `preview:typecheck`: PASS.
- `preview:lint`: PASS.
- `preview:build`: FAIL — `Could not resolve entry module "src/mdx.ts"`. No `dist/` emitted.

### Blocker A: @xerena/react Provider drops theme prop updates after mount

`packages/react/src/primitives/Provider.tsx:15-16`:

```tsx
const [stored, setStored] = useState<XTheme>(theme)
const activeTheme = theme.mode === stored.mode ? { ...stored, ...theme } : stored
```

When a parent switches `theme.mode` (light to dark), `stored` is never resynced and the guard
selects the stale `stored` theme, so `<div data-xerena-theme={...}>` never flips. The plan's
`Preview.tsx` drives `Provider` in controlled mode (`theme={previewTheme(mode)}`), which this
`Provider` does not support. Isolated repro (render light, rerender dark, temporary test file
since removed) fails against the freshly built `@xerena/react` dist, whose minified output
contains the same logic (`E.mode === S.mode ? {...S, ...E} : S`). Existing `Provider.test.tsx`
only covers initial mount, which is why this went unnoticed. The `stored` logic dates to
`0b5b77c` (pre-plan), so the plan's assumption was incorrect from the start, not a regression.
Fixing `Provider` is out of Task 2 scope (separate package, published `0.1.0`, needs its own
test + review) — not attempted here.

### Blocker B: vite mdx entry points at a Task 3 file

The verbatim `vite.config.ts` declares lib entry `mdx: src/mdx.ts`, but `src/mdx.ts` is only
created in Task 3. Task 2's Step 9 build therefore cannot succeed as written. Not worked around
(stubbing `mdx.ts` would bleed Task 3 scope; editing the config would violate verbatim rule).

### Withheld steps and why

- Step 10 (root `package.json` scripts gain `preview`): NOT executed. Registering a red project
  would break repo-wide `pnpm test` / `pnpm lint` / `pnpm typecheck` on this branch.
- Step 11 (feat commit): NOT executed. Gates are red; the planned message would misrepresent.
  This ledger entry is committed alone (Task 1 precedent). `packages/preview/` files plus the
  `pnpm-lock.yaml` workspace-link update remain uncommitted in the working tree for inspection.

### Proposed paths (require plan amendment, not executed)

1. Fix `Provider` to follow controlled `theme` prop updates (own test in `packages/react`,
   own commit), then re-run Task 2 Step 8.
2. Alternatively amend the plan if uncontrolled-with-remount semantics are intended.
3. For Blocker B: either move the dual-entry `vite.config.ts` to Task 3 or accept a Task 3
   dependency for the Task 2 build gate.

## Task 2 resumed under amended plan — STILL BLOCKED (2026-09-25)

Amendment `f82438a` applied as instructed, tests left unmodified:

- `src/Preview.tsx`: added the `ModeSync` inner component verbatim (drives the switch through
  the context `setTheme` API); nothing else changed.
- `vite.config.ts`: removed the `mdx` entry (single `index` entry; `fileName` kept as-is).
- `@xerena/react` untouched. `src/Preview.test.tsx` untouched (7 tests as before).

### Gate tails (all with --skip-nx-cache)

- `preview:test`: HANG — zero tests complete. Direct run
  `timeout -s KILL 60 pnpm exec vitest run src/Preview.test.tsx --reporter=verbose`
  exits 124 (killed) with only the `RUN` banner; no test finishes, including test 1 which
  needs no interaction. Under `nx run-many`, the vitest worker instead dies with
  `FatalProcessOutOfMemory` (`tinypool` channel closed, `ERR_IPC_CHANNEL_CLOSED`).
- `preview:typecheck`: PASS. `preview:lint`: PASS (both with the amended code).
- `preview:build`, Step 10, Step 11: NOT executed (test gate red; same withholding rationale
  as before — no root script registration, no feat commit).

### Root cause: amended ModeSync creates an infinite render loop

Traced from `packages/react/src/primitives/Provider.tsx` (read, not guessed):

1. `ModeSync` effect calls `setTheme(previewTheme(mode))`, i.e. `setStored(newObject)`.
2. Provider re-renders; `activeTheme = {...stored, ...theme}` is a fresh object every render.
3. `value = useMemo(..., [activeTheme])` therefore recomputes every render, producing a new
   `setTheme` identity every render.
4. `ModeSync` subscribes to the context, re-renders on each new `value`, and its effect deps
   `[mode, setTheme]` change every time (`setTheme` identity) — so the effect re-fires and
   calls `setStored(newObject)` again. Loop back to 2, unbounded: hang in isolation, worker
   OOM under nx's parallel load.

The `setTheme` identity instability is inside the published `Provider`, which this task must
not touch — so no in-scope fix exists and none was attempted. The 7 tests were already RED-verified
against the missing-module failure last session; they remain the correct GREEN criterion once
the loop source is resolved by a further plan amendment.

Working tree state: `packages/preview/` (12 files, amended) untracked, `pnpm-lock.yaml`
workspace-link update modified, root `package.json` untouched. This entry committed alone.

## Task 2 completed — PASS (2026-09-25)

Applied amendment `4279d46` (guarded `ModeSync`): reads both `theme` and `setTheme` from
`useTheme()`, holds `setTheme` in a ref, and only syncs when `theme.mode !== mode` with deps
`[mode, theme.mode]`. All other WIP files byte-identical; tests unmodified.

### Gate tails (all with --skip-nx-cache)

- `nx run-many -t test typecheck lint --projects=preview`: green.
  `preview:test`: 7/7 pass (incl. both toggle tests and the reduced-motion test), 320 ms.
- `nx run preview:build`: green. `dist/` contains exactly `index.js`, `index.cjs`,
  `index.d.ts`, `styles.css`; no `dist/mdx.*` (ships with Task 3).
- Step 10: root `package.json` `test`/`lint`/`typecheck` scripts now list
  `tokens,react,react-native,brand,styling,preview` (verified via node).
- TDD record: RED (`Failed to resolve import "./Preview"`) verified before implementation;
  intermediate 5/7 (controlled-prop drop) and hang (unguarded setTheme loop) failures
  documented above; final GREEN is 7/7 unmodified tests.

Committed per Step 11 as `feat(preview): public @xerena/preview package with live Preview surface`.

## Task 3 completed — PASS (2026-09-25)

MDX source-capture plugin (`previewCodePlugin`) with explicit-code escape hatch.

### Gate tails (all with --skip-nx-cache)

- `nx run-many -t test typecheck lint build --projects=preview`: green.
  `preview:test`: 12/12 pass (7 Preview + 5 mdx), 3.44 s.
  `preview:typecheck`: clean. `preview:lint`: clean. `preview:build`: green.
- `dist/` contains `mdx.js`, `mdx.cjs`, `mdx.d.ts` alongside the index outputs
  (`index.js`, `index.cjs`, `index.d.ts`) and `styles.css`.
- TDD record: RED (`Failed to resolve import "./mdx"`) verified before implementation;
  final GREEN is 5/5 unmodified plugin tests.
- `src/index.ts` untouched: the plugin stays out of the React entry and ships only
  through the `./mdx` export map.

### Notes

- The plugin lives at `src/mdx.ts` (the spec file map says `src/mdx-entry.ts` — the
  shorter name won because the export map already namespaces it as `@xerena/preview/mdx`).
- Known limitation (by design): inline `<Preview>` inside a paragraph
  (`mdxJsxTextElement`) is not handled — previews are block-level only.
- Plan amendment applied during this task: the `attributes` local in `visit` is
  annotated `MdxJsxAttribute[]`, consuming the structural interface so lint
  (`no-unused-vars`) passes. No other change versus the specified source.

Committed per Step 6 as `feat(preview): MDX source-capture plugin with explicit-code escape hatch`.

## Task 4 completed — PASS (2026-09-25)

Docs scaffold: Next.js 16 + fumadocs static export. All 8 steps executed in order.

### Step 1: deps (exact, verified)

Installed per plan; `apps/docs/package.json` now lists
`next@16.3.6 react@19.3.0 react-dom@19.3.0 fumadocs-core@16.15.14
fumadocs-ui@16.15.14 fumadocs-mdx@15.4.4 tailwindcss@4.3.3
@tailwindcss/postcss@^4 @xerena/react@workspace:* @xerena/preview@workspace:*`
plus dev `typescript@^5.6.0 @types/react @types/react-dom @types/mdx
@types/node@26.6.2 eslint@^9 @xerena/eslint-config@workspace:*`.
`@xerena/tokens` deliberately absent (token values arrive at runtime via
`@xerena/react/styles.css`). `@types/node` pinned at 26.6.2 per Task 1.
Peer warnings (harmless, recorded): `fumadocs-mdx` wants vite `7.x || 8.x`
but the repo root resolves vite 5.4.21; legacy `vitepress` wants react
`<19` while the app now uses react 19.3.0 (vitepress toolchain dies in
Task 5 Step 6).

### Steps 2-5: files written

- `next.config.mjs`: verbatim (`output: 'export'`, `basePath: '/xerena-ui'`,
  `trailingSlash: true`, `withMDX` wrapper).
- `source.config.ts`: verbatim (`defineDocs`/`defineConfig` from
  `fumadocs-mdx/config`, `previewCodePlugin` in `mdxOptions.remarkPlugins`).
  No Task 1 deviation needed: the `fumadocs-mdx/config` shape is present in
  the installed version.
- `postcss.config.mjs`: verbatim. `tsconfig.json`: verbatim (`jsx: preserve`).
- `lib/source.ts`, `app/layout.tsx` (`fumadocs-ui/provider/next`
  RootProvider per Task 1 deviation 1), `mdx-components.tsx` (Preview
  registered), `app/docs/layout.tsx` (DocsLayout per deviation 2),
  `app/docs/[[...slug]]/page.tsx`, `app/api/search/route.ts`: all verbatim.
- Specified-shape files the plan leaves to the executor (recorded here):
  `eslint.config.js` is the shared-base shape (`import base from
  '@xerena/eslint-config'`, spread) plus an ignores block — see deviation 1
  below. `project.json` keeps name `docs`, dev `next dev`, build
  `next build` with outputs `{projectRoot}/out`, typecheck
  `tsc -p tsconfig.json --noEmit`, lint `eslint .`.
  `app/page.tsx` is a minimal landing (`Xerena UI` heading plus
  `<Link href="/docs">Read the docs</Link>`; basePath applied automatically).
  `content/docs/meta.json` is `{"title": "Documentation", "pages": ["index"]}`.
  `content/docs/index.mdx` is a one-paragraph placeholder with
  `title: Welcome` / `description: Xerena UI documentation` frontmatter.

### Token variable table (app/global.css)

fumadocs theme variables live in `fumadocs-ui/css/lib/default-colors.css`
as Tailwind v4 `@theme` tokens (`--color-fd-*`). Overrides are explicit
`:root` rules after the tailwind/neutral/preset imports (unlayered rules win
over the layered `@theme` emission). Light values reference the live
`--xr-*` variables from `@xerena/react/styles.css`; `.dark` values are
literals because the `--xr-*` dark palette is scoped to
`[data-xerena-theme='dark']`, which the docs shell never sets (fumadocs dark
mode uses `.dark`). Hexes verified in `packages/tokens/dist/tokens.css`.

| fumadocs var | xr var | light | dark |
|---|---|---|---|
| --color-fd-background | --xr-semantic-color-background | #faf7f2 | #1b1712 |
| --color-fd-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-muted | --xr-semantic-color-surface | #f4efe6 | #262019 |
| --color-fd-muted-foreground | --xr-semantic-color-textMuted | #9a8f7e | #9a9184 |
| --color-fd-card | --xr-semantic-color-surface | #f4efe6 | #262019 |
| --color-fd-card-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-popover | --xr-semantic-color-background | #faf7f2 | #1b1712 |
| --color-fd-popover-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-border | --xr-semantic-color-border | #f4efe6 | #262019 |
| --color-fd-primary | --xr-semantic-color-primary | #c04e1d | #da854f |
| --color-fd-primary-foreground | --xr-semantic-color-textOnStrong | #faf7f2 | #f0ece3 |
| --color-fd-secondary | --xr-semantic-color-surface | #f4efe6 | #262019 |
| --color-fd-secondary-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-accent | --xr-semantic-color-surfaceHover | #fdf1e9 | #aca496 |
| --color-fd-accent-foreground | --xr-semantic-color-text | #2b2620 | #f0ece3 |
| --color-fd-ring | --xr-semantic-color-borderStrong | #9a8f7e | #9a9184 |

### Step 6: archive

`guide/` + `brand.md` + `index.md` moved via `git mv` to `content-legacy/`
(history preserved). `content/docs/` holds only `index.mdx` + `meta.json`.
`.vitepress/` untouched (dies in Task 5 Step 6).

### Step 7: gates (all with --skip-nx-cache)

- Plain `pnpm install`: lockfile up to date path, 22 packages linked.
- `nx run docs:build`: green. Routes: `/`, `/_not-found`, `/api/search`,
  `/docs` (SSG via `generateStaticParams`).
- `apps/docs/out/index.html` exists.
- `apps/docs/out/api/search` exists (extensionless file, payload opens with
  `{"type":"advanced",...}` — zbsearch, as Task 1 noted; the exact recorded
  path asserted, no `*search*.json` guess).
- `nx run docs:typecheck`: clean (with the committed `jsx: preserve`
  tsconfig).
- `nx run docs:lint`: clean after deviation 1 (before: 16252 errors, all in
  generated/legacy dirs, zero in hand-written source).
- Root `package.json`: `lint` and `typecheck` gained `docs`; `test`
  unchanged (docs has no unit tests).

### Deviations (2, both minimal and recorded)

1. `apps/docs/eslint.config.js` adds an ignores block
   (`.next/**`, `.source/**`, `out/**`, `.vitepress/**`, `next-env.d.ts`)
   on top of the shared-base shape. Without it `eslint .` lints Next/fumadocs
   build output and the legacy `.vitepress/dist` bundle (16252 errors, all in
   those dirs). The shared base only ignores `dist/**`, `lib/**`,
   `node_modules/**`, `coverage/**`, `storybook-static/**`, which does not
   cover Next.js outputs. The specified `eslint .` command is unchanged.
2. `apps/docs/tsconfig.json` is committed with the specified `jsx: preserve`
   content although every `next build` rewrites it in the working tree to
   `jsx: react-jsx` plus `lib`/`allowJs`/`noEmit`/`incremental` (Task 1 notes
   predicted this; committing `preserve` is the blessed behavior — Next
   re-adjusts automatically and the build gate passed).

Committed per Step 8 as `feat(docs): rebuild docs app on Next.js + fumadocs with static export`.
