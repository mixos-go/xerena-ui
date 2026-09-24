import { createContext, useContext, type ReactNode } from 'react'
import { View, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { radius } from '../../styles/radius'

export interface InputGroupContextValue {
  hasError: boolean
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null)

export function useInputGroupContext(): InputGroupContextValue | null {
  return useContext(InputGroupContext)
}

export interface InputGroupProps {
  children: ReactNode
  testID?: string
  error?: boolean
}

export function InputGroup({ children, testID, error = false }: InputGroupProps) {
  const colors = useNativeColors()

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: error ? colors.danger : colors.border,
    backgroundColor: 'transparent',
  }

  const contextValue: InputGroupContextValue = {
    hasError: error,
  }

  return (
    <InputGroupContext.Provider value={contextValue}>
      <View testID={testID} style={containerStyle}>{children}</View>
    </InputGroupContext.Provider>
  )
}

export interface InputGroupAddonProps {
  children: ReactNode
  testID?: string
  position?: 'left' | 'right'
}

export function InputGroupAddon({ children, testID, position = 'left' }: InputGroupAddonProps) {
  const colors = useNativeColors()
  const context = useInputGroupContext()

  const addonStyle: ViewStyle = {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: context?.hasError ? colors.dangerSurface : colors.surface,
    borderRightWidth: position === 'left' ? 1 : 0,
    borderLeftWidth: position === 'right' ? 1 : 0,
    borderColor: context?.hasError ? colors.danger : colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  }

  return <View testID={testID} style={addonStyle}>{children}</View>
}