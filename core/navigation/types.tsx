import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined
  CardsList: {
    deckId: number
  }
  Study: {
    deckId: number
  }
  AddCard: {
    deckId: number
  }
  EditCard: {
    deckId: number
    cardId: number
  }
  NotFound: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>

export type RootStackNavigationProps<Screen extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, Screen>
