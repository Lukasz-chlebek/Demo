import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { Deck } from '../../features/home/domain/deck'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined
  CardsList: {
    deckId: Deck['id']
  }
  Study: {
    deckId: Deck['id']
  }
  AddCard: {
    deckId: Deck['id']
  }
  EditCard: {
    deckId: Deck['id']
    cardId: number // @TODO: @kamil
  }
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>

export type RootStackNavigationProps<Screen extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, Screen>
