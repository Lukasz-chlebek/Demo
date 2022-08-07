import { RootStackScreenProps } from '../types'
import { Button, Card, Divider, Icon, Input, Layout, Modal, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { DecksList } from '../components/DecksList'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useAddDeckMutation } from '../data/api'
import { LoadingIndicator } from '../components/LoadingIndicator'

const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />
const AddIcon = (props: any) => <Icon {...props} name="plus-outline" />


const AddDeckModal = ({
  visible,
  onAddCancel,
  onAddSuccess,
}: {
  visible: boolean
  onAddCancel: () => void
  onAddSuccess: () => void
}) => {
  const [newDeckName, setNewDeckName] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [addDeck, { isLoading, isSuccess }] = useAddDeckMutation()

  // @TODO: @kamil reload home list

  const onSavePress = () => {
    if (isLoading) {
      return
    }

    setFormSubmitted(true)
    if (newDeckName) {
      addDeck({
        name: newDeckName,
      })
        .unwrap()
        .then(() => {
          onAddSuccess()
        })
    }
  }

  const onBackDropPress = () => {
    if (isLoading) {
      return
    }
    onAddCancel()
  }

  const onCancelPress = () => {
    if (isLoading) {
      return
    }
    onAddCancel()
  }

  return (
    <Modal visible={visible} backdropStyle={modalStyles.backdrop} onBackdropPress={onBackDropPress}>
      <Card disabled={true}>
        <Text category="s1">Dodaj talię kart</Text>
        <Input
          status={formSubmitted && !newDeckName ? 'danger' : 'basic'}
          style={modalStyles.input}
          value={newDeckName}
          placeholder="Podaj nazwę nowej talii"
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

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const [addModalVisible, setAddModalVisible] = useState(false)

  const renderRightActions = () => (
    <>
      <TopNavigationAction icon={AddIcon} onPress={() => setAddModalVisible(true)} />
    </>
  )

  return (
    <>
      <TopNavigation title="Fiszki" alignment="center" accessoryRight={renderRightActions} />
      <Divider />
      <Layout>
        <AddDeckModal
          visible={addModalVisible}
          onAddCancel={() => setAddModalVisible(false)}
          onAddSuccess={() => setAddModalVisible(false)}
        ></AddDeckModal>

        <DecksList />
      </Layout>
    </>
  )
}
