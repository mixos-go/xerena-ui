import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { nativeElevation } from '../../styles/elevation'
import { radius } from '../../styles/radius'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'

export interface MessageProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  title?: string
  description?: string
  icon?: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  children?: ReactNode
}

const ICONS: Record<string, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '⚠',
  danger: '✕',
  neutral: '',
}

const POS_MAP: Record<string, { top?: number; bottom?: number; left?: number; right?: number }> = {
  'top-left': { top: spacing[4], left: spacing[4] },
  'top-center': { top: spacing[4], left: 0, right: 0 },
  'top-right': { top: spacing[4], right: spacing[4] },
  'bottom-left': { bottom: spacing[4], left: spacing[4] },
  'bottom-center': { bottom: spacing[4], left: 0, right: 0 },
  'bottom-right': { bottom: spacing[4], right: spacing[4] },
}

export function Message({
  tone = 'neutral',
  position = 'bottom-center',
  title,
  description,
  icon,
  dismissible,
  onDismiss,
  children,
}: MessageProps) {
  const colors = useNativeColors()
  const isCenter = position === 'top-center' || position === 'bottom-center'

  return (
    <View
      accessible
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          position: 'absolute',
          zIndex: 40,
          backgroundColor: colors.background,
          borderColor: colors.border,
          ...POS_MAP[position],
        },
        nativeElevation('md'),
      ]}
    >
      {isCenter ? (
        <View style={styles.centerWrapper}>
          <View style={styles.centeredContent}>
            <Text style={[styles.icon, { color: colors.text }]}>{(icon as string) ?? ICONS[tone]}</Text>
            <View style={styles.body}>
              {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
              {description && (
                <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
              )}
              {children}
            </View>
            {dismissible && (
              <Pressable
                accessibilityLabel="Dismiss"
                accessibilityRole="button"
                onPress={onDismiss}
                style={styles.close}
              >
                <Text style={{ color: colors.text }}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <>
          <Text style={[styles.icon, { color: colors.text }]}>{(icon as string) ?? ICONS[tone]}</Text>
          <View style={styles.body}>
            {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
            {description && (
              <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
            )}
            {children}
          </View>
          {dismissible && (
            <Pressable
              accessibilityLabel="Dismiss"
              accessibilityRole="button"
              onPress={onDismiss}
              style={styles.close}
            >
              <Text style={{ color: colors.text }}>✕</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  centeredContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  icon: {
    fontSize: 16,
    lineHeight: 22,
  },
  body: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    ...body.sm,
  },
  close: {
    marginLeft: 'auto',
  },
})
