import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native'
import { useDismissable } from '../hooks/useDismissable'
import { useNativeColors } from '../hooks/useNativeColors'
import { useNativeMotion } from '../hooks/useNativeMotion'

export interface OverlayProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function Overlay({ open, onClose, children }: OverlayProps) {
  const [closing, setClosing] = useState(false)
  const visible = open || closing
  const { onRequestClose, backdropProps } = useDismissable({ open: visible, onDismiss: onClose })
  const { animate, reduced } = useNativeMotion()
  const opacity = useRef(new Animated.Value(0)).current
  const wasOpen = useRef(open)

  const colors = useNativeColors()

  useEffect(() => {
    if (open && !wasOpen.current) {
      setClosing(false)
      Animated.timing(opacity, animate({ toValue: 1, duration: 'moderate', easing: 'enter' })).start()
    } else if (!open && wasOpen.current) {
      setClosing(true)
      if (reduced) {
        opacity.setValue(0)
        setClosing(false)
      } else {
        Animated.timing(opacity, animate({ toValue: 0, duration: 'emphatic', easing: 'exit' })).start(
          ({ finished }) => {
            if (finished) setClosing(false)
          },
        )
      }
    }
    wasOpen.current = open
  }, [open, opacity, animate, reduced])

  const backdropColor = hexToRgba(colors.text, 0.4)

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onRequestClose}>
      <Animated.View style={[styles.container, { opacity }]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={[styles.backdrop, { backgroundColor: backdropColor }]} {...backdropProps} />
        <View style={styles.content} accessibilityViewIsModal>
          {children}
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
})
