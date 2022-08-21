import { useState } from 'react'

import { Button, Card, Input, Modal, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { LoadingIndicator } from '../../../../shared/LoadingIndicator'
import { useEditDeckNameMutation } from '../../data/homeApi'

export const EditDeckNameModal = ({
  visible,
  onEditCancel,
  onEditSuccess,
  deckId,
  deckName,
}: {
  deckId: number
  deckName: string
  visible: boolean
  onEditCancel: () => void
  onEditSuccess: () => void
}) => {
  const [newDeckName, setNewDeckName] = useState(deckName)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [editDeckName, { isLoading }] = useEditDeckNameMutation()

  const onSavePress = () => {
    if (isLoading) {
      return
    }

    setFormSubmitted(true)
    if (newDeckName) {
      editDeckName({
        deckId,
        name: newDeckName,
      })
        .unwrap()
        .then(() => {
          onEditSuccess()
        })
    }
  }

  const onBackDropPress = () => {
    if (isLoading) {
      return
    }
    onEditCancel()
  }

  const onCancelPress = () => {
    if (isLoading) {
      return
    }
    onEditCancel()
  }

  return (
    <Modal
      visible={visible}
      style={{ width: 300 }}
      backdropStyle={modalStyles.backdrop}
      onBackdropPress={onBackDropPress}
    >
      <Card disabled={true}>
        <Text category="s1">Zmiana nazwy talii</Text>
        <Input
          status={formSubmitted && !newDeckName ? 'danger' : 'basic'}
          style={modalStyles.input}
          value={newDeckName}
          placeholder="Podaj nazwę talii"
          onChangeText={(nextValue) => setNewDeckName(nextValue)}
        />
        <View style={modalStyles.actionContainer}>
          {isLoading ? <LoadingIndicator /> : undefined}
          <Button appearance="ghost" onPress={onCancelPress}>
            Anuluj
          </Button>
          <Button onPress={onSavePress}>Zapisz</Button>
        </View>
      </Card>
    </Modal>
  )
}
const modalStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    marginVertical: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
})
