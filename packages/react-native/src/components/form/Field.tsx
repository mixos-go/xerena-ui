import { createContext, useContext, type ReactNode } from 'react'
import { Text, View, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { spacing } from '../../styles/spacing'
import { body } from '../../styles/typography'
import { radius } from '../../styles/radius'

export interface FieldContextValue {
  error?: boolean
  disabled?: boolean
  required?: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext)
}

export interface FieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  htmlFor?: string
  children: ReactNode
  testID?: string
}

export function Field({
  label,
  hint,
  error,
  required,
  disabled,
  htmlFor,
  children,
  testID,
}: FieldProps) {
  const id = htmlFor ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const colors = useNativeColors()

  const contextValue: FieldContextValue = {
    error: !!error,
    disabled,
    required,
  }

  const containerStyle: ViewStyle = {
    gap: spacing[2],
  }

  return (
    <FieldContext.Provider value={contextValue}>
      <View testID={testID} style={containerStyle}>
        {label && (
          <Text
            style={[
              body.md,
              { color: colors.text },
            ]}
          >
            {label}
            {required && (
              <Text testID="required-indicator" style={{ color: colors.danger, marginLeft: spacing[1] }}>*</Text>
            )}
          </Text>
        )}
        <View style={{ gap: spacing[1] }}>{children}</View>
        {hint && !error && (
          <Text style={[body.sm, { color: colors.textMuted }]}>{hint}</Text>
        )}
        {error && (
          <Text style={[body.sm, { color: colors.danger }]} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
      </View>
    </FieldContext.Provider>
  )
}