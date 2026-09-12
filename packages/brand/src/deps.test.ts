import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import pkg from '../package.json'

const indexSource = readFileSync(resolve(process.cwd(), 'src/index.ts'), 'utf8')

describe('@xerena/brand published contract', () => {
  it('never depends on @xerena/react', () => {
    expect(pkg.dependencies).not.toHaveProperty('@xerena/react')
  })

  it('does not reference @xerena/react from the barrel', () => {
    expect(indexSource).not.toContain('@xerena/react')
  })
})