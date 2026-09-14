import { useClassName } from '../../primitives'
export interface ContainerProps {
  variant?: 'centered' | 'fluid' | 'narrow'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children: React.ReactNode
}
const WIDTH = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const
export function Container({ variant = 'centered', size = 'lg', className, children, ...rest }: ContainerProps) {
  const style: React.CSSProperties = variant === 'fluid' ? { width: '100%' } : { maxWidth: WIDTH[size], marginInline: 'auto' }
  if (variant === 'narrow') style.maxWidth = 720
  return (
    <div
      className={useClassName({ className }, ['xr-container', `xr-container--${variant}`, `xr-container--${size}`])}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}
