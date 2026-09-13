import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(readFileSync(resolve(root, 'src/tokens.json'), 'utf8'))
const semantic = JSON.parse(readFileSync(resolve(root, 'src/semantic.json'), 'utf8'))

function toCssVars(obj, prefix = '--xr') {
  const lines = []
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      lines.push(`${prefix}-${key}: ${value.join(', ')};`)
    } else if (value && typeof value === 'object') {
      lines.push(toCssVars(value, `${prefix}-${key}`))
    } else {
      lines.push(`${prefix}-${key}: ${value};`)
    }
  }
  return lines.join('\n  ')
}

export { toCssVars }

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  const lightLines = [':root {', `  ${toCssVars(tokens)}`]
  for (const [alias, ref] of Object.entries(semantic.light)) {
    lightLines.push(`  --xr-semantic-color-${alias}: ${tokens.color[ref.name][ref.shade]};`)
  }
  lightLines.push('}')
  const darkLines = [`[data-xerena-theme='dark'] {`]
  for (const [alias, ref] of Object.entries(semantic.dark)) {
    const resolved = tokens.color.dark[ref.name]?.[ref.shade] ?? tokens.color[ref.name][ref.shade]
    darkLines.push(`  --xr-semantic-color-${alias}: ${resolved};`)
  }
  darkLines.push('}')
  writeFileSync(resolve(root, 'dist/tokens.css'), `${lightLines.join('\n')}\n${darkLines.join('\n')}\n`)
  writeFileSync(resolve(root, 'dist/tokens.json'), JSON.stringify(tokens, null, 2))
  console.log('generated dist/tokens.css and dist/tokens.json')
}
