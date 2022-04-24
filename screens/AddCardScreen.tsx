import { RootStackScreenProps } from '../types'
import { Divider, Icon, Input, Layout, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'
import { useState } from 'react'

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />
const SaveIcon = (props: any) => <Icon {...props} name="save" />

export default function AddCardScreen({ navigation }: RootStackScreenProps<'AddCard'>) {
  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={() => navigation.replace('Home')} />
  )

  const renderSaveAction = () => (
    <TopNavigationAction
      icon={SaveIcon}
      onPress={() => {
        setFormSubmitted(true)

        if (!front || !back) {
          return
        }
      }}
    />
  )

  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

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
      </Layout>
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    marginVertical: 12,
  },
})
