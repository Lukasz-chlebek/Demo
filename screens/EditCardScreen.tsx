import { RootStackScreenProps } from '../types'
import { Divider, Icon, Input, Layout, Spinner, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import { useState } from 'react'
import { useEditCardMutation, useGetCardQuery } from '../data/api'
import { SingleCard } from '../data/model'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const SaveIcon = (props: any) => <Icon {...props} name="save" />

export function EditCardScreen({
  navigation,
  route,
  card,
}: RootStackScreenProps<'EditCard'> & { card: SingleCard }) {
  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.pop()} />
  )

  const [editCard, { isLoading, isSuccess }] = useEditCardMutation()

  const renderSaveAction = () => (
    <TopNavigationAction
      icon={SaveIcon}
      onPress={() => {
        if (isLoading) {
          return
        }

        setFormSubmitted(true)

        if (!front || !back) {
          return
        }

        editCard({
          deckId: route.params.deckId,
          cardId: route.params.cardId,
          front,
          back,
        })
          .unwrap()
          .then(() => {
            setFormSubmitted(false)
            setFront('')
            setBack('')

            navigation.pop()
            // @TODO: @kamil refresh card view
          })
      }}
    />
  )

  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [formSubmitted, setFormSubmitted] = useState(false)

  return (
    <>
      <TopNavigation
        title="Edytuj kartę"
        alignment="center"
        accessoryLeft={renderBackAction}
        accessoryRight={renderSaveAction}
      />
      <Divider />
      <Layout style={{ flex: 1, padding: 20 }}>
        <Input
          label="Przód"
          style={styles.input}
          status={formSubmitted && !front ? 'danger' : 'basic'}
          value={front}
          onChangeText={(nextValue) => setFront(nextValue)}
        />
        <Input
          label="Tył"
          style={styles.input}
          status={formSubmitted && !back ? 'danger' : 'basic'}
          value={back}
          onChangeText={(nextValue) => setBack(nextValue)}
        />
        {isLoading ? <Spinner /> : undefined}
      </Layout>
    </>
  )
}

export default function EditCardLoaderScreen({
  navigation,
  route,
}: RootStackScreenProps<'EditCard'>) {
  const {
    data,
    error,
    isLoading: isGetLoading,
  } = useGetCardQuery({
    deckId: route.params.deckId,
    cardId: route.params.cardId,
  })
  return isGetLoading ? (
    <Spinner />
  ) : (
    <EditCardScreen navigation={navigation} route={route} card={data!}></EditCardScreen>
  )
}
const styles = StyleSheet.create({
  input: {
    marginVertical: 12,
  },
})
