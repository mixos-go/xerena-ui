'use client'

import { useState } from 'react'
import { Field, Input } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Field label="Email" hint="We never share your email." error={error}>
  <Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
</Field>`

export function FieldDemo() {
  const [email, setEmail] = useState('')
  const error = email !== '' && !email.includes('@') ? 'Enter a valid email.' : undefined
  return (
    <Preview title="Email field" code={code}>
      <Field label="Email" hint="We never share your email." error={error}>
        <Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
      </Field>
    </Preview>
  )
}
