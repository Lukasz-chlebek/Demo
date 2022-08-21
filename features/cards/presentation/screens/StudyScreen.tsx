import { RootStackScreenProps } from '../../../../core/navigation/types'
import { Divider, Layout, MenuItem, OverflowMenu, Spinner, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { View } from 'react-native'
import React, { useState } from 'react'
import { ConfirmationDialog } from '../../../../shared/ConfirmationDialog'
import { StudyCard } from '../components/StudyCard'
import { useGetQuery, useStoreMutation } from '../../data/studyApi'
import { useDeleteCardMutation } from '../../data/cardsApi'
import { BackIcon, MenuIcon } from '../../../../shared/Icons'
import { StudyResponse } from '../../domain/study'

export default function StudyScreen({ navigation, route }: RootStackScreenProps<'Study'>) {
  const [deleteCard] = useDeleteCardMutation()
  const [storeReply, { isLoading: isReplyLoading }] = useStoreMutation()
  const { data: studyItems, isLoading } = useGetQuery({
    deckId: route.params.deckId,
  })

  const [menuVisible, setMenuVisible] = useState(false)
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)

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
            setDeleteConfirmationVisible(true)
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

  const saveReply = (response: StudyResponse) => {
    storeReply({
      cardId: studyItems![currentCard].cardId,
      response,
    })
      .unwrap()
      .then(() => {
        nextCard()
      })
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
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
        visible={deleteConfirmationVisible}
        title="Potwierdzenie"
        message="Czy chcesz usunąć kartę?"
        onCancel={() => setDeleteConfirmationVisible(false)}
        onDone={() => setDeleteConfirmationVisible(false)}
        action={deleteCardAction}
      ></ConfirmationDialog>
    </>
  )
}
