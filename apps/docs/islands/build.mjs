// Builds the self-contained preview-island bundle into
// apps/docs/public/preview-islands/islands.js.
//
// The bundle vendors its own React + React-DOM (workspace stable) so docs
// pages can mount live previews without sharing React with the Next.js
// shell: Next 16 vendors a React canary whose internals throw #527 against
// stable react-dom. Bundling everything (react, react-dom, @xerena/react,
// @xerena/preview, all demos) into one ESM bundle removes all cross-boundary
// pairing — the island only exchanges serializable props + a DOM container
// with the shell.
//
// The esbuild binary is invoked directly (not `import 'esbuild'`) so this
// script works regardless of pnpm's strict node_modules layout.
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const esbuildBin = path.resolve(root, '..', '..', 'node_modules', '.bin', 'esbuild')

if (!existsSync(esbuildBin)) {
  throw new Error(`[islands] esbuild binary not found at ${esbuildBin} — run pnpm install first`)
}

await new Promise((resolve, reject) => {
  execFile(
    esbuildBin,
    [
      path.join(root, 'islands', 'registry.tsx'),
      '--bundle',
      '--minify',
      '--format=esm',
      '--target=es2022',
      '--jsx=automatic',
      '--log-level=warning',
      '--define:process.env.NODE_ENV="production"',
      `--outfile=${path.join(root, 'public', 'preview-islands', 'islands.js')}`,
    ],
    { cwd: root },
    (err, stdout, stderr) => {
      if (stdout) process.stdout.write(stdout)
      if (stderr) process.stderr.write(stderr)
      if (err) {
        reject(err)
      } else {
        resolve(undefined)
      }
    },
  )
})

console.log('[islands] public/preview-islands/islands.js built')
