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
