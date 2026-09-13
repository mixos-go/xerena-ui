import { Slot } from '../../primitives/Slot'
import { useClassName, useDisabled, usePress } from '../../primitives'
import type { CSSProperties, ReactNode } from 'react'

export interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'outline' | 'soft' | 'destructive' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  animated?: boolean
  fullWidth?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
  className?: string
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
}

const COLORS: Record<string, string> = {
  primary: 'var(--xr-semantic-color-primary)',
  destructive: 'var(--xr-semantic-color-danger)',
  outline: 'transparent',
  ghost: 'transparent',
  soft: 'var(--xr-semantic-color-primary)',
  link: 'transparent',
}
const TEXT_COLORS: Record<string, string> = {
  primary: 'var(--xr-semantic-color-textOnStrong)',
  destructive: 'var(--xr-semantic-color-textOnStrong)',
  outline: 'var(--xr-semantic-color-primary)',
  ghost: 'var(--xr-semantic-color-primary)',
  soft: 'var(--xr-semantic-color-primary)',
  link: 'var(--xr-semantic-color-primary)',
}

export function Button({
  variant = 'primary', size = 'md', loading = false, animated, fullWidth, disabled,
  leftIcon, rightIcon, asChild, className, children, type = 'button', ...rest
}: ButtonProps) {
  const { pressed, onPointerDown, onPointerUp, onPointerLeave } = usePress()
  const { disabled: isDisabled, 'aria-disabled': ariaDisabled } = useDisabled(disabled || loading)
  const Comp = asChild ? Slot : 'button'
  const base = animated ? 'xr-button xr-button--animated' : 'xr-button'
  const cls = useClassName(
    { className },
    [base, `xr-button--${variant}`, `xr-button--${size}`, isDisabled && 'xr-button--disabled',
     pressed && 'xr-button--active', fullWidth && 'xr-button--full-width'],
  )
  const style: CSSProperties = { backgroundColor: COLORS[variant], color: TEXT_COLORS[variant] }
  const content = asChild ? children : (
    <>
      {leftIcon && <span className="xr-button__icon xr-button__icon--left">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="xr-button__icon xr-button__icon--right">{rightIcon}</span>}
    </>
  )
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cls}
      aria-disabled={ariaDisabled}
      aria-busy={loading}
      disabled={isDisabled}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      style={style}
      {...rest}
    >
      {content}
    </Comp>
  )
}