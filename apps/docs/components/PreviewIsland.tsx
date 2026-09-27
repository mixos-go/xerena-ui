'use client'

import { useEffect, useRef } from 'react'

// Must match `basePath` in next.config.mjs. The island bundle is a static
// asset, so its URL has to include the base path explicitly.
const BASE_PATH = '/xerena-ui'
const ISLAND_URL = `${BASE_PATH}/preview-islands/islands.js`

interface IslandModule {
  mount: (demoId: string, container: Element) => () => void
}

// new Function keeps the bundler (webpack/turbopack) from statically
// analyzing this import. The island bundle vendors its own React + React-DOM
// and must load as a separate runtime chunk — never merged into the Next
// shell graph (canary React vs stable react-dom throws #527).
const runtimeImport = new Function('url', 'return import(url)') as (url: string) => Promise<IslandModule>

let islandPromise: Promise<IslandModule> | null = null
function loadIslands(): Promise<IslandModule> {
  if (!islandPromise) {
    // Reset the cache on failure so a transient load error doesn't poison
    // all previews until reload.
    islandPromise = runtimeImport(ISLAND_URL).then(
      (mod) => mod,
      (err: unknown) => {
        islandPromise = null
        throw err
      },
    )
  }
  return islandPromise
}

function showError(el: HTMLElement, err: unknown) {
  el.setAttribute('role', 'alert')
  el.textContent = `Preview failed to load: ${err instanceof Error ? err.message : String(err)}`
}

export function PreviewIsland({ demoId, title }: { demoId: string; title?: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    let unmount: (() => void) | undefined
    let cancelled = false
    loadIslands().then(
      (mod) => {
        if (cancelled || !ref.current) return
        try {
          unmount = mod.mount(demoId, ref.current)
        } catch (err) {
          // Surface a visible error instead of a stuck "Loading preview…".
          if (ref.current) {
            showError(ref.current, err)
          }
        }
      },
      (err: unknown) => {
        if (!cancelled && ref.current) {
          showError(ref.current, err)
        }
      },
    )
    return () => {
      cancelled = true
      unmount?.()
    }
  }, [demoId])

  return (
    <section ref={ref} data-preview-island={demoId} aria-label={title} aria-live="polite">
      <p>Loading preview…</p>
    </section>
  )
}
