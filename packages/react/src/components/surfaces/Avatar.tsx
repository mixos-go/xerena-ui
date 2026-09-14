import { useClassName } from '../../primitives/useClassName'
import type { CSSProperties, ReactNode } from 'react'
export interface AvatarProps { variant?: 'image'|'initials'|'icon'; size?: 'sm'|'md'|'lg'|'xl'; shape?: 'square'|'circle'; src?: string; alt?: string; initials?: string; icon?: ReactNode; onClick?: () => void; className?: string }
const SIZES = { sm: 28, md: 40, lg: 56, xl: 80 } as const
export function Avatar({ variant = 'initials', size = 'md', shape = 'circle', src, alt, initials, icon, onClick, className }: AvatarProps) {
  const s = SIZES[size]
  const style: CSSProperties = { width: s, height: s, borderRadius: shape === 'circle' ? 'var(--xr-radius-full)' : 'var(--xr-radius-md)', background: 'var(--xr-semantic-color-surface)', color: 'var(--xr-semantic-color-textMuted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: onClick ? 'pointer' : undefined, transition: 'box-shadow calc(var(--xr-motion-duration-fast) * 1ms) cubic-bezier(var(--xr-motion-easing-standard))' }
  return (
    <div className={useClassName({ className }, ['xr-avatar', `xr-avatar--${size}`, `xr-avatar--${shape}`])} style={style}
      role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onClick={onClick} aria-label={alt}>
      {variant === 'image' && src && <img src={src} alt={alt ?? ''} className="xr-avatar__img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      {variant === 'initials' && <span className="xr-avatar__initials">{initials?.slice(0, 2).toUpperCase()}</span>}
      {variant === 'icon' && <span className="xr-avatar__icon">{icon}</span>}
    </div>
  )
}