import { useState } from 'react'

import { Button, Divider, List, ListItem, MenuItem, OverflowMenu } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { Deck } from '../../domain/deck'
import { RootStackNavigationProps } from '../../../../core/navigation/types'
import { ConfirmationDialog } from '../../../../shared/ConfirmationDialog'
import { useDeleteDeckMutation } from '../../data/homeApi'
import { OptionsIcon } from '../../../../shared/Icons'
import { EditDeckNameModal } from './EditDeckNameModal'

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
        description={`Nowe: ${item.stats.new} Powtorka: ${item.stats.new}`}
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
