import { useState } from 'react'

import { Button, Card, Divider, Icon, Input, List, ListItem, MenuItem, Modal, OverflowMenu, Text } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { Deck } from '../data/model'
import { useDeleteDeckMutation, useEditDeckNameMutation } from '../data/api'
import { RootStackNavigationProps } from '../types'
import { StyleSheet, View } from 'react-native'
import { ConfirmationDialog } from './ConfirmationDialog'
import { LoadingIndicator } from './LoadingIndicator'

const OptionsIcon = (props: any) => <Icon name="more-horizontal-outline" {...props} />

const EditDeckNameModal = ({
  visible,
  onEditCancel,
  onEditSuccess,
  deckId,
  deckName,
}: {
  deckId: string
  deckName: string
  visible: boolean
  onEditCancel: () => void
  onEditSuccess: () => void
}) => {
  const [newDeckName, setNewDeckName] = useState(deckName)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [editDeckName, { isLoading, isSuccess }] = useEditDeckNameMutation()

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

const DeckItem = ({ item }: { item: Deck }) => {
  const navigation = useNavigation<RootStackNavigationProps<'Home'>>()
  const [visible, setVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false)
  const [deleteDeck] = useDeleteDeckMutation()

  const deleteDeckAction = () => {
    return deleteDeck({
      deckId: item.id,
    }).unwrap()
  }

  const OptionsButton = (props: any) => (
    <Button {...props} accessoryLeft={OptionsIcon} onPress={() => setVisible(true)} size="small" />
  )

  const OptionsMenu = () => (
    <OverflowMenu
      anchor={OptionsButton}
      visible={visible}
      onBackdropPress={() => setVisible(false)}
    >
      <MenuItem
        title="Zmiana nazwy"
        onPress={() => {
          setVisible(false)
          setEditModalVisible(true)
        }}
      />
      <MenuItem
        title="Lista słówek"
        onPress={() => {
          setVisible(false)
          navigation.push('CardsList', { deckId: item.id })
        }}
      />
      <MenuItem
        title="Dodaj słówko"
        onPress={() => {
          setVisible(false)
          navigation.push('AddCard', { deckId: item.id })
        }}
      />
      <MenuItem
        title="Usuń"
        onPress={() => {
          setVisible(false)
          setConfirmationDialogVisible(true)
        }}
      />
    </OverflowMenu>
  )

  return (
    <>
      <ListItem
        title={`${item.name}`}
        // description={`Nowe: ${item.stats.new} Powtorka: ${item.stats.new}`}
        accessoryRight={OptionsMenu}
        onPress={() => {
          setVisible(false)
          navigation.push('Study', { deckId: item.id })
        }}
      />
      <EditDeckNameModal
        deckId={item.id}
        deckName={item.name}
        visible={editModalVisible}
        onEditCancel={() => setEditModalVisible(false)}
        onEditSuccess={() => setEditModalVisible(false)}
      ></EditDeckNameModal>
      <ConfirmationDialog
        visible={confirmationDialogVisible}
        title="Potwierdzenie"
        message="Czy chcesz usunąć talię?"
        onCancel={() => setConfirmationDialogVisible(false)}
        onDone={() => setConfirmationDialogVisible(false)}
        action={deleteDeckAction}
      ></ConfirmationDialog>
    </>
  )
}

export const DecksList = ({ decks }: { decks: Deck[] }) => {
  const renderItem = ({ item }: { item: Deck }) => <DeckItem item={item} />

  return <List data={decks} renderItem={renderItem} ItemSeparatorComponent={Divider} />
}
