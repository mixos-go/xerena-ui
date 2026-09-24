import { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Pressable } from '../../../primitives/Pressable'
import { useNativeColors } from '../../../hooks/useNativeColors'
import { spacing } from '../../../styles/spacing'
import { radius } from '../../../styles/radius'
import { body } from '../../../styles/typography'

export interface PaginationProps {
  total: number
  pageSize: number
  current: number
  onChange: (page: number) => void
  siblingCount?: number
  variant?: 'page' | 'simple'
  testID?: string
}

export function Pagination({
  total,
  pageSize,
  current,
  onChange,
  siblingCount = 1,
  variant = 'page',
  testID = 'pagination',
}: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  const colors = useNativeColors()

  const pagesRange = useCallback((): (number | 'ellipsis')[] => {
    const range: (number | 'ellipsis')[] = []
    const left = Math.max(1, current - siblingCount)
    const right = Math.min(pages, current + siblingCount)

    if (left > 2) range.push(1)
    else for (let i = 1; i < left; i++) range.push(i)
    for (let i = left; i <= right; i++) range.push(i)
    if (right < pages - 1) range.push('ellipsis')
    else for (let i = right + 1; i <= pages; i++) range.push(i)

    return range
  }, [current, pages, siblingCount])

  if (variant === 'simple') {
    return (
      <View
        testID="simple-pagination"
        accessibilityRole="toolbar"
        role="navigation"
        accessibilityLabel="Pagination"
        style={styles.simpleContainer}
      >
        <Text style={[styles.simpleText, { color: colors.text }]}>{current} / {pages}</Text>
        <Pressable
          testID="next-btn"
          onPress={() => onChange(current + 1)}
          disabled={current >= pages}
          accessibilityLabel="Next page"
          style={[
            styles.navButton,
            current >= pages && styles.navButtonDisabled,
            { borderColor: colors.border },
          ]}
        >
          <Text style={[styles.navButtonText, { color: current >= pages ? colors.textMuted : colors.text }]}>→</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View
      testID={testID}
      accessibilityRole="toolbar"
      role="navigation"
      accessibilityLabel="Pagination"
      style={styles.container}
    >
      <Pressable
        testID="prev-btn"
        onPress={() => onChange(current - 1)}
        disabled={current <= 1}
        accessibilityLabel="Previous page"
        style={[
          styles.navButton,
          current <= 1 && styles.navButtonDisabled,
          { borderColor: colors.border },
        ]}
      >
        <Text style={[styles.navButtonText, { color: current <= 1 ? colors.textMuted : colors.text }]}>←</Text>
      </Pressable>

      <View style={styles.pagesContainer}>
        {pagesRange().map((p, i) =>
          p === 'ellipsis' ? (
            <Text key={`e${i}`} style={[styles.ellipsis, { color: colors.textMuted }]}>…</Text>
          ) : (
            <Pressable
              key={p}
              testID={`page-${p}`}
              onPress={() => onChange(p as number)}
              accessibilityRole="button"
              accessibilityState={{ selected: p === current }}
              accessibilityLabel={`Page ${p}`}
              style={[
                styles.pageButton,
                p === current && styles.pageButtonActive,
                {
                  backgroundColor: p === current ? colors.primary : 'transparent',
                  borderColor: p === current ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  { color: p === current ? colors.textOnStrong : colors.text },
                ]}
              >
                {p}
              </Text>
            </Pressable>
          )
        )}
      </View>

      <Pressable
        testID="next-btn"
        onPress={() => onChange(current + 1)}
        disabled={current >= pages}
        accessibilityLabel="Next page"
        style={[
          styles.navButton,
          current >= pages && styles.navButtonDisabled,
          { borderColor: colors.border },
        ]}
      >
        <Text style={[styles.navButtonText, { color: current >= pages ? colors.textMuted : colors.text }]}>→</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  simpleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  simpleText: {
    ...body.md,
  },
  pagesContainer: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  navButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderRadius: radius.md,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    ...body.md,
    fontWeight: '600',
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: spacing[2],
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonActive: {
    // fontWeight moved to Text style inside
  },
  pageButtonText: {
    ...body.md,
  },
  ellipsis: {
    ...body.md,
    paddingHorizontal: spacing[1],
    alignSelf: 'center',
  },
})