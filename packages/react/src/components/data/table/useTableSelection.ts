import { useState, useCallback } from 'react'
export function useTableSelection(controlledIds?: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set(controlledIds))
  const toggle = useCallback((id: string) => setSelected(prev => {
    const n = new Set(prev)
    if (n.has(id)) {
      n.delete(id)
    } else {
      n.add(id)
    }
    return n
  }), [])
  const isAllSelected = useCallback((ids: string[]) => ids.length > 0 && ids.every(id => selected.has(id)), [selected])
  const isIndeterminate = useCallback((ids: string[]) => ids.some(id => selected.has(id)) && !ids.every(id => selected.has(id)), [selected])
  return { selected, toggle, isAllSelected, isIndeterminate }
}
