import { createContext, useContext, useState, useRef, type ReactNode, isValidElement, Children } from 'react'
import { StyleSheet, Text, View, type ViewStyle, ScrollView } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { Anchor } from '../../primitives/Anchor'
import { Overlay } from '../../primitives/Overlay'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

interface MenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<View | null>
}

const MenuContext = createContext<MenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
})

export const useMenuCtx = () => useContext(MenuContext)

export interface MenuRootProps {
  children: ReactNode
  testID?: string
}

export function MenuRoot({ children, testID = 'menu-root' }: MenuRootProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<View>(null)

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <View testID={testID}>{children}</View>
    </MenuContext.Provider>
  )
}

export interface MenuTriggerProps {
  children: ReactNode
  testID?: string
}

export function MenuTrigger({ children, testID = 'trigger' }: MenuTriggerProps) {
  const { open, setOpen, triggerRef } = useMenuCtx()

  return (
    <Anchor>
      {({ triggerRef: anchorTriggerRef }) => (
        <Pressable
          ref={(el) => {
            triggerRef.current = el
            anchorTriggerRef.current = el
          }}
          testID={testID}
          onPress={() => setOpen(!open)}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityHint="Opens menu"
          accessibilityLabel="Menu trigger"
        >
          {children}
        </Pressable>
      )}
    </Anchor>
  )
}

export interface MenuContentProps {
  children: ReactNode
  style?: ViewStyle
  testID?: string
}

export function MenuContent({ children, style, testID = 'content' }: MenuContentProps) {
  const { open, setOpen } = useMenuCtx()
  const colors = useNativeColors()

  if (!open) return null

  const handleSelect = () => {
    setOpen(false)
  }

  const renderChildren = () => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child
      const type = child.type as { displayName?: string }
      if (type?.displayName === 'MenuItem') {
        const itemProps = child.props as MenuItemProps
        return (
          <Pressable
            key={child.key ?? undefined}
            onPress={itemProps.disabled ? undefined : handleSelect}
            disabled={itemProps.disabled}
            accessibilityRole="menuitem"
            accessibilityState={{ disabled: !!itemProps.disabled }}
            style={[
              styles.option,
              itemProps.disabled && styles.optionDisabled,
            ]}
          >
            <Text style={[body.md, { color: itemProps.disabled ? colors.textMuted : colors.text }]}>
              {itemProps.children}
            </Text>
          </Pressable>
        )
      } else if (type?.displayName === 'MenuSeparator') {
        return (
          <View
            key={child.key ?? undefined}
            style={[styles.separator, { backgroundColor: colors.border }]}
            role="separator"
            accessibilityLabel="Separator"
          />
        )
      } else if (type?.displayName === 'MenuLabel') {
        const labelProps = child.props as { children?: ReactNode }
        return (
          <Text
            key={child.key ?? undefined}
            style={[styles.label, { color: colors.textMuted }]}
            accessibilityRole="text"
          >
            {labelProps.children}
          </Text>
        )
      }
      return child
    })
  }

  return (
    <Overlay open={open} onClose={() => setOpen(false)}>
      <View
        testID={testID}
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
          style,
        ]}
        accessibilityRole="menu"
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {renderChildren()}
        </ScrollView>
      </View>
    </Overlay>
  )
}

export interface MenuItemProps {
  children: ReactNode
  disabled?: boolean
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
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    maxHeight: 300,
    minWidth: 160,
  },
  scroll: {
    maxHeight: 280,
  },
  scrollContent: {
    paddingVertical: spacing[1],
  },
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
