import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    // Next.js / fumadocs build outputs plus the legacy VitePress tree
    // (deleted in Task 5): none of these are hand-written source.
    // islands/*.mjs are node build tooling (cf. packages/preview linting src/ only).
    ignores: ['.next/**', '.source/**', 'out/**', 'public/preview-islands/**', '.vitepress/**', 'next-env.d.ts', 'islands/*.mjs'],
  },
]
