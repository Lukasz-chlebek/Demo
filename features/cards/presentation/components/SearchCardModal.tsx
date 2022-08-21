import { Button, Card, Input, Modal, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { useState } from 'react'

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
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const SearchModal = ({
  visible,
  onSearch,
  onCancel,
}: {
  visible: boolean
  onSearch: (query: string) => void
  onCancel: () => void
}) => {
  const [query, setQuery] = useState('')

  const onSearchPress = () => {
    onSearch(query)
  }

  const onBackDropPress = () => {
    onCancel()
  }

  const onCancelPress = () => {
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      style={{ width: 300 }}
      backdropStyle={modalStyles.backdrop}
      onBackdropPress={onBackDropPress}
    >
      <Card disabled={true}>
        <Text category="s1">Szukaj...</Text>
        <Input
          style={modalStyles.input}
          value={query}
          onChangeText={(nextValue) => setQuery(nextValue)}
        />
        <View style={modalStyles.actionContainer}>
          <Button appearance="ghost" onPress={onCancelPress}>
            Anuluj
          </Button>
          <Button onPress={onSearchPress}>Szukaj</Button>
        </View>
      </Card>
    </Modal>
  )
}
