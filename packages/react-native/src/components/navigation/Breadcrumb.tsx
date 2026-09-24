import { type ReactNode } from 'react'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'

const SEPS: Record<string, ReactNode> = { slash: '/', chevron: '›', dot: '·' }

export interface BreadcrumbItemProps {
  href?: string
  current?: boolean
  children: ReactNode
  separator?: string
  testID?: string
}

export function BreadcrumbItem({ href, current = false, children, separator = 'slash', testID }: BreadcrumbItemProps) {
  const colors = useNativeColors()

  const sep = SEPS[separator] ?? separator

  if (href && !current) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="link"
        accessibilityLabel={`${children}`}
        style={styles.item}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>{children}</Text>
        {!current && <Text style={[styles.separatorText, { color: colors.textMuted }]}>{sep}</Text>}
      </Pressable>
    )
  }

  return (
    <View testID={testID} style={styles.item} accessibilityRole="text" accessibilityState={{ selected: current }} accessibilityLabel={current ? 'Current page' : undefined}>
      <Text style={[styles.currentText, { color: colors.text, fontWeight: '600' }]}>{children}</Text>
      {!current && <Text style={[styles.separatorText, { color: colors.textMuted }]}>{sep}</Text>}
    </View>
  )
}

export interface BreadcrumbProps {
  children: ReactNode
  testID?: string
}

export function Breadcrumb({ children, testID = 'breadcrumb' }: BreadcrumbProps) {
  return (
    <View
      testID={testID}
      role="navigation"
      accessibilityLabel="Breadcrumb"
      style={styles.container}
    >
      {children}
    </View>
  )
}

Breadcrumb.Item = BreadcrumbItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  linkText: {
    ...body.md,
    textDecorationLine: 'underline',
  },
  currentText: {
    ...body.md,
  },
  separatorText: {
    ...body.md,
  },
})