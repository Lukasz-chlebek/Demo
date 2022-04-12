import { StyleSheet } from 'react-native'

import { RootTabScreenProps } from '../types'
import { Layout } from '@ui-kitten/components'
import { DecksList } from '../components/DecksList'

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <Layout>
      <DecksList />
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
