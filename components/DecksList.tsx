import { useState } from 'react'

import { Button, Card, Divider, Icon, Input, List, ListItem, MenuItem, Modal, OverflowMenu, Spinner, Text } from '@ui-kitten/components'
import { useNavigation } from '@react-navigation/native'
import { Deck } from '../features/home/deck'
import { useDeleteDeckMutation, useEditDeckNameMutation, useGetAllQuery } from '../features/home/decks.service'
import { RootStackNavigationProps } from '../types'
import { StyleSheet, View } from 'react-native'

const OptionsIcon = (props: any) => <Icon name="more-horizontal-outline" {...props} />

const ConfirmationDialog = ({
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
  action: () => Promise<void>
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

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, modalStyles.indicator]}>
      <Spinner />
    </View>
  )

  return (
    <Modal visible={visible} backdropStyle={modalStyles.backdrop} onBackdropPress={onBackDropPress}>
      <Card disabled={true}>
        <Text category="s1">{title}</Text>
        <Text>{message}</Text>
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

const EditDeckNameModal = ({
  visible,
  onEditCancel,
  onEditSuccess,
  deckId,
}: {
  deckId: string

  visible: boolean
  onEditCancel: () => void
  onEditSuccess: () => void
}) => {
  const [newDeckName, setNewDeckName] = useState('')
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

  const LoadingIndicator = (props: any) => (
    <View style={[props.style, modalStyles.indicator]}>
      <Spinner />
    </View>
  )

  return (
    <Modal visible={visible} backdropStyle={modalStyles.backdrop} onBackdropPress={onBackDropPress}>
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
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
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
        description={`Nowe: ${item.stats.new} Powtorka: ${item.stats.new}`}
        accessoryRight={OptionsMenu}
        onPress={() => {
          setVisible(false)
          navigation.push('Study', { deckId: item.id })
        }}
      />
      <EditDeckNameModal
        deckId={item.id}
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

export const DecksList = () => {
  const { data, error, isLoading } = useGetAllQuery()

  const renderItem = ({ item }: { item: Deck }) => <DeckItem item={item} />

  return <List data={data} renderItem={renderItem} ItemSeparatorComponent={Divider} />
}
