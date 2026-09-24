import { useEffect, useReducer, type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from '../../primitives/Overlay'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { nativeElevation } from '../../styles/elevation'
import { radius } from '../../styles/radius'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'

export interface ToastOptions {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral'
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  dismissible?: boolean
  onDismiss?: () => void
  autoHideDuration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

interface ToastItem extends ToastOptions {
  id: string
}

const TOAST_STACK = new Map<string, ToastItem>()
const LISTENERS = new Set<() => void>()
let idCounter = 0

function notify() {
  LISTENERS.forEach((listener) => listener())
}

export function toast(options: ToastOptions) {
  const id = `t${++idCounter}`
  TOAST_STACK.set(id, { ...options, id })
  notify()
}

function removeToast(id: string) {
  const item = TOAST_STACK.get(id)
  if (!item) return
  TOAST_STACK.delete(id)
  notify()
  item.onDismiss?.()
}

export function ToastProvider({ children }: { children?: ReactNode }) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    LISTENERS.add(forceUpdate)
    return () => {
      LISTENERS.delete(forceUpdate)
    }
  }, [forceUpdate])

  const toasts = [...TOAST_STACK.values()]

  return (
    <>
      {children}
      <Overlay
        open={toasts.length > 0}
        onClose={() => {
          const ids = [...TOAST_STACK.keys()]
          ids.forEach((id) => removeToast(id))
        }}
      >
        <View style={styles.stack} pointerEvents="box-none">
          {toasts.map((item) => (
            <ToastCard key={item.id} {...item} onClose={() => removeToast(item.id)} />
          ))}
        </View>
      </Overlay>
    </>
  )
}

function ToastCard({
  variant = 'neutral',
  title,
  description,
  action,
  dismissible,
  autoHideDuration = 5000,
  onClose,
}: ToastItem & { onClose: () => void }) {
  const colors = useNativeColors()

  useEffect(() => {
    if (!autoHideDuration) return
    const timer = setTimeout(() => {
      onClose()
    }, autoHideDuration)
    return () => clearTimeout(timer)
  }, [autoHideDuration, onClose])

  return (
    <View
      testID="toast-card"
      accessible
      accessibilityRole={variant === 'danger' ? 'alert' : undefined}
      accessibilityLiveRegion={variant === 'danger' ? 'assertive' : 'polite'}
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        nativeElevation('md'),
      ]}
    >
      <View style={styles.body}>
        {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
        {description && (
          <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
        )}
        {action && (
          <Pressable onPress={action.onClick} style={styles.action}>
            <Text style={[styles.actionText, { color: colors.primary }]}>{action.label}</Text>
          </Pressable>
        )}
      </View>
      {dismissible && (
        <Pressable
          accessibilityLabel="Dismiss"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.close}
        >
          <Text style={{ color: colors.text }}>✕</Text>
        </Pressable>
      )}
    </View>
  )
}

export function Toast(props: ToastOptions) {
  const { onDismiss, ...rest } = props
  return <ToastCard {...rest} id="declarative" onClose={() => onDismiss?.()} />
}

const styles = StyleSheet.create({
  stack: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: spacing[4],
    gap: spacing[2],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    maxWidth: 360,
  },
  body: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    ...body.sm,
    marginTop: spacing[0],
  },
  action: {
    marginTop: spacing[2],
  },
  actionText: {
    fontWeight: '600',
  },
  close: {
    marginLeft: 'auto',
  },
})
