import { createContext, useContext, useState, useRef, type ReactNode, isValidElement, Children } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { Anchor, type AnchorState } from '../../primitives/Anchor'
import { ListOverlay, type ListOverlayOption } from '../../primitives/ListOverlay'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'

interface MenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<View | null>
  anchor: AnchorState
}

const MenuContext = createContext<MenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
  anchor: { x: 0, y: 0, width: 0, height: 0, open: false, setOpen: () => {}, triggerRef: { current: null } },
})

export const useMenuCtx = () => useContext(MenuContext)

export interface MenuRootProps {
  children: ReactNode
  testID?: string
}

export function MenuRoot({ children, testID = 'menu-root' }: MenuRootProps) {
  const [open, setOpen] = useState(false)

  return (
    <Anchor>
      {(anchor) => (
        <MenuContext.Provider value={{ open, setOpen, triggerRef: anchor.triggerRef, anchor }}>
          <View testID={testID}>{children}</View>
        </MenuContext.Provider>
      )}
    </Anchor>
  )
}

export interface MenuTriggerProps {
  children: ReactNode
  testID?: string
}

export function MenuTrigger({ children, testID = 'trigger' }: MenuTriggerProps) {
  const { open, setOpen } = useMenuCtx()

  return (
    <Pressable
      testID={testID}
      onPress={() => setOpen(!open)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityHint="Opens menu"
      accessibilityLabel="Menu trigger"
    >
      {children}
    </Pressable>
  )
}

export interface MenuContentProps {
  children: ReactNode
  testID?: string
}

type MenuRow =
  | { kind: 'item'; label: string; disabled?: boolean; onSelect?: () => void; children: ReactNode; testID?: string }
  | { kind: 'separator'; testID?: string }
  | { kind: 'label'; label: string; children: ReactNode }

export function MenuContent({ children, testID }: MenuContentProps) {
  const { open, setOpen, anchor } = useMenuCtx()
  const colors = useNativeColors()
  const suppressClose = useRef(false)
  void testID

  if (!open) return null

  const rows: MenuRow[] = []
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const type = child.type as { displayName?: string }
    if (type?.displayName === 'MenuItem') {
      const props = child.props as MenuItemProps
      rows.push({
        kind: 'item',
        label: typeof props.children === 'string' ? props.children : '',
        disabled: props.disabled,
        onSelect: props.onSelect,
        children: props.children,
        testID: props.testID,
      })
    } else if (type?.displayName === 'MenuSeparator') {
      const props = child.props as { testID?: string }
      rows.push({ kind: 'separator', testID: props.testID })
    } else if (type?.displayName === 'MenuLabel') {
      const props = child.props as { children?: ReactNode }
      rows.push({
        kind: 'label',
        label: typeof props.children === 'string' ? props.children : '',
        children: props.children,
      })
    }
  })

  const options: ListOverlayOption<string>[] = rows.map((row, index) => ({
    value: String(index),
    label: row.kind === 'label' ? row.label : row.kind === 'item' ? row.label : '',
  }))

  const handleSelect = (value: string) => {
    const row = rows[Number(value)]
    if (!row || row.kind !== 'item' || row.disabled) {
      suppressClose.current = true
      return
    }
    row.onSelect?.()
  }

  const handleClose = () => {
    if (suppressClose.current) {
      suppressClose.current = false
      return
    }
    setOpen(false)
  }

  return (
    <ListOverlay
      open={open}
      onClose={handleClose}
      anchor={anchor}
      options={options}
      onSelect={handleSelect}
      renderOption={(item, { highlighted }) => {
        const row = rows[Number(item.value)]
        if (!row) return null
        if (row.kind === 'separator') {
          return (
            <View
              testID={row.testID ?? 'menu-separator'}
              style={[styles.separator, { backgroundColor: colors.border }]}
              role="separator"
              accessibilityLabel="Separator"
            />
          )
        }
        if (row.kind === 'label') {
          return (
            <Text style={[styles.label, { color: colors.textMuted }]} accessibilityRole="text">
              {row.children}
            </Text>
          )
        }
        return (
          <View
            style={[
              styles.option,
              row.disabled && styles.optionDisabled,
              highlighted && { backgroundColor: colors.surfaceHover },
            ]}
          >
            <Text
              testID={row.testID}
              style={[body.md, { color: row.disabled ? colors.textMuted : colors.text }]}
            >
              {row.children}
            </Text>
          </View>
        )
      }}
    />
  )
}

export interface MenuItemProps {
  children: ReactNode
  disabled?: boolean
  onSelect?: () => void
  testID?: string
}

export function MenuItem(props: MenuItemProps) {
  void props
  return null
}

MenuItem.displayName = 'MenuItem'

export function MenuSeparator(props: { testID?: string }) {
  void props
  return null
}

MenuSeparator.displayName = 'MenuSeparator'

export function MenuLabel(props: { children: ReactNode; testID?: string }) {
  void props
  return null
}

MenuLabel.displayName = 'MenuLabel'

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
}

const styles = StyleSheet.create({
  option: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  optionDisabled: {
    opacity: 0.5,
  },
  separator: {
    height: 1,
    marginVertical: spacing[1],
  },
  label: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    fontWeight: '600',
    fontSize: 12,
  },
})
