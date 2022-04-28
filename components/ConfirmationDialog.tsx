import { Button, Card, Modal, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'

import { useState } from 'react'
import { LoadingIndicator } from './LoadingIndicator'

export const ConfirmationDialog = ({
  visible,
  title,
  message,
  onCancel,
  onDone,
  action,
}: {
  visible: boolean
  title: string
  message: string
  onCancel: () => void
  onDone: () => void
  action: () => Promise<unknown>
}) => {
  const [isLoading, setLoading] = useState(false)

  const onConfirmPress = () => {
    if (isLoading) {
      return
    }
    setLoading(true)
    action()
      .then(() => {
        setLoading(false)
        onDone()
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const onBackDropPress = () => {
    if (isLoading) {
      return
    }
    onCancel()
  }

  const onCancelPress = () => {
    if (isLoading) {
      return
    }
    onCancel()
  }

  return (
    <Modal visible={visible} backdropStyle={modalStyles.backdrop} onBackdropPress={onBackDropPress}>
      <Card disabled={true}>
        <Text category="s1">{title}</Text>
        <Text style={modalStyles.message}>{message}</Text>
        <View style={modalStyles.actionContainer}>
          {isLoading ? <LoadingIndicator /> : undefined}
          <Button appearance="ghost" onPress={onCancelPress}>
            Anuluj
          </Button>
          <Button onPress={onConfirmPress}>Tak</Button>
        </View>
      </Card>
    </Modal>
  )
}

const modalStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  message: {
    marginBottom: 15,
  },
})
