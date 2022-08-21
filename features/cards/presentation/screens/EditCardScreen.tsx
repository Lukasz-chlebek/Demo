import { RootStackScreenProps } from '../../../../core/navigation/types'
import { Divider, Input, Layout, Spinner, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import { useState } from 'react'
import { useEditCardMutation, useGetCardQuery } from '../../data/cardsApi'
import { SingleCard } from '../../domain/card'
import { BackIcon, SaveIcon } from '../../../../shared/Icons'

export function EditCardScreen({
  navigation,
  route,
  card,
}: RootStackScreenProps<'EditCard'> & { card: SingleCard }) {
  const [editCard, { isLoading }] = useEditCardMutation()
  const [front, setFront] = useState(card.front)
  const [back, setBack] = useState(card.back)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.pop()} />
  )

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
          })
      }}
    />
  )

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
  const { data, isLoading } = useGetCardQuery({
    deckId: route.params.deckId,
    cardId: route.params.cardId,
  })

  if (isLoading) {
    return <Spinner />
  }

  return <EditCardScreen navigation={navigation} route={route} card={data!}></EditCardScreen>
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 12,
  },
})
