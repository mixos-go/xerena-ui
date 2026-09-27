'use client'

import { useState } from 'react'
import { Message } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Message
  position="top-right"
  tone="success"
  title="Saved"
  description="Your changes are live."
  dismissible
  onDismiss={close}
/>`

export function MessageDemo() {
  const [visible, setVisible] = useState(true)
  return (
    <Preview title="Alert banner" code={code}>
      <button type="button" onClick={() => setVisible(true)}>
        Show message
      </button>
      {visible && (
        <Message
          position="top-right"
          tone="success"
          title="Saved"
          description="Your changes are live."
          dismissible
          onDismiss={() => setVisible(false)}
        />
      )}
    </Preview>
  )
}
