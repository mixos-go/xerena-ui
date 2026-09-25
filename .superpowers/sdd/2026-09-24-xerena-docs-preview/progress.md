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
