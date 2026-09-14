import { createContext, useContext, useEffect, useRef, useState, useId } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
import type { KeyboardEvent } from 'react'
const Ctx = createContext<{ open: boolean; setOpen: (o: boolean) => void; active: string; setActive: (a: string) => void; selected: string[]; setSelected: (s: string[]) => void; idPrefix: string; listRef: React.RefObject<HTMLUListElement | null> }>({ open: false, setOpen: () => {}, active: '', setActive: () => {}, selected: [], setSelected: () => {}, idPrefix: '', listRef: { current: null } })

function Root({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [active, setActive] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const idPrefix = useId().replace(/:/g, '')
  const listRef = useRef<HTMLUListElement>(null)
  return <Ctx.Provider value={{ open, setOpen, active, setActive, selected, setSelected, idPrefix, listRef }}>{children}</Ctx.Provider>
}
function Input({ placeholder, value, onChange, className, ...rest }: { placeholder?: string; value?: string; onChange?: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { open, setOpen, active, setActive, selected, setSelected, idPrefix, listRef } = useContext(Ctx)
  const { onFocus, onBlur, focusWithin } = useFocusRing()
  const inputRef = useRef<HTMLInputElement>(null)
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const options = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    const idx = options.findIndex(o => o.id === active)
    let nextActive = active
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); nextActive = active ? options[Math.min(idx + 1, options.length - 1)]?.id ?? '' : options[0]?.id ?? '' }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); nextActive = active ? options[Math.max(idx - 1, 0)]?.id ?? '' : options[options.length - 1]?.id ?? '' }
    else if (e.key === 'Home') { e.preventDefault(); nextActive = options[0]?.id ?? '' }
    else if (e.key === 'End') { e.preventDefault(); nextActive = options[options.length - 1]?.id ?? '' }
    else if (e.key === 'Enter') {
      if (active) {
        e.preventDefault()
        const target = options[idx]
        const value = target?.getAttribute('data-value')
        if (value !== null && value !== undefined) setSelected([...selected, value])
        setOpen(false)
        inputRef.current?.focus()
      }
      return
    }
    else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      return
    }
    else { return }
    if (nextActive) setActive(nextActive)
  }
  return <input ref={inputRef} className={useClassName({ className }, ['xr-combobox__input', focusWithin && 'xr-combobox__input--focus'])} placeholder={placeholder} value={value}
    onChange={(e) => { onChange?.(e.target.value); setOpen(true) }}
    onFocus={onFocus} onBlur={() => { onBlur(); setTimeout(() => setOpen(false), 150) }}
    onKeyDown={onKeyDown}
    role="combobox" aria-expanded={open} aria-autocomplete="list" aria-controls={`${idPrefix}-list`} aria-activedescendant={active || undefined} {...rest} />
}
function List({ open, children, className }: { open?: boolean; children: React.ReactNode; className?: string }) {
  const { open: ctxOpen, setActive, idPrefix, listRef } = useContext(Ctx)
  const isOpen = open ?? ctxOpen
  const listClass = useClassName({ className }, ['xr-combobox__list'])
  useEffect(() => {
    if (isOpen && listRef.current) {
      const first = listRef.current.querySelector<HTMLElement>('[role="option"]')
      if (first) setActive(first.id)
    }
  }, [isOpen, setActive])
  if (!isOpen) return null
  return <ul ref={listRef} id={`${idPrefix}-list`} data-combobox-list={idPrefix} role="listbox" className={listClass}>{children}</ul>
}
function Option({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { selected, setSelected, setOpen, active, setActive, idPrefix } = useContext(Ctx)
  const id = `${idPrefix}-opt-${value}`
  return <li id={id} role="option" data-value={value} data-active={active === id ? 'true' : undefined} aria-selected={selected.includes(value)}
    className={useClassName({ className }, ['xr-combobox__option'])}
    onMouseEnter={() => setActive(id)}
    onMouseDown={() => { setSelected([...selected, value]); setOpen(false) }}
  >{children}</li>
}
function Clear({ onClear }: { onClear?: () => void }) {
  const { setSelected } = useContext(Ctx)
  return <button type="button" aria-label="Clear" onClick={() => { onClear?.(); setSelected([]) }} className="xr-combobox__clear">×</button>
}
export const Combobox = { Root, Input, List, Option, Clear }
