import '@testing-library/jest-dom/vitest'

if (!window.matchMedia) {
  const listeners: Array<() => void> = []
  const matchMedia = (query: string): MediaQueryList => {
    const mql = {
      matches: false,
      media: query,
      onchange: null,
      listeners,
      addEventListener: (_event: string, cb: () => void) => {
        listeners.push(cb)
      },
      removeEventListener: (_event: string, cb: () => void) => {
        const index = listeners.indexOf(cb)
        if (index >= 0) listeners.splice(index, 1)
      },
      addListener: (cb: () => void) => {
        listeners.push(cb)
      },
      removeListener: (cb: () => void) => {
        const index = listeners.indexOf(cb)
        if (index >= 0) listeners.splice(index, 1)
      },
      dispatchEvent: () => false,
    } as unknown as MediaQueryList
    return mql
  }
  ;(matchMedia as unknown as { listeners?: Array<() => void> }).listeners = listeners
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: matchMedia,
  })
}
