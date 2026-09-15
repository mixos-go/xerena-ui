import { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from '../../primitives/Overlay'
import { Pressable } from '../../primitives/Pressable'
import { useNativeColors } from '../../hooks/useNativeColors'
import { nativeElevation } from '../../styles/elevation'
import { radius } from '../../styles/radius'
import { spacing } from '../../styles/spacing'
import { body, display } from '../../styles/typography'

interface DialogContextValue {
  open: boolean
  onClose: () => void
  labelledBy?: string
  setLabelledBy: (id?: string) => void
}

const DialogContext = createContext<DialogContextValue>({
  open: false,
  onClose: () => {},
  setLabelledBy: () => {},
})

function DialogRoot({
  open: controlledOpen,
  onClose = () => {},
  children,
}: {
  open?: boolean
  onClose?: () => void
  children: ReactNode
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [labelledBy, setLabelledBy] = useState<string | undefined>(undefined)
  const isOpen = controlledOpen ?? internalOpen

  const handleClose = () => {
    setInternalOpen(false)
    onClose()
  }

  return (
    <DialogContext.Provider
      value={{
        open: isOpen,
        onClose: handleClose,
        labelledBy,
        setLabelledBy,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}

function DialogPortal({ children }: { children: ReactNode }) {
  const { open, onClose, labelledBy } = useContext(DialogContext)
  const colors = useNativeColors()

  return (
    <Overlay open={open} onClose={onClose}>
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
          nativeElevation('lg'),
        ]}
        accessibilityRole="alert"
        accessibilityLabelledBy={labelledBy}
      >
        {children}
      </View>
    </Overlay>
  )
}

function DialogTitle({ id, children }: { id?: string; children: ReactNode }) {
  const { setLabelledBy } = useContext(DialogContext)
  const generated = useId()
  const titleId = id ?? generated

  useEffect(() => {
    setLabelledBy(titleId)
    return () => setLabelledBy(undefined)
  }, [titleId, setLabelledBy])

  return <Text id={titleId} style={styles.title}>{children}</Text>
}

function DialogDescription({ id, children }: { id?: string; children: ReactNode }) {
  return <Text id={id} style={styles.description}>{children}</Text>
}

import { type ViewStyle } from 'react-native'

function DialogContent({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.contentInner, style]}>{children}</View>
}

function DialogClose({ children = '✕', style }: { children?: ReactNode; style?: ViewStyle }) {
  const { onClose } = useContext(DialogContext)
  return (
    <Pressable accessibilityLabel="Close" accessibilityRole="button" onPress={onClose} style={[styles.close, style]}>
      <Text style={{ color: '#9a8f7e' }}>{children}</Text>
    </Pressable>
  )
}

function DialogOverlay() {
  return null
}

export const Dialog = {
  Root: DialogRoot,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Close: DialogClose,
  Title: DialogTitle,
  Description: DialogDescription,
}

export type DialogRootProps = React.ComponentProps<typeof DialogRoot>
export type DialogPortalProps = React.ComponentProps<typeof DialogPortal>
export type DialogContentProps = React.ComponentProps<typeof DialogContent>
export type DialogCloseProps = React.ComponentProps<typeof DialogClose>
export type DialogTitleProps = React.ComponentProps<typeof DialogTitle>
export type DialogDescriptionProps = React.ComponentProps<typeof DialogDescription>

const styles = StyleSheet.create({
  content: {
    width: '90%',
    maxWidth: 480,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  contentInner: {
    padding: spacing[6],
  },
  title: {
    ...display.xs,
    color: '#2b2620',
    marginBottom: spacing[2],
  },
  description: {
    ...body.md,
    color: '#7c7263',
    marginBottom: spacing[4],
  },
  close: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    padding: spacing[1],
  },
})