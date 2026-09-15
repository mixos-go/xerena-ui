import { useEffect, useRef, type ReactNode } from 'react'
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native'
import { useDismissable } from '../hooks/useDismissable'
import { useNativeMotion } from '../hooks/useNativeMotion'

export interface OverlayProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Overlay({ open, onClose, children }: OverlayProps) {
  const { onRequestClose, backdropProps } = useDismissable({ open, onDismiss: onClose })
  const { animate } = useNativeMotion()
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const target = open ? 1 : 0
    const duration = open ? ('moderate' as const) : ('fast' as const)
    const easing = open ? ('enter' as const) : ('exit' as const)
    Animated.timing(opacity, animate({ toValue: target, duration, easing })).start()
  }, [open, opacity, animate])

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onRequestClose}>
      <Animated.View style={[styles.container, { opacity }]} pointerEvents={open ? 'auto' : 'none'}>
        <Pressable style={styles.backdrop} {...backdropProps} />
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
    backgroundColor: 'rgba(43, 38, 32, 0.4)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
})
