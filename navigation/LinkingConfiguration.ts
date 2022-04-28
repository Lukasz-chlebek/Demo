import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'

import { RootStackParamList } from '../types'

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Home: '',
      CardsList: 'cards/:deckId',
      Study: 'study/:deckId',
      AddCard: 'add-card/:deckId',
      NotFound: '*',
    },
  },
}

export default linking
