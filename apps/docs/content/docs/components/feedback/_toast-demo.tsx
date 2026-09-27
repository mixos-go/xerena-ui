'use client'

import { useState } from 'react'
import { Toast } from '@xerena/react'
import { Preview } from '@xerena/preview'

const code = `<Toast
  variant="success"
  title="Saved"
  description="Your changes are live."
  dismissible
  autoHideDuration={4000}
  onDismiss={close}
/>`

export function ToastDemo() {
  const [visible, setVisible] = useState(true)
  return (
    <Preview title="Toast notification" code={code}>
      <button type="button" onClick={() => setVisible(true)}>
        Show toast
      </button>
      {visible && (
        <Toast
          variant="success"
          title="Saved"
          description="Your changes are live."
          dismissible
          autoHideDuration={4000}
          onDismiss={() => setVisible(false)}
        />
      )}
    </Preview>
  )
}
