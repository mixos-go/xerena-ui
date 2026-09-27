'use client'

import { useState } from 'react'
import { Textarea } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Textarea placeholder="Tell us a little about yourself." value={bio} onChange={(event) => setBio(event.target.value)} />`

export function TextareaDemo() {
  const [bio, setBio] = useState('')
  return (
    <Preview title="Your bio" code={code}>
      <Textarea placeholder="Tell us a little about yourself." value={bio} onChange={(event) => setBio(event.target.value)} />
      <p>{bio.length} characters</p>
    </Preview>
  )
}
