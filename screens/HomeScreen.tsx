import { RootStackScreenProps } from '../types'
import {
  Button,
  Card,
  Divider,
  Icon,
  Input,
  Layout,
  MenuItem,
  Modal,
  OverflowMenu,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components'
import { DecksList } from '../components/DecksList'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useAddDeckMutation } from '../features/home/decks.service'

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

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, modalStyles.indicator]}>
      <Spinner />
    </View>
  )

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
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const [menuVisible, setMenuVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const renderMenuAction = () => <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />

  const renderRightActions = () => (
    <>
      <TopNavigationAction icon={AddIcon} onPress={() => setAddModalVisible(true)} />

      <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem title="Eksport" />
        <MenuItem title="Import" />
      </OverflowMenu>
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
