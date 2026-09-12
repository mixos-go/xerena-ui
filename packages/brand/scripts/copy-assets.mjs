import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(resolve(root, 'dist/assets'), { recursive: true })
for (const name of ['mark.svg', 'lockup.svg', 'mark-og.svg']) {
  copyFileSync(resolve(root, 'assets', name), resolve(root, 'dist/assets', name))
}
console.log('copied dist/assets/*.svg')