import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, StyleSheet, type ViewStyle } from 'react-native'
import { Overlay } from '../../primitives/Overlay'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { nativeElevation } from '../../styles/elevation'

type DrawerSide = 'left' | 'right' | 'top' | 'bottom'
type DrawerSize = 'xs' | 'sm' | 'md' | 'lg'

interface DrawerContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  side: DrawerSide
  size: DrawerSize
  onClose: () => void
}

const DrawerContext = createContext<DrawerContextValue>({
  open: false,
  setOpen: () => {},
  side: 'right',
  size: 'md',
  onClose: () => {},
})

const SIZE_MAP: Record<DrawerSize, number> = {
  xs: 240,
  sm: 320,
  md: 400,
  lg: 560,
}

function DrawerRoot({
  open: controlledOpen,
  onClose = () => {},
  side = 'right',
  size = 'md',
  children,
}: {
  open?: boolean
  onClose?: () => void
  side?: DrawerSide
  size?: DrawerSize
  children: ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen

  const handleSetOpen = (open: boolean) => {
    setInternalOpen(open)
    if (!open) onClose()
  }

  return (
    <DrawerContext.Provider
      value={{
        open: isOpen,
        setOpen: handleSetOpen,
        side,
        size,
        onClose,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}

function DrawerTrigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useContext(DrawerContext)
  return (
    <Pressable accessibilityRole="button" onPress={() => setOpen(!open)}>
      {children}
    </Pressable>
  )
}

function DrawerContent({
  children,
  side: sideProp,
  size: sizeProp,
  style,
}: {
  children: ReactNode
  side?: DrawerSide
  size?: DrawerSize
  style?: ViewStyle
}) {
  const { open, side, size, onClose } = useContext(DrawerContext)
  const s = sideProp ?? side
  const sz = sizeProp ?? size
  const { animate, reduced } = useNativeMotion()
  const colors = useNativeColors()

  const translateX = useRef(new Animated.Value(s === 'left' ? -SIZE_MAP[sz] : SIZE_MAP[sz])).current
  const translateY = useRef(new Animated.Value(s === 'top' ? -SIZE_MAP[sz] : SIZE_MAP[sz])).current
  const opacity = useRef(new Animated.Value(0)).current
  const wasOpen = useRef(open)

  const isHorizontal = s === 'left' || s === 'right'
  const dimension = SIZE_MAP[sz]

  useEffect(() => {
    if (open && !wasOpen.current) {
      Animated.parallel([
        Animated.timing(opacity, animate({ toValue: 1, duration: 'moderate', easing: 'enter' })),
        isHorizontal
          ? Animated.timing(translateX, animate({ toValue: 0, duration: 'moderate', easing: 'enter' }))
          : Animated.timing(translateY, animate({ toValue: 0, duration: 'moderate', easing: 'enter' })),
      ]).start()
    } else if (!open && wasOpen.current) {
      if (reduced) {
        opacity.setValue(0)
        translateX.setValue(s === 'left' ? -dimension : dimension)
        translateY.setValue(s === 'top' ? -dimension : dimension)
      } else {
        Animated.parallel([
          Animated.timing(opacity, animate({ toValue: 0, duration: 'emphatic', easing: 'exit' })),
          isHorizontal
            ? Animated.timing(translateX, animate({ toValue: s === 'left' ? -dimension : dimension, duration: 'emphatic', easing: 'exit' }))
            : Animated.timing(translateY, animate({ toValue: s === 'top' ? -dimension : dimension, duration: 'emphatic', easing: 'exit' })),
        ]).start()
      }
    }
    wasOpen.current = open
  }, [open, s, sz, dimension, reduced, animate, translateX, translateY, opacity])

  const containerStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
    ...nativeElevation('lg'),
  }

  if (isHorizontal) {
    containerStyle.width = dimension
    containerStyle.height = '100%'
    containerStyle.position = 'absolute'
    containerStyle.top = 0
    containerStyle[s === 'left' ? 'left' : 'right'] = 0
  } else {
    containerStyle.height = dimension
    containerStyle.width = '100%'
    containerStyle.position = 'absolute'
    containerStyle.left = 0
    containerStyle.right = 0
    containerStyle[s === 'top' ? 'top' : 'bottom'] = 0
  }

  const transform = isHorizontal ? [{ translateX }] : [{ translateY }]

  return (
    <Overlay open={open} onClose={onClose}>
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          { opacity, transform },
          style,
        ]}
        accessibilityRole="alert"
      >
        {children}
      </Animated.View>
    </Overlay>
  )
}

function DrawerOverlay() {
  return null
}

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Overlay: DrawerOverlay,
}

export type DrawerRootProps = React.ComponentProps<typeof DrawerRoot>
export type DrawerTriggerProps = React.ComponentProps<typeof DrawerTrigger>
export type DrawerContentProps = React.ComponentProps<typeof DrawerContent>

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    overflow: 'hidden',
  },
})