import { useClassName } from '../../primitives/useClassName'
export interface BadgeProps { tone?: 'neutral'|'info'|'success'|'warning'|'danger'|'brand'; size?: 'sm'|'md'; className?: string; children: React.ReactNode }
const badgeColors: Record<NonNullable<BadgeProps['tone']>, { backgroundColor: string; color: string }> = {
  neutral: { backgroundColor: 'var(--xr-semantic-color-surface)', color: 'var(--xr-semantic-color-textMuted)' },
  brand: { backgroundColor: 'var(--xr-semantic-color-primary)', color: 'var(--xr-semantic-color-textOnStrong)' },
  info: { backgroundColor: 'var(--xr-semantic-color-infoSurface)', color: 'var(--xr-semantic-color-infoText)' },
  success: { backgroundColor: 'var(--xr-semantic-color-successSurface)', color: 'var(--xr-semantic-color-successText)' },
  warning: { backgroundColor: 'var(--xr-semantic-color-warningSurface)', color: 'var(--xr-semantic-color-warningText)' },
  danger: { backgroundColor: 'var(--xr-semantic-color-dangerSurface)', color: 'var(--xr-semantic-color-dangerText)' },
}
export function Badge({ tone = 'neutral', size = 'md', className, children, ...rest }: BadgeProps) {
  return <span style={badgeColors[tone]} className={useClassName({ className }, ['xr-badge', `xr-badge--${tone}`, `xr-badge--${size}`])} {...rest}>{children}</span>
}