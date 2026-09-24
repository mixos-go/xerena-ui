import { useCallback, useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'

export interface UseDismissableOptions {
  open: boolean
  onDismiss: () => void
}

export interface UseDismissableResult {
  onRequestClose: () => void
  backdropProps: {
    onStartShouldSetResponder: () => boolean
    onResponderRelease: () => void
  }
}

export function useDismissable({ open, onDismiss }: UseDismissableOptions): UseDismissableResult {
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  const onRequestClose = useCallback(() => {
    if (open) onDismissRef.current()
  }, [open])

  useEffect(() => {
    if (!open) return
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismissRef.current()
      return true
    })
    return () => subscription.remove()
  }, [open])

  const onResponderRelease = useCallback(() => {
    if (open) onDismissRef.current()
  }, [open])

  const backdropProps = {
    onStartShouldSetResponder: () => true,
    onResponderRelease,
  }

  return { onRequestClose, backdropProps }
}
