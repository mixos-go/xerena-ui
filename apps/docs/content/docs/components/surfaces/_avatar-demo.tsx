'use client'

import { Avatar } from '@xerena/react'
import { Preview } from '@xerena/preview'

export function AvatarDemo() {
  return (
    <Preview title="Initials avatar" code='<Avatar variant="initials" initials="AL" size="lg" />'>
      <Avatar variant="initials" initials="AL" size="lg" />
    </Preview>
  )
}
