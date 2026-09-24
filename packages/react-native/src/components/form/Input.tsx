import { forwardRef, useRef } from 'react'
import { TextInput, View, type TextStyle, type ViewStyle } from 'react-native'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { useControllableState } from '../../hooks/useControllableState'
import { useFieldContext } from './Field'
import { spacing } from '../../styles/spacing'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface InputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof TextInput>,
  'onChange' | 'onChangeText' | 'value' | 'defaultValue' | 'disabled' | 'error'
> {
  variant?: 'outlined' | 'filled'
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onChangeText?: (value: string) => void
  disabled?: boolean
  error?: boolean
  testID?: string
}

const VARIANT_STYLES: Record<
  NonNullable<InputProps['variant']>,
  { backgroundColor: keyof ReturnType<typeof useNativeColors> | 'transparent'; borderWidth: number; borderColorKey: keyof ReturnType<typeof useNativeColors> }
> = {
  outlined: { backgroundColor: 'transparent', borderWidth: 1, borderColorKey: 'border' },
  filled: { backgroundColor: 'surface', borderWidth: 0, borderColorKey: 'border' },
}

export const Input = forwardRef<View, InputProps>(
  function Input(
    {
      variant = 'outlined',
      value: controlledValue,
      defaultValue = '',
      onChange,
      onChangeText,
      disabled,
      error: propError,
      testID,
      style,
      ...rest
    },
    ref,
  ) {
    const colors = useNativeColors()
    const fieldContext = useFieldContext()
    const isDisabled = disabled ?? fieldContext?.disabled ?? false
    const isError = propError ?? fieldContext?.error ?? false

    const [internalValue, setInternalValue] = useControllableState(controlledValue, defaultValue)
    const currentValue = controlledValue ?? internalValue

    const variantStyle = VARIANT_STYLES[variant]

    const handleChangeText = (text: string) => {
      setInternalValue(text)
      onChange?.(text)
      onChangeText?.(text)
    }

    const containerStyle: ViewStyle = {
      borderRadius: radius.md,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      backgroundColor: variantStyle.backgroundColor === 'transparent' ? 'transparent' : colors[variantStyle.backgroundColor],
      borderWidth: variantStyle.borderWidth,
      borderColor:
        isError
          ? colors.danger
          : colors[variantStyle.borderColorKey],
    }

    const textStyle: TextStyle = {
      ...body.md,
      color: colors.text,
    }

    const inputRef = useRef<TextInput>(null)

    const focusInput = () => {
      inputRef.current?.focus()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textInputProps = rest as any

    return (
      <Pressable
        ref={ref}
        testID={testID ? `${testID}-container` : undefined}
        onPress={focusInput}
        disabled={isDisabled}
        style={[{ opacity: isDisabled ? 0.5 : 1 }, containerStyle, style]}
        accessibilityState={{ disabled: isDisabled }}
      >
        <TextInput
          ref={inputRef}
          testID={testID ? `${testID}-input` : undefined}
          value={currentValue}
          onChangeText={handleChangeText}
          disabled={isDisabled}
          editable={!isDisabled}
          style={textStyle}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          caretHidden={false}
          {...textInputProps}
        />
      </Pressable>
    )
  },
)

Input.displayName = 'Input'