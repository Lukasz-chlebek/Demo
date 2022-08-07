import { RootStackScreenProps } from '../types'
import {
  Button,
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
import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import { useDeleteCardMutation, useGetCardQuery, useGetQuery, useStoreMutation } from '../data/api'
import { StudyItem } from '../data/model'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />

const StudyCard = (props: {
  deckId: string
  item: StudyItem
  styles: any
  onPress: () => void
  onPress1: () => void
  onPress2: () => void
  onDoesNotExist: () => void
}) => {
  const [backVisible, setBackVisible] = useState(false)

  const { data, error, isLoading } = useGetCardQuery({
    deckId: props.deckId,
    cardId: props.item.cardId,
  })

  useEffect(() => {
    if(!data && !isLoading){
      props.onDoesNotExist()
    }
  }, [data])

  return isLoading || !data ? (
    <Spinner />
  ) : (
    <>
      <ScrollView>
        <Text style={props.styles.front}>{data!.front}</Text>

        {backVisible ? <Text style={props.styles.back}>{data!.back}</Text> : ''}
      </ScrollView>

      {backVisible ? (
        <>
          <View style={props.styles.buttonContainer}>
            <Button style={[props.styles.button]} status="danger" onPress={props.onPress}>
              Nie wiem
            </Button>
            <Button style={[props.styles.button]} status="warning" onPress={props.onPress1}>
              Trudne
            </Button>
            <Button style={[props.styles.button]} status="success" onPress={props.onPress2}>
              Wiem
            </Button>
          </View>
        </>
      ) : (
        <Button
          onPress={() => {
            setBackVisible(true)
          }}
          style={props.styles.showBack}
        >
          Pokaż odpowiedź
        </Button>
      )}
    </>
  )
}

export default function StudyScreen({ navigation, route }: RootStackScreenProps<'Study'>) {
  const [menuVisible, setMenuVisible] = useState(false)

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
              cardId: data![currentCard].cardId,
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

  const styles = useStyleSheet(themedStyles)
  const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)

  const [deleteCard, { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess }] =
    useDeleteCardMutation()

  const deleteCardAction = () => {
    return deleteCard({
      deckId: route.params.deckId,
      cardId: data![currentCard].cardId,
    }).unwrap()
  }

  const saveReply = (response: 'dontknow' | 'difficult' | 'know') => {
    storeReply({
      deckId: route.params.deckId,
      cardId: data![currentCard].cardId, // @TODO: @kamil
      response,
    })
      .unwrap()
      .then(() => {
        setCurrentCard(currentCard + 1) // @TODO: @kamil limit length
        // @TODO: @kamil next card
        // @TODO: @kamil reset StudyCard
      })
  }

  const [storeReply, { isSuccess }] = useStoreMutation()

  const { data, error, isLoading } = useGetQuery({
    deckId: route.params.deckId,
  })

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <TopNavigation
        title="Nauka"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={data![currentCard] ? renderRightActions : <></>}
      />
      <Divider />
      <Layout style={{ flex: 1 }}>
        {data![currentCard] ? (
          <StudyCard
            deckId={route.params.deckId}
            item={data![currentCard]}
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
              // @TODO: @kamil try next card or finish
              navigation.replace('Home')
            }}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 15 }}>Brak kart do nauki</Text>
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
