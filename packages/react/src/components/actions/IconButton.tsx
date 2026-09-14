import { Button, type ButtonProps } from './Button'
import { useClassName } from '../../primitives/useClassName'
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children' | 'fullWidth'> { 'aria-label': string; children: React.ReactNode }
export function IconButton({ children, variant = 'primary', size = 'md', className, ...rest }: IconButtonProps) {
  return <Button variant={variant} size={size} className={useClassName({ className }, ['xr-iconbutton', `xr-iconbutton--${size}`])} {...rest}>{children}</Button>
}
