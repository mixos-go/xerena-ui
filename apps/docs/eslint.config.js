import base from '@xerena/eslint-config'

export default [
  ...base,
  {
    // Next.js / fumadocs build outputs plus the legacy VitePress tree
    // (deleted in Task 5): none of these are hand-written source.
    ignores: ['.next/**', '.source/**', 'out/**', '.vitepress/**', 'next-env.d.ts'],
  },
]
