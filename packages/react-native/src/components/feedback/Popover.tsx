import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { Anchor } from '../../primitives/Anchor'
import { Overlay } from '../../primitives/Overlay'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { nativeElevation } from '../../styles/elevation'
import { radius } from '../../styles/radius'
import { spacing } from '../../styles/spacing'
import { type ViewStyle } from 'react-native'

type PopoverSide = 'top' | 'bottom' | 'left' | 'right'

interface PopoverContextValue {
  open: boolean
  toggle: () => void
  onClose: () => void
  anchor?: { x: number; y: number; width: number; height: number }
  setAnchor: (anchor: { x: number; y: number; width: number; height: number } | undefined) => void
}

const PopoverContext = createContext<PopoverContextValue>({
  open: false,
  toggle: () => {},
  onClose: () => {},
  setAnchor: () => {},
})

function PopoverRoot({
  open: controlledOpen,
  defaultOpen = false,
  onClose,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onClose?: () => void
  children: ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [anchor, setAnchor] = useState<PopoverContextValue['anchor']>(undefined)
  const isOpen = controlledOpen ?? internalOpen

  const toggle = useCallback(() => {
    const next = !internalOpen
    setInternalOpen(next)
    if (!next) onClose?.()
  }, [internalOpen, onClose])

  const close = useCallback(() => {
    setInternalOpen(false)
    onClose?.()
  }, [onClose])

  return (
    <PopoverContext.Provider
      value={{
        open: isOpen,
        toggle,
        onClose: close,
        anchor,
        setAnchor,
      }}
    >
      {children}
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({ children }: { children: ReactNode }) {
  const { toggle, setAnchor } = useContext(PopoverContext)

  return (
    <Anchor>
      {({ x, y, width, height, triggerRef }) => (
        <Pressable
          ref={triggerRef}
          onPress={() => {
            setAnchor({ x, y, width, height })
            toggle()
          }}
          accessibilityRole="button"
        >
          {children}
        </Pressable>
      )}
    </Anchor>
  )
}

function PopoverContent({
  children,
  side = 'bottom',
  style,
}: {
  children: ReactNode
  side?: PopoverSide
  style?: ViewStyle
}) {
  const { open, onClose, anchor } = useContext(PopoverContext)
  const colors = useNativeColors()

  if (!open || !anchor) return null

  const { x, y, width, height } = anchor
  const offset = spacing[2]

  let contentStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: spacing[1],
    ...nativeElevation('md'),
  }

  if (side === 'top') {
    contentStyle = {
      ...contentStyle,
      left: x + width / 2,
      top: y - offset,
      transform: [{ translateX: -width / 2 }],
    }
  } else if (side === 'bottom') {
    contentStyle = {
      ...contentStyle,
      left: x + width / 2,
      top: y + height + offset,
      transform: [{ translateX: -width / 2 }],
    }
  } else if (side === 'left') {
    contentStyle = {
      ...contentStyle,
      left: x - offset,
      top: y + height / 2,
      transform: [{ translateY: -height / 2 }],
    }
  } else if (side === 'right') {
    contentStyle = {
      ...contentStyle,
      left: x + width + offset,
      top: y + height / 2,
      transform: [{ translateY: -height / 2 }],
    }
  }

  return (
    <Overlay open={open} onClose={onClose}>
      <View
        style={[styles.content, contentStyle, style]}
        accessibilityRole="alert"
        accessibilityLabel="Popover"
      >
        {children}
      </View>
    </Overlay>
  )
}

function PopoverOverlay() {
  return null
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Overlay: PopoverOverlay,
}

export type PopoverRootProps = React.ComponentProps<typeof PopoverRoot>
export type PopoverTriggerProps = React.ComponentProps<typeof PopoverTrigger>
export type PopoverContentProps = React.ComponentProps<typeof PopoverContent>

const styles = StyleSheet.create({
  content: {
    minWidth: 200,
    maxWidth: 320,
  },
})