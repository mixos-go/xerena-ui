import { createContext, useContext, useCallback, useState, type ReactNode } from 'react'
import { View, Pressable, Text, type ViewStyle, type TextStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface CheckboxGroupContextValue {
  value: string[]
  toggle: (value: string) => void
  disabled: boolean
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null)

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
  return useContext(CheckboxGroupContext)
}

export interface CheckboxGroupProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  children: ReactNode
  testID?: string
}

export function CheckboxGroup({
  value: controlledValue,
  onValueChange,
  disabled = false,
  children,
  testID,
}: CheckboxGroupProps) {
  const [internalValue, setInternalValue] = useState<string[]>([])
  const currentValue = controlledValue ?? internalValue

  const toggle = useCallback(
    (value: string) => {
      if (disabled) return
      const next = currentValue.includes(value)
        ? currentValue.filter((v) => v !== value)
        : [...currentValue, value]
      setInternalValue(next)
      onValueChange?.(next)
    },
    [currentValue, onValueChange, disabled],
  )

  const contextValue: CheckboxGroupContextValue = {
    value: currentValue,
    toggle,
    disabled,
  }

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <View testID={testID} role="group" aria-disabled={!!disabled}>
        {children}
      </View>
    </CheckboxGroupContext.Provider>
  )
}

export interface CheckboxGroupItemProps {
  value: string
  children?: ReactNode
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
  indeterminate?: boolean
}

const SIZE = 20
const CHECK_SIZE = 14

export function CheckboxGroupItem({
  value,
  children,
  disabled,
  testID,
  accessibilityLabel,
  indeterminate = false,
}: CheckboxGroupItemProps) {
  const colors = useNativeColors()
  const context = useCheckboxGroupContext()
  const isDisabled = disabled ?? context?.disabled ?? false
  const isChecked = context?.value.includes(value) ?? false

  const handlePress = () => {
    if (!isDisabled && context) {
      context.toggle(value)
    }
  }

  const containerStyle: ViewStyle = {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: (isChecked || indeterminate) ? colors.primary : colors.border,
    backgroundColor: (isChecked || indeterminate) ? colors.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const checkStyle: TextStyle = {
    color: colors.textOnStrong,
    fontSize: CHECK_SIZE,
    fontWeight: 'bold',
  }

  const indeterminateStyle: ViewStyle = {
    width: SIZE * 0.5,
    height: 2,
    backgroundColor: colors.textOnStrong,
    borderRadius: 1,
  }

  const labelStyle: TextStyle = {
    ...body.md,
    color: isDisabled ? colors.textMuted : colors.text,
    marginLeft: spacing[2],
  }

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? 'mixed' : isChecked,
        disabled: isDisabled,
      }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }: { pressed: boolean }) => [
        containerStyle,
        { opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1, transform: pressed && !isDisabled ? [{ scale: 0.95 }] : [] },
      ]}
    >
      {indeterminate ? (
        <View style={indeterminateStyle} />
      ) : isChecked ? (
        <Text style={checkStyle}>✓</Text>
      ) : null}
      {children && <Text style={labelStyle}>{children}</Text>}
    </Pressable>
  )
}