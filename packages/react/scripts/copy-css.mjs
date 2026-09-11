import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(resolve(root, 'dist'), { recursive: true })
copyFileSync(
  resolve(root, 'src/styles/base.css'),
  resolve(root, 'dist/base.css'),
)
console.log('copied dist/base.css')
