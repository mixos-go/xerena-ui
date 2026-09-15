import type { ReactNode } from 'react'
import { Image, Text, View, type ViewStyle } from 'react-native'
import { useNativeColors } from '../../hooks/useNativeColors'
import { Pressable } from '../../primitives/Pressable'
import { radius } from '../../styles/radius'
import { body } from '../../styles/typography'

export interface AvatarProps {
  variant?: 'image' | 'initials' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'square' | 'circle'
  src?: string
  alt?: string
  initials?: string
  icon?: ReactNode
  onPress?: () => void
  className?: string
  testID?: string
}

const SIZES = { sm: 28, md: 40, lg: 56, xl: 80 } as const

export function Avatar({
  variant = 'initials',
  size = 'md',
  shape = 'circle',
  src,
  alt,
  initials,
  icon,
  onPress,
  testID,
}: AvatarProps) {
  const colors = useNativeColors()
  const s = SIZES[size]

  const style: ViewStyle = {
    width: s,
    height: s,
    borderRadius: shape === 'circle' ? radius.full : radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }

  const content = (
    <>
      {variant === 'image' && src && (
        <Image source={{ uri: src }} style={{ width: s, height: s }} accessibilityLabel={alt} />
      )}
      {variant === 'initials' && (
        <Text style={{ ...body[size === 'sm' ? 'sm' : 'md'], color: colors.textMuted }}>
          {initials?.slice(0, 2).toUpperCase()}
        </Text>
      )}
      {variant === 'icon' && icon}
    </>
  )

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={alt}
        style={style}
      >
        {content}
      </Pressable>
    )
  }

  return (
    <View testID={testID} style={style} accessibilityLabel={alt}>
      {content}
    </View>
  )
}
