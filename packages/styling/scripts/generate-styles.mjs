import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function resolveTokensPath(require) {
  return resolve(dirname(require.resolve('@xerena/tokens/package.json')), 'src/tokens.json')
}

export function buildStylesheet(tokens) {
  const lines = []
  lines.push('/* Xerena utility classes — generated from @xerena/tokens. Do not edit. */')
  lines.push('')

  const add = (selector, declaration) => lines.push(`.${selector} { ${declaration}; }`)
  const varName = (segments) => `--xr-${segments.join('-')}`

  for (const [name, shades] of Object.entries(tokens.color)) {
    for (const [shade] of Object.entries(shades)) {
      const v = `var(${varName(['color', name, shade])})`
      add(`xr-bg-${name}-${shade}`, `background-color: ${v}`)
      add(`xr-text-${name}-${shade}`, `color: ${v}`)
      add(`xr-border-${name}-${shade}`, `border-color: ${v}`)
    }
  }

  for (const [key] of Object.entries(tokens.spacing)) {
    const v = `calc(var(${varName(['spacing', key])}) * 1px)`
    add(`xr-p-${key}`, `padding: ${v}`)
    add(`xr-px-${key}`, `padding-inline: ${v}`)
    add(`xr-py-${key}`, `padding-block: ${v}`)
    add(`xr-m-${key}`, `margin: ${v}`)
    add(`xr-mx-${key}`, `margin-inline: ${v}`)
    add(`xr-my-${key}`, `margin-block: ${v}`)
    add(`xr-gap-${key}`, `gap: ${v}`)
  }

  for (const [family] of Object.entries(tokens.typography.fontFamily)) {
    add(`xr-font-family-${family}`, `font-family: var(${varName(['typography', 'fontFamily', family])})`)
  }

  for (const [variant, sizes] of Object.entries(tokens.typography)) {
    if (variant === 'fontFamily') continue
    for (const [size] of Object.entries(sizes)) {
      add(`xr-font-size-${variant}-${size}`, `font-size: calc(var(${varName(['typography', variant, size, 'fontSize'])}) * 1px)`)
      add(`xr-leading-${variant}-${size}`, `line-height: calc(var(${varName(['typography', variant, size, 'lineHeight'])}) * 1px)`)
      add(`xr-font-weight-${variant}-${size}`, `font-weight: var(${varName(['typography', variant, size, 'fontWeight'])})`)
      add(`xr-tracking-${variant}-${size}`, `letter-spacing: var(${varName(['typography', variant, size, 'letterSpacing'])})`)
    }
  }

  for (const [key] of Object.entries(tokens.elevation)) {
    add(`xr-elevation-${key}`, `box-shadow: var(${varName(['elevation', key])})`)
  }

  for (const [key] of Object.entries(tokens.radius)) {
    add(`xr-radius-${key}`, `border-radius: calc(var(${varName(['radius', key])}) * 1px)`)
  }

  for (const [key] of Object.entries(tokens.motion.duration)) {
    add(`xr-duration-${key}`, `transition-duration: calc(var(${varName(['motion', 'duration', key])}) * 1ms)`)
  }

  for (const [key] of Object.entries(tokens.motion.easing)) {
    add(`xr-ease-${key}`, `transition-timing-function: cubic-bezier(var(${varName(['motion', 'easing', key])}))`)
  }

  return `${lines.join('\n')}\n`
}

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const require = createRequire(import.meta.url)
  const tokens = JSON.parse(readFileSync(resolveTokensPath(require), 'utf8'))
  mkdirSync(resolve(root, 'dist'), { recursive: true })
  writeFileSync(resolve(root, 'dist/styles.css'), buildStylesheet(tokens))
  console.log('generated dist/styles.css')
}