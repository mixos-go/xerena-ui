import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from 'react'
import { TextInput, Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { Anchor } from '../../primitives/Anchor'
import { ListOverlay, type ListOverlayOption } from '../../primitives/ListOverlay'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { useFieldContext } from './Field'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  disabled?: boolean
  error?: boolean
  testID?: string
  allowCustom?: boolean
  filterOption?: (option: ComboboxOption, query: string) => boolean
}

function defaultFilter(option: ComboboxOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase())
}

export function Combobox({
  options,
  placeholder = 'Search...',
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSearch,
  disabled,
  error: propError,
  testID,
  allowCustom = false,
  filterOption = defaultFilter,
}: ComboboxProps) {
  const colors = useNativeColors()
  const fieldContext = useFieldContext()
  const isDisabled = disabled ?? fieldContext?.disabled ?? false
  const isError = propError ?? fieldContext?.error ?? false

  const [internalValue, setInternalValue] = useControllableState(controlledValue, defaultValue)
  const currentValue = controlledValue ?? internalValue

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<TextInput>(null)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearBlurTimer = useCallback(() => {
    if (blurTimer.current !== null) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (blurTimer.current !== null) clearTimeout(blurTimer.current)
    }
  }, [])

  const filteredOptions = useMemo(
    () => options.filter((opt) => filterOption(opt, query)),
    [options, query, filterOption],
  )

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue],
  )

  const handleSelect = useCallback(
    (value: string) => {
      setInternalValue(value)
      onChange?.(value)
      setQuery('')
      setOpen(false)
      setHighlightedIndex(-1)
    },
    [setInternalValue, onChange],
  )

  const handleInputChange = useCallback(
    (text: string) => {
      clearBlurTimer()
      setQuery(text)
      onSearch?.(text)
      if (!open) {
        setOpen(true)
        setHighlightedIndex(0)
      }
    },
    [open, onSearch, clearBlurTimer],
  )

  const handleInputFocus = useCallback(() => {
    if (!isDisabled) {
      clearBlurTimer()
      setOpen(true)
      setHighlightedIndex(0)
    }
  }, [isDisabled, clearBlurTimer])

  const handleInputBlur = useCallback(() => {
    clearBlurTimer()
    blurTimer.current = setTimeout(() => {
      blurTimer.current = null
      setOpen(false)
      setHighlightedIndex(-1)
    }, 150)
  }, [clearBlurTimer])

  const handleKeyDown = useCallback(
    (event: { nativeEvent: { key: string; preventDefault?: () => void } }) => {
      if (!open || filteredOptions.length === 0) return

      const { key, preventDefault } = event.nativeEvent
      let newIndex = highlightedIndex

      if (key === 'ArrowDown') {
        preventDefault?.()
        newIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1)
      } else if (key === 'ArrowUp') {
        preventDefault?.()
        newIndex = Math.max(highlightedIndex - 1, 0)
      } else if (key === 'Enter') {
        preventDefault?.()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selected = filteredOptions[highlightedIndex]
          if (selected) {
            handleSelect(selected.value)
          }
        } else if (allowCustom && query.trim()) {
          // Handle custom value
          const customValue = query.trim()
          handleSelect(customValue)
        }
        return
      } else if (key === 'Escape') {
        preventDefault?.()
        setOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        return
      } else {
        return
      }

      setHighlightedIndex(newIndex)
    },
    [open, filteredOptions, highlightedIndex, allowCustom, query, handleSelect],
  )

  const containerStyle: ViewStyle = {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: isError ? colors.danger : colors.border,
    backgroundColor: 'transparent',
  }

  const inputStyle: TextStyle = {
    ...body.md,
    color: colors.text,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    flex: 1,
  }

  const listOptions: ListOverlayOption<string>[] = useMemo(
    () => filteredOptions.map((opt) => ({ value: opt.value, label: opt.label })),
    [filteredOptions],
  )

  const textInputProps: ComponentProps<typeof TextInput> = {
    value: query || selectedOption?.label || '',
    onChangeText: handleInputChange,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    onKeyPress: handleKeyDown,
    editable: !isDisabled,
    placeholder: query ? '' : placeholder,
    placeholderTextColor: colors.textMuted,
    selectionColor: colors.primary,
    caretHidden: false,
    style: inputStyle,
    accessibilityRole: 'combobox',
    accessibilityState: {
      disabled: isDisabled,
      expanded: open,
    },
    accessibilityLabel: placeholder,
    autoComplete: 'off',
    autoCorrect: false,
  }

  return (
    <Anchor>
      {({ x, y, width, height, setOpen: setAnchorOpen, triggerRef }) => (
        <View testID={testID} style={containerStyle}>
          <TextInput
            ref={inputRef}
            testID={testID ? `${testID}-input` : undefined}
            {...textInputProps}
          />
          <ListOverlay
            open={open}
            onClose={() => {
              setOpen(false)
              setHighlightedIndex(-1)
            }}
            anchor={{ x, y, width, height, open, setOpen: setAnchorOpen, triggerRef }}
            options={listOptions}
            selected={currentValue}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            renderOption={(item, { highlighted, selected }) => (
              <Pressable
                style={{
                  padding: spacing[3],
                  backgroundColor: highlighted ? colors.surfaceHover : 'transparent',
                }}
              >
                <Text
                  style={{
                    ...body.md,
                    color: selected ? colors.primary : colors.text,
                    fontWeight: selected ? '700' : '400',
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </Anchor>
  )
}