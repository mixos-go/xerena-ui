import { useCallback, useEffect } from 'react'
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
  const onRequestClose = useCallback(() => {
    if (open) onDismiss()
  }, [open, onDismiss])

  useEffect(() => {
    if (!open) return
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss()
      return true
    })
    return () => subscription.remove()
  }, [open, onDismiss])

  const backdropProps = {
    onStartShouldSetResponder: () => true,
    onResponderRelease: () => onDismiss(),
  }

  return { onRequestClose, backdropProps }
}
