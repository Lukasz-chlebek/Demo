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
import React, { useState } from 'react'
import { ConfirmationDialog } from '../components/ConfirmationDialog'
import { useGetQuery, useStoreMutation } from '../data/api'
import { SingleCard } from '../data/model'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />

const StudyCard = (props: {
  card: SingleCard
  styles: any
  onPress: () => void
  onPress1: () => void
  onPress2: () => void
}) => {
  const [backVisible, setBackVisible] = useState(false)

  return (
    <>
      <ScrollView>
        <Text style={props.styles.front}>{props.card.front}</Text>

        {backVisible ? <Text style={props.styles.back}>{props.card.back}</Text> : ''}
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
        <MenuItem title="Edytuj kartę" />
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

  const deleteCardAction = () => {
    // @TODO: @kamil
    return Promise.resolve()
  }

  const saveReply = (response: 'dontknow' | 'difficult' | 'know') => {
    storeReply({
      deckId: route.params.deckId,
      cardId: data![currentCard].id, // @TODO: @kamil
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
            card={data![currentCard]}
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
