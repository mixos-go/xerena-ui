import { createContext, useContext } from 'react'
import { useClassName } from '../../../primitives/useClassName'
import type { TableContextValue } from './types'
import type { ReactNode } from 'react'
const TableCtx = createContext<TableContextValue>({ variant: 'outlined', size: 'md', frozenHeader: false })
export const useTableCtx = () => useContext(TableCtx)
export interface TableProps { variant?: 'striped'|'outlined'|'grid'|'hover'; size?: 'sm'|'md'|'lg'; frozenHeader?: boolean; maxHeight?: number|string; className?: string; children: ReactNode }
export function Table({ variant = 'outlined', size = 'md', frozenHeader = false, maxHeight, className, children }: TableProps) {
  return (
    <TableCtx.Provider value={{ variant, size, frozenHeader }}>
      <div style={maxHeight ? { overflow: 'auto', maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : undefined}
        className={useClassName({ className }, [`xr-table-scrollable ${frozenHeader ? 'xr-table--scrollable' : ''}`])}>
        <table className={`xr-table xr-table--${variant} xr-table--${size} ${frozenHeader ? 'xr-table--frozen' : ''}`}>{children}</table>
      </div>
    </TableCtx.Provider>
  )
}
