import type { ReactNode } from 'react'
import { Button, type ButtonProps } from './Button'

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth'> {
  accessibilityLabel: string
  children: ReactNode
}

export function IconButton({ children, accessibilityLabel, ...rest }: IconButtonProps) {
  return (
    <Button accessibilityLabel={accessibilityLabel} {...rest}>
      {children}
    </Button>
  )
}
