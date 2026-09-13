import { Button, type ButtonProps } from './Button'
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children' | 'fullWidth'> { 'aria-label': string; children: React.ReactNode }
export function IconButton({ children, variant = 'primary', size = 'md', ...rest }: IconButtonProps) {
  return <Button variant={variant} size={size} className="xr-iconbutton" {...rest}>{children}</Button>
}