import { copyFileSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const tokensCss = resolve(dirname(require.resolve('@xerena/tokens/package.json')), 'dist/tokens.css')
const baseCss = resolve(root, 'src/styles/base.css')
mkdirSync(resolve(root, 'dist'), { recursive: true })
writeFileSync(resolve(root, 'dist/styles.css'), `${readFileSync(tokensCss, 'utf8')}\n${readFileSync(baseCss, 'utf8')}`)
console.log('generated dist/styles.css (tokens.css + base.css)')
copyFileSync(baseCss, resolve(root, 'dist/base.css'))
console.log('copied dist/base.css')
