import { useCallback, type ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useControllableState } from '../hooks/useControllableState'
import type { AnchorState } from './Anchor'
import { Overlay } from './Overlay'

export interface ListOverlayOption<T = unknown> {
  value: T
  label: string
}

export interface ListOverlayProps<T> {
  open: boolean
  onClose: () => void
  anchor: AnchorState
  options: ListOverlayOption<T>[]
  selected?: T | T[]
  highlightedIndex?: number
  onSelect?: (value: T) => void
  renderOption?: (item: ListOverlayOption<T>, state: { highlighted: boolean; selected: boolean }) => ReactNode
  title?: string
}

function defaultRenderOption<T>(item: ListOverlayOption<T>, state: { highlighted: boolean; selected: boolean }) {
  return (
    <View style={[styles.option, state.highlighted && styles.highlighted]}>
      <Text style={state.selected ? styles.selectedText : undefined}>{item.label}</Text>
    </View>
  )
}

function isSelected<T>(selected: T | T[] | undefined, value: T): boolean {
  if (selected === undefined) return false
  if (Array.isArray(selected)) return selected.includes(value)
  return selected === value
}

export function ListOverlay<T>({
  open,
  onClose,
  anchor,
  options,
  selected,
  highlightedIndex,
  onSelect,
  renderOption = defaultRenderOption,
  title,
}: ListOverlayProps<T>) {
  const [internalIndex, setInternalIndex] = useControllableState(
    highlightedIndex,
    options.length > 0 ? 0 : -1,
  )

  const handleSelect = useCallback(
    (value: T) => {
      onSelect?.(value)
      onClose()
    },
    [onSelect, onClose],
  )

  return (
    <Overlay open={open} onClose={onClose}>
      <View
        style={[
          styles.container,
          {
            position: 'absolute',
            left: anchor.x,
            top: anchor.y + anchor.height,
            minWidth: anchor.width,
          },
        ]}
        accessibilityRole="menu"
      >
        {title && <Text style={styles.title}>{title}</Text>}
        <ScrollView style={styles.scroll}>
          {options.map((item, index) => {
            const highlighted = index === internalIndex
            const selectedValue = isSelected(selected, item.value)
            return (
              <Pressable
                key={`option-${index}`}
                onPress={() => handleSelect(item.value)}
                onHoverIn={() => setInternalIndex(index)}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: selectedValue }}
              >
                {renderOption(item, { highlighted, selected: selectedValue })}
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf7f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f4efe6',
    maxHeight: 300,
  },
  title: {
    padding: 12,
    fontWeight: '600',
  },
  scroll: {
    maxHeight: 260,
  },
  option: {
    padding: 12,
  },
  highlighted: {
    backgroundColor: '#f4efe6',
  },
  selectedText: {
    fontWeight: '700',
  },
})
