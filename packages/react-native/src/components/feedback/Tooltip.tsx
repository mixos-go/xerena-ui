import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Anchor } from '../../primitives/Anchor'
import { Overlay } from '../../primitives/Overlay'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useNativeMotion } from '../../hooks/useNativeMotion'
import { radius } from '../../styles/radius'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'

export interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: 'topStart' | 'topCenter' | 'topEnd' | 'bottomStart' | 'bottomCenter' | 'bottomEnd'
  delay?: number
}

export function Tooltip({ children, content, position = 'topCenter', delay = 400 }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<number>(0)
  const { reduced } = useNativeMotion()
  const colors = useNativeColors()

  const show = useCallback(() => {
    if (reduced) {
      setOpen(true)
      return
    }
    timerRef.current = setTimeout(() => setOpen(true), delay) as unknown as number
  }, [delay, reduced])

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    setOpen(false)
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const isTop = position.startsWith('top')

  return (
    <Anchor>
      {({ x, y, width, height, triggerRef }) => (
        <>
          <Pressable
            ref={triggerRef}
            onPressIn={show}
            onPressOut={hide}
            onHoverIn={show}
            onHoverOut={hide}
            onFocus={show}
            onBlur={hide}
            accessibilityHint={typeof content === 'string' ? content : undefined}
          >
            {children}
          </Pressable>
          <Overlay open={open} onClose={hide}>
            <View
              style={[
                styles.container,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
                isTop
                  ? {
                      left: x + width / 2,
                      top: y - spacing[2],
                      transform: [{ translateX: -width / 2 }],
                    }
                  : {
                      left: x + width / 2,
                      top: y + height + spacing[2],
                      transform: [{ translateX: -width / 2 }],
                    },
              ]}
              accessibilityRole="alert"
            >
              <Text style={[styles.content, { color: colors.text }]}>{typeof content === 'string' ? content : ''}</Text>
            </View>
          </Overlay>
        </>
      )}
    </Anchor>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
    borderWidth: 1,
    maxWidth: 280,
  },
  content: {
    ...body.sm,
  },
})