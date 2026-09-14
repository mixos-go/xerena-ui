import { createContext, useContext, useState } from 'react'
import { useFocusRing, useClassName } from '../../primitives'
const Ctx = createContext<{ open: boolean; setOpen: (o: boolean) => void; active: string; setActive: (a: string) => void; selected: string[]; setSelected: (s: string[]) => void }>({ open: false, setOpen: () => {}, active: '', setActive: () => {}, selected: [], setSelected: () => {} })

function Root({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const [active, setActive] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  return <Ctx.Provider value={{ open, setOpen, active, setActive, selected, setSelected }}>{children}</Ctx.Provider>
}
function Input({ placeholder, value, onChange, className, ...rest }: { placeholder?: string; value?: string; onChange?: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { open, setOpen } = useContext(Ctx)
  const { onFocus, onBlur, focusWithin } = useFocusRing()
  return <input className={useClassName({ className }, ['xr-combobox__input', focusWithin && 'xr-combobox__input--focus'])} placeholder={placeholder} value={value}
    onChange={(e) => { onChange?.(e.target.value); setOpen(true) }}
    onFocus={onFocus} onBlur={() => { onBlur(); setTimeout(() => setOpen(false), 150) }}
    role="combobox" aria-expanded={open} aria-autocomplete="list" {...rest} />
}
function List({ open, children, className }: { open?: boolean; children: React.ReactNode; className?: string }) {
  const { open: ctxOpen } = useContext(Ctx)
  const isOpen = open ?? ctxOpen
  if (!isOpen) return null
  return <ul className={useClassName({ className }, ['xr-combobox__list'])} role="listbox">{children}</ul>
}
function Option({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { selected, setSelected, setOpen } = useContext(Ctx)
  return <li role="option" aria-selected={selected.includes(value)}
    className={useClassName({ className }, ['xr-combobox__option'])}
    onMouseDown={() => { setSelected([...selected, value]); setOpen(false) }}
  >{children}</li>
}
function Clear({ onClear }: { onClear?: () => void }) {
  const { setSelected } = useContext(Ctx)
  return <button type="button" aria-label="Clear" onClick={() => { onClear?.(); setSelected([]) }} className="xr-combobox__clear">×</button>
}
export const Combobox = { Root, Input, List, Option, Clear }