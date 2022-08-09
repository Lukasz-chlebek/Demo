import { RootStackScreenProps } from '../../types'
import {
  Divider,
  Icon,
  Layout,
  MenuItem,
  OverflowMenu,
  Spinner,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components'
import { View } from 'react-native'
import React, { useState } from 'react'
import { ConfirmationDialog } from '../../components/ConfirmationDialog'
import { useDeleteCardMutation, useGetQuery, useStoreMutation } from '../../data/api'
import { StudyCard } from './StudyCard'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />

export default function StudyScreen({ navigation, route }: RootStackScreenProps<'Study'>) {
  const [menuVisible, setMenuVisible] = useState(false)
  const styles = useStyleSheet(themedStyles)
  const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)
  const [deleteCard, { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess }] =
    useDeleteCardMutation()
  const [storeReply, { isSuccess, isLoading: isReplyLoading }] = useStoreMutation()

  const { data: studyItems, error, isLoading } = useGetQuery({
    deckId: route.params.deckId,
  })

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
  )

  const renderMenuAction = () => <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />

  const renderRightActions = () => (
    <>
      <OverflowMenu anchor={renderMenuAction} visible={menuVisible} onBackdropPress={toggleMenu}>
        <MenuItem
          title="Edytuj kartę"
          onPress={() => {
            setMenuVisible(false)
            navigation.push('EditCard', {
              deckId: route.params.deckId,
              cardId: studyItems![currentCard].cardId,
            })
          }}
        />
        <MenuItem
          title="Usuń kartę"
          onPress={() => {
            setMenuVisible(false)
            setConfirmationDialogVisible(true)
          }}
        />
      </OverflowMenu>
    </>
  )

  const deleteCardAction = () => {
    return deleteCard({
      deckId: route.params.deckId,
      cardId: studyItems![currentCard].cardId,
    }).unwrap()
  }

  const nextCard = () => {
    if (currentCard < studyItems!.length) {
      setCurrentCard(currentCard + 1)
    }
  }

  const saveReply = (response: 'dontknow' | 'difficult' | 'know') => {
    storeReply({
      deckId: route.params.deckId,
      cardId: studyItems![currentCard].cardId, // @TODO: @kamil
      response,
    })
      .unwrap()
      .then(() => {
        nextCard()
      })
  }

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <TopNavigation
        title="Nauka"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={studyItems![currentCard] ? renderRightActions : <></>}
      />
      <Divider />
      <Layout style={{ flex: 1 }}>
        {isReplyLoading ? (
          <View style={{ marginTop: 25, alignSelf: 'center' }}>
            <Spinner />
          </View>
        ) : (
          <>
            {studyItems![currentCard] ? (
              <StudyCard
                deckId={route.params.deckId}
                item={studyItems![currentCard]}
                styles={styles}
                onPress={() => {
                  saveReply('dontknow')
                }}
                onPress1={() => {
                  saveReply('difficult')
                }}
                onPress2={() => {
                  saveReply('know')
                }}
                onDoesNotExist={() => {
                  nextCard()
                }}
              />
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 15 }}>Brak kart do nauki</Text>
            )}
          </>
        )}
      </Layout>
      <ConfirmationDialog
        visible={confirmationDialogVisible}
        title="Potwierdzenie"
        message="Czy chcesz usunąć kartę?"
        onCancel={() => setConfirmationDialogVisible(false)}
        onDone={() => setConfirmationDialogVisible(false)}
        action={deleteCardAction}
      ></ConfirmationDialog>
    </>
  )
}

const themedStyles = StyleService.create({
  front: {
    fontSize: 17,
    padding: 25,
    textAlign: 'center',
  },
  back: {
    fontSize: 17,
    borderTopWidth: 1,
    borderTopColor: 'color-basic-default-border',
    padding: 25,
    textAlign: 'center',
  },
  showBack: {
    margin: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
})
