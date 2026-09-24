import { useCallback, useMemo, useState } from 'react'
import { Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { Anchor } from '../../primitives/Anchor'
import { ListOverlay, type ListOverlayOption } from '../../primitives/ListOverlay'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { useFieldContext } from './Field'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  error?: boolean
  testID?: string
  multiple?: boolean
}

export function Select({
  options,
  placeholder = 'Select...',
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  disabled,
  error: propError,
  testID,
  multiple: _multiple = false,
}: SelectProps) {
  void _multiple
  const colors = useNativeColors()
  const fieldContext = useFieldContext()
  const isDisabled = disabled ?? fieldContext?.disabled ?? false
  const isError = propError ?? fieldContext?.error ?? false

  const [internalValue, setInternalValue] = useControllableState(controlledValue, defaultValue)
  const currentValue = controlledValue ?? internalValue

  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue],
  )

  const handleSelect = useCallback(
    (value: string) => {
      setInternalValue(value)
      onValueChange?.(value)
      setOpen(false)
    },
    [setInternalValue, onValueChange],
  )

  const handleOpen = useCallback(() => {
    if (!isDisabled) {
      setOpen(true)
      setHighlightedIndex(0)
    }
  }, [isDisabled])

  const handleClose = useCallback(() => {
    setOpen(false)
    setHighlightedIndex(-1)
  }, [])

  const containerStyle: ViewStyle = {
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: isError ? colors.danger : colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const textStyle: TextStyle = {
    ...body.md,
    color: currentValue ? colors.text : colors.textMuted,
  }

  const chevronStyle: TextStyle = {
    ...body.md,
    color: colors.textMuted,
    marginLeft: spacing[2],
  }

  const listOptions: ListOverlayOption<string>[] = useMemo(
    () => options.map((opt) => ({ value: opt.value, label: opt.label })),
    [options],
  )

  return (
    <Anchor>
      {({ x, y, width, height, setOpen: setAnchorOpen, triggerRef }) => (
        <>
          <Pressable
            ref={triggerRef}
            testID={testID ? `${testID}-trigger` : undefined}
            onPress={handleOpen}
            disabled={isDisabled}
            style={[{ opacity: isDisabled ? 0.5 : 1 }, containerStyle]}
            accessibilityRole="combobox"
            accessibilityState={{
              disabled: isDisabled,
              expanded: open,
            }}
            accessibilityLabel={placeholder}
          >
            <Text style={textStyle} numberOfLines={1}>
              {selectedOption?.label ?? placeholder}
            </Text>
            <Text style={chevronStyle}>▼</Text>
          </Pressable>
          <ListOverlay
            open={open}
            onClose={handleClose}
            anchor={{ x, y, width, height, open, setOpen: setAnchorOpen, triggerRef }}
            options={listOptions}
            selected={currentValue}
            highlightedIndex={highlightedIndex}
            onSelect={handleSelect}
            renderOption={(item, { highlighted, selected }) => (
              <View
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
              </View>
            )}
          />
        </>
      )}
    </Anchor>
  )
}