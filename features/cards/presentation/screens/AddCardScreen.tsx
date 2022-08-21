import { RootStackScreenProps } from '../../../../core/navigation/types'
import { Divider, Input, Layout, Spinner, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import { useState } from 'react'
import { useAddCardMutation } from '../../data/cardsApi'
import { BackIcon, SaveIcon } from '../../../../shared/Icons'

export default function AddCardScreen({ navigation, route }: RootStackScreenProps<'AddCard'>) {
  const [addCard, { isLoading }] = useAddCardMutation()
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
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

        addCard({
          deckId: route.params.deckId,
          front,
          back,
        })
          .unwrap()
          .then(() => {
            setFormSubmitted(false)
            setFront('')
            setBack('')
          })
      }}
    />
  )

  return (
    <>
      <TopNavigation
        title="Dodaj kartę"
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

const styles = StyleSheet.create({
  input: {
    marginVertical: 12,
  },
})
